const db = require('../../infra/db/connection');
const beastRules = require('../../domain/rules/beastRules');

const query = (sql, params = []) => new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => err ? reject(err) : resolve(rows));
});
const run = (sql, params = []) => new Promise((resolve, reject) => {
    db.run(sql, params, function (err) { err ? reject(err) : resolve(this) });
});

/**
 * Sprint 10: Maestria das Bestas
 * Lógica de ovos, eclosão e vínculos de bestas
 * 
 * Responsabilidades:
 * - Gerenciar ovos e eclosão
 * - Treinar bestas
 * - Vincular com jogador
 * - Evoluir/mutar bestas
 * 
 * Referência: Seções 159, 1306
 */

async function hatchEgg(phoneNumber, eggId) {
    // 1. Carrega jogador
    const playerRows = await query(`SELECT id FROM players WHERE phone_number = ?`, [phoneNumber]);
    if (playerRows.length === 0) throw new Error('Seu personagem não foi encontrado. Use /registrar.');
    const playerId = playerRows[0].id;

    // 2. Verifica ovo
    const eggRows = await query(`SELECT * FROM beast_eggs WHERE id = ? AND player_id = ?`, [eggId, playerId]);
    if (eggRows.length === 0) {
        return { formattedResponse: `⚠️ Ovo ${eggId} não encontrado ou não pertence a você.` };
    }
    const egg = eggRows[0];

    // 3. Verifica tempo de incubação (simplificado: assume pronto)
    const now = Date.now();
    if (egg.hatch_time > now) {
        const remaining = Math.ceil((egg.hatch_time - now) / (1000 * 60 * 60)); // horas
        return { formattedResponse: `⏳ Ovo ainda incubando. Tempo restante: ${remaining} horas.` };
    }

    // 4. Determina raridade e espécie
    const rarity = beastRules.determineEggRarity();
    const speciesRows = await query(`SELECT * FROM beast_species WHERE rarity = ? ORDER BY RANDOM() LIMIT 1`, [rarity]);
    if (speciesRows.length === 0) {
        return { formattedResponse: `⚠️ Nenhuma espécie de besta ${rarity} encontrada.` };
    }
    const species = speciesRows[0];

    // 5. Cria besta
    const beastResult = await run(
        `INSERT INTO player_beasts (player_id, species_id, name, level, experience, rarity, attributes) VALUES (?, ?, ?, 1, 0, ?, ?)`,
        [playerId, species.id, `${species.name} de ${playerId}`, rarity, JSON.stringify(species.base_attributes)]
    );

    // 6. Remove ovo
    await run(`DELETE FROM beast_eggs WHERE id = ?`, [eggId]);

    // 7. Registra log
    await run(`INSERT INTO game_logs (service_name, event_type, action, player_id, source_context, command_text, payload_json, status) VALUES ('beastService', 'hatch', 'success', ?, 'whatsapp', '/chocar', ?, 'success')`, [playerId, JSON.stringify({ egg_id: eggId, beast_id: beastResult.lastID, species: species.name, rarity })]);

    return { formattedResponse: `🐣 Ovo chocado! Você obteve uma ${species.name} ${rarity}!` };
}

async function trainBeast(phoneNumber) {
    // 1. Carrega jogador e besta ativa
    const playerRows = await query(`SELECT id FROM players WHERE phone_number = ?`, [phoneNumber]);
    if (playerRows.length === 0) throw new Error('Seu personagem não foi encontrado. Use /registrar.');
    const playerId = playerRows[0].id;

    const beastRows = await query(`SELECT * FROM player_beasts WHERE player_id = ? AND active = 1 LIMIT 1`, [playerId]);
    if (beastRows.length === 0) {
        return { formattedResponse: `⚠️ Você não tem uma besta ativa. Use /besta ativa [id] para ativar uma.` };
    }
    const beast = beastRows[0];

    // 2. Dá XP (simplificado)
    const xpGain = 50;
    const newXp = beast.experience + xpGain;
    const threshold = beastRules.calculateEvolutionThreshold(beast.level);

    let evolved = false;
    if (newXp >= threshold) {
        // Evolui
        evolved = true;
        await run(`UPDATE player_beasts SET level = level + 1, experience = 0 WHERE id = ?`, [beast.id]);
    } else {
        await run(`UPDATE player_beasts SET experience = ? WHERE id = ?`, [newXp, beast.id]);
    }

    // 3. Registra log
    await run(`INSERT INTO game_logs (service_name, event_type, action, player_id, source_context, command_text, payload_json, status) VALUES ('beastService', 'train', 'success', ?, 'whatsapp', '/treinarbesta', ?, 'success')`, [playerId, JSON.stringify({ beast_id: beast.id, xp_gain: xpGain, evolved })]);

    let response = `🏋️ ${beast.name} treinou e ganhou ${xpGain} XP!`;
    if (evolved) response += ` 🎉 Evoluiu para nível ${beast.level + 1}!`;
    return { formattedResponse: response };
}

async function getBeastStatus(phoneNumber) {
    // 1. Carrega jogador
    const playerRows = await query(`SELECT id FROM players WHERE phone_number = ?`, [phoneNumber]);
    if (playerRows.length === 0) throw new Error('Seu personagem não foi encontrado. Use /registrar.');
    const playerId = playerRows[0].id;

    // 2. Busca bestas do jogador
    const beasts = await query(`SELECT pb.*, bs.name as species_name FROM player_beasts pb JOIN beast_species bs ON pb.species_id = bs.id WHERE pb.player_id = ?`, [playerId]);

    if (beasts.length === 0) {
        return { formattedResponse: `🐾 Você não tem bestas. Compre ovos no mercado e choque-os com /chocar [id].` };
    }

    let response = `🐾 Suas Bestas:\n`;
    beasts.forEach(beast => {
        const active = beast.active ? ' (Ativa)' : '';
        response += `- ${beast.name} (${beast.species_name}) Nv.${beast.level} ${beast.rarity}${active}\n`;
    });

    return { formattedResponse: response };
}

module.exports = { 
    hatchEgg, 
    trainBeast, 
    getBeastStatus
};
