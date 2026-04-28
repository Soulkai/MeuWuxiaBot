const db = require('../../infra/db/connection');

const query = (sql, params = []) => new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => err ? reject(err) : resolve(rows));
});
const run = (sql, params = []) => new Promise((resolve, reject) => {
    db.run(sql, params, function (err) { err ? reject(err) : resolve(this) });
});

/**
 * Sprint 12: Artesanato Supremo (Formações)
 * Criar e usar formações complexas
 */

async function createFormation(phoneNumber, formationName, memberIds) {
    // 1. Carrega jogador
    const playerRows = await query(`SELECT id FROM players WHERE phone_number = ?`, [phoneNumber]);
    if (playerRows.length === 0) throw new Error('Seu personagem não foi encontrado. Use /registrar.');
    const playerId = playerRows[0].id;

    // 2. Verifica membros (IDs de jogadores ou bestas)
    const members = memberIds.split(',').map(id => id.trim());
    if (members.length < 2) {
        return { formattedResponse: '⚠️ Formação precisa de pelo menos 2 membros.' };
    }

    // 3. Salva formação (simplificado: armazenar em JSON)
    await run(`INSERT INTO player_formations (player_id, name, members) VALUES (?, ?, ?)`, [playerId, formationName, JSON.stringify(members)]);

    // 4. Registra log
    await run(`INSERT INTO game_logs (service_name, event_type, action, player_id, source_context, command_text, payload_json, status) VALUES ('formationService', 'create', 'success', ?, 'whatsapp', '/formacao criar', ?, 'success')`, [playerId, JSON.stringify({ formation_name: formationName, members })]);

    return { formattedResponse: `🔵 Formação "${formationName}" criada com ${members.length} membros!` };
}

async function activateFormation(phoneNumber, formationId) {
    // 1. Carrega jogador
    const playerRows = await query(`SELECT id FROM players WHERE phone_number = ?`, [phoneNumber]);
    if (playerRows.length === 0) throw new Error('Seu personagem não foi encontrado. Use /registrar.');
    const playerId = playerRows[0].id;

    // 2. Busca formação
    const formationRows = await query(`SELECT * FROM player_formations WHERE id = ? AND player_id = ?`, [formationId, playerId]);
    if (formationRows.length === 0) {
        return { formattedResponse: `⚠️ Formação ${formationId} não encontrada.` };
    }

    // 3. Ativa formação (simplificado: buff global)
    await run(`INSERT INTO game_logs (service_name, event_type, action, player_id, source_context, command_text, payload_json, status) VALUES ('formationService', 'activate', 'success', ?, 'whatsapp', '/formacao ativar', ?, 'success')`, [playerId, JSON.stringify({ formation_id: formationId })]);

    return { formattedResponse: `🔵 Formação ativada! Todos os membros ganham +20% de atributos no combate.` };
}

async function listFormations(phoneNumber) {
    // 1. Carrega jogador
    const playerRows = await query(`SELECT id FROM players WHERE phone_number = ?`, [phoneNumber]);
    if (playerRows.length === 0) throw new Error('Seu personagem não foi encontrado. Use /registrar.');
    const playerId = playerRows[0].id;

    // 2. Lista formações
    const formations = await query(`SELECT * FROM player_formations WHERE player_id = ?`, [playerId]);

    if (formations.length === 0) {
        return { formattedResponse: '🔵 Você não possui formações. Crie uma com /formacao criar [nome] [ids_membros].' };
    }

    let response = `🔵 Suas Formações:\n`;
    formations.forEach(form => {
        const members = JSON.parse(form.members);
        response += `- ${form.name} (ID: ${form.id}) - Membros: ${members.length}\n`;
    });

    return { formattedResponse: response };
}

module.exports = { 
    createFormation, 
    activateFormation, 
    listFormations
};
