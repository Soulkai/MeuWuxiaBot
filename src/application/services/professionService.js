const db = require('../../infra/db/connection');

const query = (sql, params = []) => new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => err ? reject(err) : resolve(rows));
});
const run = (sql, params = []) => new Promise((resolve, reject) => {
    db.run(sql, params, function (err) { err ? reject(err) : resolve(this) });
});

async function chooseProfession(phoneNumber, professionCode) {
    const playerResult = await query(`SELECT id FROM players WHERE phone_number = ?`, [phoneNumber]);
    if (playerResult.length === 0) throw new Error('Cultivador não registrado.');
    const playerId = playerResult[0].id;

    const profResult = await query(`SELECT id, name FROM professions WHERE code = ?`, [professionCode]);
    if (profResult.length === 0) throw new Error('Esta arte ancestral não existe.');

    // Verifica se já possui 2 profissões (limite do MVP)
    const currentProfs = await query(`SELECT id FROM player_professions WHERE player_id = ?`, [playerId]);
    if (currentProfs.length >= 2) throw new Error('Você já atingiu o limite de 2 profissões principais.');

    await run(
        `INSERT INTO player_professions (player_id, profession_id, level, xp_current, rank_tier) VALUES (?, ?, 1, 0, 'Aprendiz')`,
        [playerId, profResult[0].id]
    );

    return profResult[0].name;
}

async function craftItem(phoneNumber, recipeCode) {
    // 1. Busca dados do player e sua proficiência
    const sqlData = `
        SELECT p.id as playerId, p.character_name, r.id as recipeId, r.name as recipeName, r.inputs_json, r.outputs_json, r.difficulty,
               pp.level as profLevel, pp.id as playerProfId
        FROM players p
        JOIN recipes r ON r.code = ?
        JOIN player_professions pp ON p.id = pp.player_id AND pp.profession_id = r.profession_id
        WHERE p.phone_number = ?
    `;
    const result = await query(sqlData, [recipeCode, phoneNumber]);
    if (result.length === 0) throw new Error('Você não possui proficiência ou receita para este item.');
    
    const craft = result[0];
    const inputs = JSON.parse(craft.inputs_json);

    // 2. Valida materiais no inventário
    for (const [itemCode, qty] of Object.entries(inputs)) {
        const inv = await query(
            `SELECT pi.quantity FROM player_inventory pi JOIN items i ON pi.item_id = i.id WHERE pi.player_id = ? AND i.code = ?`,
            [craft.playerId, itemCode]
        );
        if (inv.length === 0 || inv[0].quantity < qty) throw new Error(`Materiais insuficientes: falta ${itemCode}.`);
    }

    // 3. Inicia Transação de Criação
    await run('BEGIN TRANSACTION');
    try {
        // Consome materiais
        for (const [itemCode, qty] of Object.entries(inputs)) {
            await run(
                `UPDATE player_inventory SET quantity = quantity - ? WHERE player_id = ? AND item_id = (SELECT id FROM items WHERE code = ?)`,
                [qty, craft.playerId, itemCode]
            );
        }

        // Cálculo de Sucesso e Qualidade (Baseado na Seção 28)
        const roll = Math.floor(Math.random() * 100) + 1;
        const successChance = 85; // Simplificado para MVP
        
        if (roll > successChance) {
            await run('COMMIT');
            return { success: false, name: craft.recipeName };
        }

        // Determina qualidade (Refinado, Superior, etc)
        let quality = 'Comum';
        if (roll <= 5) quality = 'Celestial';
        else if (roll <= 15) quality = 'Superior';

        // Entrega o produto (outputs)
        const outputs = JSON.parse(craft.outputs_json);
        for (const [outCode, outQty] of Object.entries(outputs)) {
            await run(
                `INSERT INTO player_inventory (player_id, item_id, quantity) 
                 VALUES (?, (SELECT id FROM items WHERE code = ?), ?)
                 ON CONFLICT(player_id, item_id) DO UPDATE SET quantity = quantity + ?`,
                [craft.playerId, outCode, outQty, outQty]
            );
        }

        // Ganho de XP de profissão
        await run(`UPDATE player_professions SET xp_current = xp_current + 15 WHERE id = ?`, [craft.playerProfId]);

        await run('COMMIT');
        return { success: true, name: craft.recipeName, quality };
    } catch (e) {
        await run('ROLLBACK');
        throw e;
    }
}

module.exports = { chooseProfession, craftItem };
