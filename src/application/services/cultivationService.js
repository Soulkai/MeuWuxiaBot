const db = require('../../infra/db/connection');

const query = (sql, params = []) => new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => err ? reject(err) : resolve(rows));
});
const run = (sql, params = []) => new Promise((resolve, reject) => {
    db.run(sql, params, function (err) { err ? reject(err) : resolve(this) });
});

// Tabela de base de ações
const ACTIONS = {
    'treinar': { path: 'corpo', base_xp: 8, fatigue_cost: 5, action_name: 'Treino Físico' },
    'meditar': { path: 'alma', base_xp: 10, fatigue_cost: 3, action_name: 'Meditação Profunda' },
    'cultivar': { path: 'espirito', base_xp: 12, fatigue_cost: 4, action_name: 'Absorção de Qi' }
};

// Tabela de multiplicadores de Talento (Seção 24.10)
const TALENT_MULT = {
    'Comum': 1.00, 'Incomum': 1.06, 'Raro': 1.14,
    'Épico': 1.24, 'Lendário': 1.38, 'Celestial': 1.58, 'Inominável': 1.85
};

async function performCultivationAction(phoneNumber, actionType) {
    const actionData = ACTIONS[actionType];
    if (!actionData) throw new Error('Técnica de cultivo desconhecida.');

    // 1. Busca os dados completos do jogador, incluindo região, raça, clã e corpo
    const playerQuery = `
        SELECT p.id, p.character_name, p.talent_tier, p.region_id,
               r.effects_json as race_effects, 
               c.effects_json as clan_effects,
               db.effects_json as body_effects,
               reg.danger_level
        FROM players p
        LEFT JOIN races r ON p.race_id = r.id
        LEFT JOIN clans c ON p.clan_id = c.id
        LEFT JOIN divine_bodies db ON p.divine_body_id = db.id
        LEFT JOIN regions reg ON p.region_id = reg.id
        WHERE p.phone_number = ?
    `;
    const playerResult = await query(playerQuery, [phoneNumber]);
    if (playerResult.length === 0) throw new Error('Você ainda não iniciou seu Caminho do Cultivo.');
    const player = playerResult[0];

    // 2. Busca a trilha específica que está sendo cultivada
    const pathQuery = `
        SELECT id, technique_id, xp_current, realm_index, sublevel 
        FROM player_cultivation 
        WHERE player_id = ? AND path_type = ?
    `;
    const pathResult = await query(pathQuery, [player.id, actionData.path]);
    const cultivationPath = pathResult[0];

    // 3. REGRA ABSOLUTA: Bloqueia se não houver técnica equipada
    if (!cultivationPath.technique_id) {
        throw new Error(`Você não possui uma técnica de ${actionData.path} equipada! Use /aprender ou /equipar primeiro.`);
    }

    // Busca dados da técnica equipada para o multiplicador
    const techQuery = `SELECT name, quality FROM techniques WHERE id = ?`;
    const techResult = await query(techQuery, [cultivationPath.technique_id]);
    const technique = techResult[0];

    // ==========================================
    // 🧮 MOTOR DE CÁLCULO DE MULTIPLICADORES
    // ==========================================
    let multTalento = TALENT_MULT[player.talent_tier] || 1.0;
    
    // Multiplicador da Técnica (Baseado na qualidade para o MVP)
    let multTecnica = 1.0;
    if (technique.quality === 'Mortal') multTecnica = 1.2;
    if (technique.quality === 'Profunda') multTecnica = 1.5;
    if (technique.quality === 'Terrestre') multTecnica = 1.8;

    // Multiplicador da Região (Áreas perigosas dão mais Qi)
    let multRegiao = 1.0 + (player.danger_level * 0.05); // Ex: Nível 2 = +10%

    // Multiplicadores Dinâmicos de Origem (Lendo os JSONs do banco)
    let multOrigem = 1.0;
    const applyJsonEffects = (jsonStr) => {
        if (!jsonStr) return;
        const effects = JSON.parse(jsonStr);
        // Bônus gerais
        if (effects.all_gain_mult) multOrigem *= effects.all_gain_mult;
        if (effects.hybrid_progression_mult) multOrigem *= effects.hybrid_progression_mult;
        
        // Bônus específicos por trilha
        if (actionData.path === 'corpo') {
            if (effects.strength_mult) multOrigem *= effects.strength_mult;
            if (effects.body_mult) multOrigem *= effects.body_mult;
        } else if (actionData.path === 'espirito') {
            if (effects.qi_mult) multOrigem *= effects.qi_mult;
            if (effects.spirit_cultivation_mult) multOrigem *= effects.spirit_cultivation_mult;
        } else if (actionData.path === 'alma') {
            if (effects.soul_mult) multOrigem *= effects.soul_mult;
            if (effects.perception_mult) multOrigem *= effects.perception_mult;
        }
    };

    applyJsonEffects(player.race_effects);
    applyJsonEffects(player.clan_effects);
    applyJsonEffects(player.body_effects);

    // Cálculo do XP Final
    // Fórmula: Base * Talento * Tecnica * Regiao * Origens
    let finalXp = actionData.base_xp * multTalento * multTecnica * multRegiao * multOrigem;
    finalXp = Math.floor(finalXp); // Arredonda para não ter números quebrados

    // ==========================================
    // 💾 PERSISTÊNCIA NO BANCO DE DADOS
    // ==========================================
    await run('BEGIN TRANSACTION');
    try {
        await run(`UPDATE player_cultivation SET xp_current = xp_current + ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`, [finalXp, cultivationPath.id]);
        await run(`UPDATE player_attributes SET fatigue = fatigue + ?, updated_at = CURRENT_TIMESTAMP WHERE player_id = ?`, [actionData.fatigue_cost, player.id]);
        await run(`INSERT INTO game_logs (service_name, event_type, action, player_id, command_text) VALUES ('cultivationService', 'cultivation', ?, ?, ?)`, [actionType, player.id, `/${actionType}`]);
        await run('COMMIT');

        return {
            characterName: player.character_name,
            actionName: actionData.action_name,
            techniqueName: technique.name,
            gainedXp: finalXp,
            baseXp: actionData.base_xp,
            fatigueCost: actionData.fatigue_cost,
            path: actionData.path,
            multDetails: {
                talento: multTalento.toFixed(2),
                tecnica: multTecnica.toFixed(2),
                origem: multOrigem.toFixed(2),
                regiao: multRegiao.toFixed(2)
            }
        };
    } catch (error) {
        await run('ROLLBACK');
        throw error;
    }
}

