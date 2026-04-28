const db = require('../connection');

const query = (sql, params = []) => new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => err ? reject(err) : resolve(rows));
});
const run = (sql, params = []) => new Promise((resolve, reject) => {
    db.run(sql, params, function (err) { err ? reject(err) : resolve(this) });
});

/**
 * Repository para Combate
 * Gerencia persistência de turnos e estado de combate
 * 
 * Referência: Seções 267, 1305
 */

async function createCombat(type, playerIds, initialState) {
    const playerIdsJson = JSON.stringify(playerIds);
    const stateJson = JSON.stringify(initialState);
    
    const result = await run(
        `INSERT INTO active_combats (type, player_ids, state) VALUES (?, ?, ?)`,
        [type, playerIdsJson, stateJson]
    );
    
    return result.lastID;
}

async function getCombatById(combatId) {
    const rows = await query(`SELECT * FROM active_combats WHERE id = ?`, [combatId]);
    if (rows.length === 0) return null;
    
    const combat = rows[0];
    combat.player_ids = JSON.parse(combat.player_ids);
    combat.state = JSON.parse(combat.state);
    return combat;
}

async function getCombatByPlayer(playerId) {
    // Busca combate onde o player está envolvido, usando JSON exact match para evitar falsos positivos
    const rows = await query(
        `SELECT ac.* FROM active_combats ac
         JOIN json_each(ac.player_ids) je ON je.value = ?
         LIMIT 1`,
        [playerId]
    );
    if (rows.length === 0) return null;

    const combat = rows[0];
    combat.player_ids = JSON.parse(combat.player_ids);
    combat.state = JSON.parse(combat.state);
    return combat;
}

async function updateCombatState(combatId, newState) {
    const stateJson = JSON.stringify(newState);
    await run(
        `UPDATE active_combats SET state = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
        [stateJson, combatId]
    );
}

async function advanceTurn(combatId) {
    await run(
        `UPDATE active_combats SET current_turn = current_turn + 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
        [combatId]
    );
}

async function deleteCombat(combatId) {
    await run(`DELETE FROM active_combats WHERE id = ?`, [combatId]);
}

async function getActiveCombatsByType(type) {
    const rows = await query(`SELECT * FROM active_combats WHERE type = ?`, [type]);
    return rows.map(row => {
        row.player_ids = JSON.parse(row.player_ids);
        row.state = JSON.parse(row.state);
        return row;
    });
}

module.exports = {
    createCombat,
    getCombatById,
    getCombatByPlayer,
    updateCombatState,
    advanceTurn,
    deleteCombat,
    getActiveCombatsByType
};
