const db = require('../../infra/db/connection');

const query = (sql, params = []) => new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => err ? reject(err) : resolve(rows));
});
const run = (sql, params = []) => new Promise((resolve, reject) => {
    db.run(sql, params, function (err) { err ? reject(err) : resolve(this) });
});

/**
 * Sprint 12: Artesanato Supremo (Técnicas Próprias)
 * Criar técnicas personalizadas
 */

async function createCustomTechnique(phoneNumber, techniqueName, baseTechniqueId) {
    // 1. Carrega jogador
    const playerRows = await query(`SELECT id FROM players WHERE phone_number = ?`, [phoneNumber]);
    if (playerRows.length === 0) throw new Error('Seu personagem não foi encontrado. Use /registrar.');
    const playerId = playerRows[0].id;

    // 2. Verifica se conhece a técnica base
    const knownRows = await query(`SELECT * FROM player_techniques WHERE player_id = ? AND technique_id = ?`, [playerId, baseTechniqueId]);
    if (knownRows.length === 0) {
        return { formattedResponse: `⚠️ Você não conhece a técnica base ${baseTechniqueId}.` };
    }

    // 3. Consome materiais (simplificado: espírito)
    const playerAttributes = await query(`SELECT spirit_stones FROM player_attributes WHERE player_id = ?`, [playerId]);
    if (playerAttributes[0].spirit_stones < 500) {
        return { formattedResponse: '⚠️ Você precisa de 500 pedras espirituais para criar uma técnica própria.' };
    }
    await run(`UPDATE player_attributes SET spirit_stones = spirit_stones - 500 WHERE player_id = ?`, [playerId]);

    // 4. Cria técnica customizada
    await run(`INSERT INTO custom_techniques (player_id, name, base_technique_id, effects) VALUES (?, ?, ?, ?)`, [playerId, techniqueName, baseTechniqueId, JSON.stringify([])]);

    // 5. Registra log
    await run(`INSERT INTO game_logs (service_name, event_type, action, player_id, source_context, command_text, payload_json, status) VALUES ('techniqueCraftService', 'create', 'success', ?, 'whatsapp', '/tecnica criar', ?, 'success')`, [playerId, JSON.stringify({ technique_name: techniqueName, base_id: baseTechniqueId })]);

    return { formattedResponse: `📜 Técnica própria "${techniqueName}" criada baseada na técnica ${baseTechniqueId}!` };
}

async function addEffectToTechnique(phoneNumber, techniqueId, effectType, value) {
    // 1. Carrega jogador
    const playerRows = await query(`SELECT id FROM players WHERE phone_number = ?`, [phoneNumber]);
    if (playerRows.length === 0) throw new Error('Seu personagem não foi encontrado. Use /registrar.');
    const playerId = playerRows[0].id;

    // 2. Busca técnica custom
    const techRows = await query(`SELECT * FROM custom_techniques WHERE id = ? AND player_id = ?`, [techniqueId, playerId]);
    if (techRows.length === 0) {
        return { formattedResponse: `⚠️ Técnica custom ${techniqueId} não encontrada.` };
    }
    const tech = techRows[0];

    // 3. Adiciona efeito
    const effects = JSON.parse(tech.effects);
    effects.push({ type: effectType, value: parseInt(value) });
    await run(`UPDATE custom_techniques SET effects = ? WHERE id = ?`, [JSON.stringify(effects), techniqueId]);

    // 4. Registra log
    await run(`INSERT INTO game_logs (service_name, event_type, action, player_id, source_context, command_text, payload_json, status) VALUES ('techniqueCraftService', 'add_effect', 'success', ?, 'whatsapp', '/tecnica efeito', ?, 'success')`, [playerId, JSON.stringify({ technique_id: techniqueId, effect: { type: effectType, value } })]);

    return { formattedResponse: `📜 Efeito ${effectType} (+${value}) adicionado à técnica "${tech.name}"!` };
}

async function listCustomTechniques(phoneNumber) {
    // 1. Carrega jogador
    const playerRows = await query(`SELECT id FROM players WHERE phone_number = ?`, [phoneNumber]);
    if (playerRows.length === 0) throw new Error('Seu personagem não foi encontrado. Use /registrar.');
    const playerId = playerRows[0].id;

    // 2. Lista técnicas custom
    const techniques = await query(`SELECT * FROM custom_techniques WHERE player_id = ?`, [playerId]);

    if (techniques.length === 0) {
        return { formattedResponse: '📜 Você não possui técnicas próprias. Crie uma com /tecnica criar [nome] [id_base].' };
    }

    let response = `📜 Suas Técnicas Próprias:\n`;
    techniques.forEach(tech => {
        const effects = JSON.parse(tech.effects);
        response += `- ${tech.name} (ID: ${tech.id}) - Efeitos: ${effects.length}\n`;
    });

    return { formattedResponse: response };
}

module.exports = { 
    createCustomTechnique, 
    addEffectToTechnique, 
    listCustomTechniques
};
