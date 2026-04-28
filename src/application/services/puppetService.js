const db = require('../../infra/db/connection');

const query = (sql, params = []) => new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => err ? reject(err) : resolve(rows));
});
const run = (sql, params = []) => new Promise((resolve, reject) => {
    db.run(sql, params, function (err) { err ? reject(err) : resolve(this) });
});

const combatRepo = require('../../infra/db/repositories/combatRepository');

/**
 * Sprint 12: Artesanato Supremo (Marionetes)
 * Criar e usar marionetes de combate
 */

async function createPuppet(phoneNumber, puppetName) {
    // 1. Carrega jogador
    const playerRows = await query(`SELECT id FROM players WHERE phone_number = ?`, [phoneNumber]);
    if (playerRows.length === 0) throw new Error('Seu personagem não foi encontrado. Use /registrar.');
    const playerId = playerRows[0].id;

    // 2. Verifica materiais (simplificado: madeira e espírito)
    const woodRows = await query(`SELECT quantity FROM player_inventory WHERE player_id = ? AND item_id = (SELECT id FROM items WHERE name LIKE '%madeira%')`, [playerId]);
    const spiritRows = await query(`SELECT spirit_stones FROM player_attributes WHERE player_id = ?`, [playerId]);
    if ((woodRows[0]?.quantity || 0) < 10 || (spiritRows[0]?.spirit_stones || 0) < 100) {
        return { formattedResponse: '⚠️ Materiais insuficientes: 10 unidades de madeira e 100 pedras espirituais.' };
    }

    // 3. Consome materiais
    await run(`UPDATE player_inventory SET quantity = quantity - 10 WHERE player_id = ? AND item_id = (SELECT id FROM items WHERE name LIKE '%madeira%')`, [playerId]);
    await run(`UPDATE player_attributes SET spirit_stones = spirit_stones - 100 WHERE player_id = ?`, [playerId]);

    // 4. Cria marionete (adiciona ao inventário como item especial)
    const puppetItemId = 999; // ID fictício para marionete
    await run(`INSERT OR REPLACE INTO player_inventory (player_id, item_id, quantity, custom_name) VALUES (?, ?, 1, ?)`, [playerId, puppetItemId, puppetName]);

    // 5. Registra log
    await run(`INSERT INTO game_logs (service_name, event_type, action, player_id, source_context, command_text, payload_json, status) VALUES ('puppetService', 'create', 'success', ?, 'whatsapp', '/marionete criar', ?, 'success')`, [playerId, JSON.stringify({ puppet_name: puppetName })]);

    return { formattedResponse: `🪄 Marionete "${puppetName}" criada com sucesso!` };
}

async function activatePuppet(phoneNumber, puppetId) {
    // 1. Carrega jogador
    const playerRows = await query(`SELECT id FROM players WHERE phone_number = ?`, [phoneNumber]);
    if (playerRows.length === 0) throw new Error('Seu personagem não foi encontrado. Use /registrar.');
    const playerId = playerRows[0].id;

    // 2. Verifica marionete
    const puppetRows = await query(`SELECT * FROM player_inventory WHERE player_id = ? AND item_id = ? AND quantity > 0`, [playerId, puppetId]);
    if (puppetRows.length === 0) {
        return { formattedResponse: `⚠️ Marionete ${puppetId} não encontrada.` };
    }

    // 3. Ativa marionete: aplica buff ao combate ativo ou registra para próxima luta (simplificado)
    try {
        const combat = await combatRepo.getCombatByPlayer(playerId);
        if (combat) {
            if (!combat.state.players[playerId].buffs) combat.state.players[playerId].buffs = [];
            combat.state.players[playerId].buffs.push({ type: 'puppet', value: 10, duration: 1 });
            await combatRepo.updateCombatState(combat.id, combat.state);
            await run(`INSERT INTO game_logs (service_name, event_type, action, player_id, source_context, command_text, payload_json, status) VALUES ('puppetService', 'activate', 'applied_in_combat', ?, 'whatsapp', '/marionete ativar', ?, 'success')`, [playerId, JSON.stringify({ puppet_id: puppetId })]);
            return { formattedResponse: `🎭 Marionete ativada e buff aplicado no combate atual! (+10 de ataque por 1 turno)` };
        }
    } catch (e) {
        // falha ao aplicar em combate; prossegue com fallback
    }

    // Se não estiver em combate, apenas registra log e avisa que o buff será usado no próximo combate
    await run(`INSERT INTO game_logs (service_name, event_type, action, player_id, source_context, command_text, payload_json, status) VALUES ('puppetService', 'activate', 'queued_for_next_combat', ?, 'whatsapp', '/marionete ativar', ?, 'success')`, [playerId, JSON.stringify({ puppet_id: puppetId })]);

    return { formattedResponse: `🎭 Marionete ativada! Buff de +10 de ataque será aplicado no seu próximo combate.` };
}

async function listPuppets(phoneNumber) {
    // 1. Carrega jogador
    const playerRows = await query(`SELECT id FROM players WHERE phone_number = ?`, [phoneNumber]);
    if (playerRows.length === 0) throw new Error('Seu personagem não foi encontrado. Use /registrar.');
    const playerId = playerRows[0].id;

    // 2. Lista marionetes
    const puppets = await query(`SELECT pi.*, i.name FROM player_inventory pi JOIN items i ON pi.item_id = i.id WHERE pi.player_id = ? AND pi.item_id = 999`, [playerId]); // ID fictício

    if (puppets.length === 0) {
        return { formattedResponse: '🎭 Você não possui marionetes. Crie uma com /marionete criar [nome].' };
    }

    let response = `🎭 Suas Marionetes:\n`;
    puppets.forEach(puppet => {
        response += `- ${puppet.custom_name || puppet.name} (ID: ${puppet.item_id})\n`;
    });

    return { formattedResponse: response };
}

module.exports = { 
    createPuppet, 
    activatePuppet, 
    listPuppets
};
