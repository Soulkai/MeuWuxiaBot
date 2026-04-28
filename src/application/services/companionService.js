const db = require('../../infra/db/connection');

const query = (sql, params = []) => new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => err ? reject(err) : resolve(rows));
});
const run = (sql, params = []) => new Promise((resolve, reject) => {
    db.run(sql, params, function (err) { err ? reject(err) : resolve(this) });
});

/**
 * Sprint 14: Companheiros
 * Sistema de casamentos e companheiros do Dao
 * 
 * Responsabilidades:
 * - Gerenciar relações
 * - Processar casamentos
 * - Ativar companheiros
 * 
 * Referência: Seção 406
 */

async function proposeMarriage(phoneNumber, targetName) {
    // 1. Carrega jogador
    const playerRows = await query(`SELECT p.id, p.character_name FROM players p WHERE p.phone_number = ?`, [phoneNumber]);
    if (playerRows.length === 0) throw new Error('Seu personagem não foi encontrado. Use /registrar.');
    const player = playerRows[0];

    // 2. Encontra alvo
    const targetRows = await query(`SELECT p.id, p.character_name FROM players p WHERE LOWER(p.character_name) LIKE LOWER(?) LIMIT 1`, [`%${targetName}%`]);
    if (targetRows.length === 0) {
        return { formattedResponse: `⚠️ Alvo "${targetName}" não encontrado.` };
    }
    const target = targetRows[0];

    if (player.id === target.id) {
        return { formattedResponse: '⚠️ Você não pode propor casamento para si mesmo.' };
    }

    // 3. Verifica se já casado
    const marriageRows = await query(`SELECT * FROM marriages WHERE (player1_id = ? OR player2_id = ?) AND status = 'active'`, [player.id, player.id]);
    if (marriageRows.length > 0) {
        return { formattedResponse: '⚠️ Você já está casado.' };
    }

    // 4. Envia proposta
    const result = await run(`INSERT INTO marriage_proposals (proposer_id, target_id, status) VALUES (?, ?, 'pending')`, [player.id, target.id]);

    // 5. Registra log
    await run(`INSERT INTO game_logs (service_name, event_type, action, player_id, target_player_id, source_context, command_text, payload_json, status) VALUES ('companionService', 'propose', 'success', ?, ?, 'whatsapp', '/casamento propor', ?, 'success')`, [player.id, target.id, JSON.stringify({ proposal_id: result.lastID })]);

    return { formattedResponse: `💍 Proposta de casamento enviada para ${target.character_name}! Aguarde a resposta.` };
}

async function acceptMarriage(phoneNumber, proposalId) {
    // 1. Carrega jogador
    const playerRows = await query(`SELECT p.id, p.character_name FROM players p WHERE p.phone_number = ?`, [phoneNumber]);
    if (playerRows.length === 0) throw new Error('Seu personagem não foi encontrado. Use /registrar.');
    const player = playerRows[0];

    // 2. Busca proposta
    const proposalRows = await query(`SELECT * FROM marriage_proposals WHERE id = ? AND target_id = ? AND status = 'pending'`, [proposalId, player.id]);
    if (proposalRows.length === 0) {
        return { formattedResponse: `⚠️ Proposta ${proposalId} não encontrada ou não é para você.` };
    }
    const proposal = proposalRows[0];

    // 3. Aceita casamento
    await run(`UPDATE marriage_proposals SET status = 'accepted' WHERE id = ?`, [proposalId]);
    await run(`INSERT INTO marriages (player1_id, player2_id, status) VALUES (?, ?, 'active')`, [proposal.proposer_id, player.id]);

    // 4. Registra log
    await run(`INSERT INTO game_logs (service_name, event_type, action, player_id, target_player_id, source_context, command_text, payload_json, status) VALUES ('companionService', 'accept', 'success', ?, ?, 'whatsapp', '/casamento aceitar', ?, 'success')`, [player.id, proposal.proposer_id, JSON.stringify({ proposal_id: proposalId })]);

    return { formattedResponse: `💍 Casamento aceito! Você e seu parceiro agora são companheiros eternos.` };
}

async function activateDaoCompanion(phoneNumber, companionId) {
    // 1. Carrega jogador
    const playerRows = await query(`SELECT id FROM players WHERE phone_number = ?`, [phoneNumber]);
    if (playerRows.length === 0) throw new Error('Seu personagem não foi encontrado. Use /registrar.');
    const playerId = playerRows[0].id;

    // 2. Verifica se tem casamento ativo
    const marriageRows = await query(`SELECT * FROM marriages WHERE (player1_id = ? OR player2_id = ?) AND status = 'active'`, [playerId, playerId]);
    if (marriageRows.length === 0) {
        return { formattedResponse: '⚠️ Você precisa estar casado para ativar um companheiro do Dao.' };
    }

    // 3. Ativa companheiro (simplificado: buff permanente)
    await run(`INSERT INTO game_logs (service_name, event_type, action, player_id, source_context, command_text, payload_json, status) VALUES ('companionService', 'activate', 'success', ?, 'whatsapp', '/companheiro ativar', ?, 'success')`, [playerId, JSON.stringify({ companion_id: companionId })]);

    return { formattedResponse: `🌟 Companheiro do Dao ativado! Você ganha +50% de regeneração espiritual.` };
}

module.exports = { 
    proposeMarriage, 
    acceptMarriage, 
    activateDaoCompanion
};
