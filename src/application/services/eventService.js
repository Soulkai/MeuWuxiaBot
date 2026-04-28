const db = require('../../infra/db/connection');

const query = (sql, params = []) => new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => err ? reject(err) : resolve(rows));
});
const run = (sql, params = []) => new Promise((resolve, reject) => {
    db.run(sql, params, function (err) { err ? reject(err) : resolve(this) });
});

/**
 * Sprint 14: Eventos Globais
 * Orquestrador de eventos globais do servidor
 * 
 * Responsabilidades:
 * - Gerenciar eventos
 * - Sincronizar NPCs
 * - Processar interações
 * 
 * Referência: Seção 406
 */

async function listActiveEvents(phoneNumber) {
    const events = await query(`SELECT * FROM global_events WHERE active = 1`);
    if (events.length === 0) {
        return { formattedResponse: '📅 Nenhum evento global ativo no momento.' };
    }
    let response = '📅 Eventos Globais Ativos:\n';
    events.forEach(event => {
        response += `ID: ${event.id} - ${event.type}: ${event.description}\n`;
    });
    return { formattedResponse: response };
}

async function joinEvent(phoneNumber, eventId) {
    // Carrega jogador
    const playerRows = await query(`SELECT id FROM players WHERE phone_number = ?`, [phoneNumber]);
    if (playerRows.length === 0) throw new Error('Jogador não encontrado.');
    const playerId = playerRows[0].id;

    // Verifica se evento existe e está ativo
    const eventRows = await query(`SELECT * FROM global_events WHERE id = ? AND active = 1`, [eventId]);
    if (eventRows.length === 0) {
        return { formattedResponse: '⚠️ Evento não encontrado ou já encerrado.' };
    }

    // Verifica se já participou
    const participationRows = await query(`SELECT * FROM event_participants WHERE player_id = ? AND event_id = ?`, [playerId, eventId]);
    if (participationRows.length > 0) {
        return { formattedResponse: '⚠️ Você já está participando deste evento.' };
    }

    // Adiciona participação
    await run(`INSERT INTO event_participants (player_id, event_id) VALUES (?, ?)`, [playerId, eventId]);
    return { formattedResponse: `✅ Você se juntou ao evento ID ${eventId}! Boa sorte!` };
}

async function interactWithNPC(phoneNumber, npcId) {
    // Placeholder: interação com NPC
    // Por enquanto, apenas simular uma interação simples
    return { formattedResponse: `🧙 NPC ${npcId} diz: "Saudações, cultivador! Que o Dao guie seus passos."` };
}

async function createGlobalEvent(eventType, description, rewards) {
    const result = await run(
        `INSERT INTO global_events (type, description, rewards, active) VALUES (?, ?, ?, 1)`,
        [eventType, description, JSON.stringify(rewards)]
    );
    return { eventId: result.lastID, formattedResponse: `🌟 Evento global "${eventType}" criado com sucesso!` };
}

module.exports = { 
    listActiveEvents, 
    joinEvent, 
    interactWithNPC,
    createGlobalEvent
};
