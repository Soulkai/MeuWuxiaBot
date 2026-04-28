const db = require('../../infra/db/connection');

const query = (sql, params = []) => new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => err ? reject(err) : resolve(rows));
});
const run = (sql, params = []) => new Promise((resolve, reject) => {
    db.run(sql, params, function (err) { err ? reject(err) : resolve(this) });
});

async function getNearbyAreas(phoneNumber) {
    const playerQuery = `SELECT p.id, p.character_name, p.region_id, r.code, r.name, r.danger_level FROM players p JOIN regions r ON p.region_id = r.id WHERE p.phone_number = ?`;
    const playerResult = await query(playerQuery, [phoneNumber]);
    if (playerResult.length === 0) throw new Error('Personagem não encontrado.');
    const player = playerResult[0];

    const codeParts = player.code.split('_');
    const type = codeParts[0]; 
    const E = codeParts[1];
    let sqlNearby = '';

    // Lógica Hierárquica de Visão
    if (type === 'area') {
        const K = codeParts[2];
        sqlNearby = `SELECT id, name, danger_level, min_realm_index FROM regions WHERE code LIKE 'area_${E}_${K}_%' OR code = 'king_${E}_${K}' ORDER BY id ASC`;
    } else if (type === 'king') {
        const K = codeParts[2];
        sqlNearby = `SELECT id, name, danger_level, min_realm_index FROM regions WHERE code LIKE 'area_${E}_${K}_%' OR code LIKE 'king_${E}_%' OR code = 'emp_${E}' ORDER BY id ASC`;
    } else if (type === 'emp') {
        sqlNearby = `SELECT id, name, danger_level, min_realm_index FROM regions WHERE code LIKE 'king_${E}_%' OR code LIKE 'emp_%' ORDER BY id ASC`;
    }

    const nearbyRegions = await query(sqlNearby);
    return { player, nearbyRegions };
}

async function travelTo(phoneNumber, targetIdOrName) {
    const { player, nearbyRegions } = await getNearbyAreas(phoneNumber);
    
    // Busca a área na lista de áreas válidas e próximas
    const target = nearbyRegions.find(r => r.id.toString() === targetIdOrName || r.name.toLowerCase().includes(targetIdOrName.toLowerCase()));
    
    if (!target) throw new Error('Área não encontrada ou muito distante. Use /lista area para ver os locais acessíveis.');
    if (target.id === player.region_id) throw new Error('Você já está nesta região!');

    // Consome fadiga pela viagem
    await run(`UPDATE player_attributes SET fatigue = fatigue + 10 WHERE player_id = ?`, [player.id]);
    await run(`UPDATE players SET region_id = ? WHERE id = ?`, [target.id, player.id]);

    return target;
}

module.exports = { getNearbyAreas, travelTo };