// Função para tentar quebrar o gargalo de um reino
async function attemptBreakthrough(phoneNumber, pathType) {
    if (!['corpo', 'espirito', 'alma'].includes(pathType)) {
        throw new Error('Trilha inválida. Escolha: corpo, espirito ou alma.');
    }

    const playerQuery = `SELECT id, character_name, talent_tier FROM players WHERE phone_number = ?`;
    const playerResult = await query(playerQuery, [phoneNumber]);
    if (playerResult.length === 0) throw new Error('Personagem não encontrado.');
    const player = playerResult[0];

    const pathQuery = `SELECT id, realm_index, sublevel, xp_current FROM player_cultivation WHERE player_id = ? AND path_type = ?`;
    const pathResult = await query(pathQuery, [player.id, pathType]);
    const cultivationPath = pathResult[0];

    // REGRA 1: O Gargalo
    if (cultivationPath.sublevel !== 9) {
        throw new Error(`A sua base ainda não está sólida! O gargalo só ocorre no subnível 9/9. (Atual: ${cultivationPath.sublevel}/9)`);
    }
    if (cultivationPath.realm_index >= 9) {
        throw new Error('Você já alcançou o pico do universo conhecido nesta trilha!');
    }

    // REGRA 2: As Chances Decrescentes
    let baseChance = 0;
    const realm = cultivationPath.realm_index;
    if (realm <= 3) baseChance = 85;
    else if (realm <= 5) baseChance = 70;
    else if (realm <= 7) baseChance = 55;
    else baseChance = 40;

    // Bônus de Talento para ajudar no gargalo
    const talentBonus = {
        'Comum': 0, 'Incomum': 2, 'Raro': 5,
        'Épico': 8, 'Lendário': 12, 'Celestial': 18, 'Inominável': 25
    };
    baseChance += (talentBonus[player.talent_tier] || 0);
    baseChance = Math.min(95, baseChance); // Limite máximo de 95% de chance

    const roll = Math.floor(Math.random() * 100) + 1;
    const success = roll <= baseChance;

    await run('BEGIN TRANSACTION');
    try {
        if (success) {
            // Avança de reino, volta para o subnível 1
            await run(
                `UPDATE player_cultivation SET realm_index = realm_index + 1, sublevel = 1, xp_current = 0 WHERE id = ?`,
                [cultivationPath.id]
            );

            // REGRA 3: Ganhos permanentes de atributos ao subir de reino
            if (pathType === 'corpo') {
                await run(`UPDATE player_attributes SET strength = strength + 5, constitution = constitution + 5, hp_max = hp_max + 30, hp_current = hp_max + 30 WHERE player_id = ?`, [player.id]);
            } else if (pathType === 'espirito') {
                await run(`UPDATE player_attributes SET intelligence = intelligence + 5, spirit = spirit + 5, qi_max = qi_max + 30, qi_current = qi_max + 30 WHERE player_id = ?`, [player.id]);
            } else if (pathType === 'alma') {
                await run(`UPDATE player_attributes SET willpower = willpower + 5, perception = perception + 4, soul_max = soul_max + 20, soul_current = soul_max + 20 WHERE player_id = ?`, [player.id]);
            }

            await run(`INSERT INTO game_logs (service_name, event_type, action, player_id, command_text) VALUES ('cultivationService', 'breakthrough', 'success', ?, '/romper')`, [player.id]);
            await run('COMMIT');

            return { success: true, characterName: player.character_name, chance: baseChance, roll: roll, newRealm: realm + 1, path: pathType };
        } else {
            // REGRA 4: Falha com perda parcial de XP
            const penaltyXp = Math.floor(cultivationPath.xp_current * 0.7);
            await run(`UPDATE player_cultivation SET xp_current = ? WHERE id = ?`, [penaltyXp, cultivationPath.id]);
            await run(`INSERT INTO game_logs (service_name, event_type, action, player_id, command_text) VALUES ('cultivationService', 'breakthrough', 'fail', ?, '/romper')`, [player.id]);
            await run('COMMIT');

            return { success: false, characterName: player.character_name, chance: baseChance, roll: roll, penaltyXp: penaltyXp };
        }
    } catch (error) {
        await run('ROLLBACK');
        throw error;
    }
}


module.exports = { performCultivationAction, attemptBreakthrough };

