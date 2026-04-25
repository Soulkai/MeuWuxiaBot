const db = require('../../infra/db/connection');

const query = (sql, params = []) => new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => err ? reject(err) : resolve(rows));
});
const run = (sql, params = []) => new Promise((resolve, reject) => {
    db.run(sql, params, function (err) { err ? reject(err) : resolve(this) });
});

async function createSect(phoneNumber, sectName) {
    const player = (await query(`SELECT id, character_name FROM players WHERE phone_number = ?`, [phoneNumber]))[0];
    if (!player) throw new Error('Personagem não encontrado.');

    // 1. Verifica se já está em uma seita
    const isInSect = await query(`SELECT id FROM sect_members WHERE player_id = ?`, [player.id]);
    if (isInSect.length > 0) throw new Error('Você já pertence a uma seita. Abandone-a antes de fundar outra.');

    // 2. Verifica se o nome já existe
    const nameCheck = await query(`SELECT id FROM sects WHERE name = ?`, [sectName]);
    if (nameCheck.length > 0) throw new Error('Já existe uma Seita sob este nome nos Nove Céus.');

    // 3. Custo de Criação: 1000 de Ouro
    const creationCost = 1000;
    const wallet = (await query(`SELECT gold FROM wallet_balances WHERE player_id = ?`, [player.id]))[0];
    if (wallet.gold < creationCost) throw new Error(`A fundação exige ${creationCost} de Ouro como tributo de base.`);

    await run('BEGIN TRANSACTION');
    try {
        // Debita o custo
        await run(`UPDATE wallet_balances SET gold = gold - ? WHERE player_id = ?`, [creationCost, player.id]);

        // Cria a Seita
        const result = await run(`INSERT INTO sects (name, description, level, prestige, wealth) VALUES (?, 'Uma nova seita em ascensão.', 1, 0, 0)`, [sectName]);
        const sectId = result.lastID;

        // Insere o criador como Patriarca
        await run(`INSERT INTO sect_members (sect_id, player_id, role, contribution_points) VALUES (?, ?, 'Patriarca', 0)`, [sectId, player.id]);

        await run('COMMIT');
        return { success: true, sectName, founder: player.character_name };
    } catch (e) {
        await run('ROLLBACK');
        throw e;
    }
}

async function getSectInfo(phoneNumber) {
    const player = (await query(`SELECT id FROM players WHERE phone_number = ?`, [phoneNumber]))[0];
    
    const sectInfo = await query(`
        SELECT s.id, s.name, s.description, s.level, s.prestige, s.wealth,
               (SELECT count(*) FROM sect_members WHERE sect_id = s.id) as member_count
        FROM sects s
        JOIN sect_members sm ON sm.sect_id = s.id
        WHERE sm.player_id = ?
    `, [player.id]);

    if (sectInfo.length === 0) throw new Error('Você é um cultivador errante. Não pertence a nenhuma seita.');
    return sectInfo[0];
}

async function listSectMembers(phoneNumber) {
    const player = (await query(`SELECT id FROM players WHERE phone_number = ?`, [phoneNumber]))[0];
    
    const memberCheck = await query(`SELECT sect_id FROM sect_members WHERE player_id = ?`, [player.id]);
    if (memberCheck.length === 0) throw new Error('Você não pertence a nenhuma seita.');

    const sectId = memberCheck[0].sect_id;
    return await query(`
        SELECT p.character_name, sm.role, sm.contribution_points, pc.realm_index
        FROM sect_members sm
        JOIN players p ON sm.player_id = p.id
        LEFT JOIN player_cultivation pc ON pc.player_id = p.id AND pc.path_type = 'espirito'
        WHERE sm.sect_id = ?
        ORDER BY 
            CASE role WHEN 'Patriarca' THEN 1 WHEN 'Ancião' THEN 2 ELSE 3 END,
            sm.contribution_points DESC
    `, [sectId]);
}

async function listAllSects() {
    return await query(`
        SELECT s.id, s.name, s.level, (SELECT count(*) FROM sect_members WHERE sect_id = s.id) as count 
        FROM sects s ORDER BY s.level DESC, s.prestige DESC LIMIT 15
    `);
}

async function joinSect(phoneNumber, sectId) {
    const player = (await query(`SELECT id FROM players WHERE phone_number = ?`, [phoneNumber]))[0];
    
    const isInSect = await query(`SELECT id FROM sect_members WHERE player_id = ?`, [player.id]);
    if (isInSect.length > 0) throw new Error('Você já pertence a uma seita!');

    const sect = await query(`SELECT name FROM sects WHERE id = ?`, [sectId]);
    if (sect.length === 0) throw new Error('Esta seita não existe.');

    await run(`INSERT INTO sect_members (sect_id, player_id, role, contribution_points) VALUES (?, ?, 'Discípulo Externo', 0)`, [sectId, player.id]);
    return sect[0].name;
}

module.exports = { createSect, getSectInfo, listSectMembers, listAllSects, joinSect };
