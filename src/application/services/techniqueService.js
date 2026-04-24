const db = require('../../infra/db/connection');

const query = (sql, params = []) => new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => err ? reject(err) : resolve(rows));
});
const run = (sql, params = []) => new Promise((resolve, reject) => {
    db.run(sql, params, function (err) { err ? reject(err) : resolve(this) });
});

// Modificadores de Compreensão Baseados no Talento (Seção 24.10)
const TALENT_COMP_MULT = {
    'Comum': 1.00, 'Incomum': 1.04, 'Raro': 1.10,
    'Épico': 1.18, 'Lendário': 1.28, 'Celestial': 1.42, 'Inominável': 1.70
};

// Busca Livros (Não aprendidos) ou Técnicas (Aprendidas)
async function getPlayerTechniques(phoneNumber, isLearned) {
    const playerResult = await query(`SELECT id, character_name FROM players WHERE phone_number = ?`, [phoneNumber]);
    if (playerResult.length === 0) throw new Error('Personagem não encontrado.');

    const sql = `
        SELECT pt.id as pt_id, t.name, t.category, t.element, pt.xp_current, pt.level, pt.is_equipped
        FROM player_techniques pt
        JOIN techniques t ON pt.technique_id = t.id
        WHERE pt.player_id = ? AND pt.learned_at IS ${isLearned ? 'NOT NULL' : 'NULL'}
    `;
    const items = await query(sql, [playerResult[0].id]);
    return { playerName: playerResult[0].character_name, items };
}

// Estudar o manual (/compreender)
async function comprehendTechnique(phoneNumber, ptId) {
    const sql = `
        SELECT pt.*, p.talent_tier, p.id as player_id, t.name 
        FROM player_techniques pt
        JOIN players p ON pt.player_id = p.id
        JOIN techniques t ON pt.technique_id = t.id
        WHERE p.phone_number = ? AND pt.id = ? AND pt.learned_at IS NULL
    `;
    const result = await query(sql, [phoneNumber, ptId]);
    if (result.length === 0) throw new Error('Livro não encontrado ou já foi aprendido.');
    const tech = result[0];

    // Custo de fadiga
    await run(`UPDATE player_attributes SET fatigue = fatigue + 5 WHERE player_id = ?`, [tech.player_id]);

    // Cálculo do ganho de % (Base 10% a 15%)
    let baseGain = Math.floor(Math.random() * 6) + 10; 
    let mult = TALENT_COMP_MULT[tech.talent_tier] || 1.0;
    let totalGain = Math.floor(baseGain * mult);

    let newXp = Math.min(100, tech.xp_current + totalGain);
    await run(`UPDATE player_techniques SET xp_current = ? WHERE id = ?`, [newXp, tech.id]);

    return { name: tech.name, gain: totalGain, current: newXp, failedBefore: tech.level === -1 };
}

// Tentar Aprender (/aprender)
async function learnTechnique(phoneNumber, ptId) {
    const sql = `
        SELECT pt.*, p.talent_tier, p.id as player_id, t.name, t.element, sr.root_type
        FROM player_techniques pt
        JOIN players p ON pt.player_id = p.id
        JOIN techniques t ON pt.technique_id = t.id
        LEFT JOIN spiritual_roots sr ON p.spiritual_root_id = sr.id
        WHERE p.phone_number = ? AND pt.id = ? AND pt.learned_at IS NULL
    `;
    const result = await query(sql, [phoneNumber, ptId]);
    if (result.length === 0) throw new Error('Livro não encontrado ou já foi aprendido.');
    const tech = result[0];

    if (tech.xp_current < 50) throw new Error(`Você precisa de no mínimo 50% de compreensão para tentar aprender! (Atual: ${tech.xp_current}%)`);
    if (tech.level === -1 && tech.xp_current < 100) throw new Error(`Você já sofreu um desvio com esta técnica antes! Agora você só pode aprender ao atingir 100% de compreensão.`);

    let success = false;
    let chanceDesc = '';

    if (tech.xp_current >= 100) {
        success = true;
        chanceDesc = 'Garantido (100% Compreensão)';
    } else {
        // Chance Base = % Atual (ex: 60% compreensão = 60% de chance base)
        let chance = tech.xp_current; 
        
        // Bônus Elementar
        if (tech.element && tech.root_type && tech.element === tech.root_type) {
            chance += 15;
            chanceDesc += '+15% Afinidade | ';
        }
        
        const roll = Math.floor(Math.random() * 100) + 1;
        success = roll <= chance;
        chanceDesc += `Chance Final: ${Math.min(99, chance)}% | Rolou: ${roll}`;
    }

    if (success) {
        // Level 1 = Aprendido. xp_current volta a 0 para começar a medir proficiência de uso.
        await run(`UPDATE player_techniques SET learned_at = CURRENT_TIMESTAMP, level = 1, xp_current = 0 WHERE id = ?`, [tech.id]);
        return { success: true, name: tech.name, chanceDesc };
    } else {
        // Falhou! Fica com level -1 como penalidade de desvio. E perde 10% de progresso.
        let penaltyXp = Math.max(0, tech.xp_current - 10);
        await run(`UPDATE player_techniques SET level = -1, xp_current = ? WHERE id = ?`, [penaltyXp, tech.id]);
        return { success: false, name: tech.name, chanceDesc, penaltyXp };
    }
}

// Equipar técnica
async function equipTechnique(phoneNumber, ptId) {
    const sql = `SELECT pt.*, t.category, t.path_type, t.name, p.id as player_id 
                 FROM player_techniques pt 
                 JOIN techniques t ON pt.technique_id = t.id 
                 JOIN players p ON pt.player_id = p.id 
                 WHERE p.phone_number = ? AND pt.id = ? AND pt.learned_at IS NOT NULL`;
                 
    const result = await query(sql, [phoneNumber, ptId]);
    if (result.length === 0) throw new Error('Você não possui esta técnica ou ainda não a aprendeu.');
    const tech = result[0];

    await run('BEGIN TRANSACTION');
    try {
        // Desequipa outras técnicas da mesma categoria ou trilha
        if (tech.path_type) {
            await run(`UPDATE player_techniques SET is_equipped = 0 WHERE player_id = ? AND technique_id IN (SELECT id FROM techniques WHERE path_type = ?)`, [tech.player_id, tech.path_type]);
        }
        // Equipa a nova
        await run(`UPDATE player_techniques SET is_equipped = 1 WHERE id = ?`, [tech.id]);
        await run('COMMIT');
        return tech.name;
    } catch (err) {
        await run('ROLLBACK');
        throw err;
    }
}

module.exports = { getPlayerTechniques, comprehendTechnique, learnTechnique, equipTechnique };
