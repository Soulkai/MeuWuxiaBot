const db = require('../../infra/db/connection');

const query = (sql, params = []) => new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => err ? reject(err) : resolve(rows));
});
const run = (sql, params = []) => new Promise((resolve, reject) => {
    db.run(sql, params, function (err) { err ? reject(err) : resolve(this) });
});

/**
 * Sprint 13: Guerra das Seitas
 * Gerenciar conflitos entre seitas
 * 
 * Responsabilidades:
 * - Declarar guerras
 * - Dominar territórios
 * - Gerenciar cofres de seita
 * 
 * Referência: Seções 166, 406
 */

async function declareSectWar(phoneNumber, targetSectId) {
    // 1. Carrega jogador e verifica se líder da seita
    const playerRows = await query(`SELECT p.id, s.id as sect_id, s.leader_id FROM players p LEFT JOIN sects s ON p.sect_id = s.id WHERE p.phone_number = ?`, [phoneNumber]);
    if (playerRows.length === 0) throw new Error('Seu personagem não foi encontrado. Use /registrar.');
    const player = playerRows[0];
    if (!player.sect_id) {
        return { formattedResponse: '⚠️ Você precisa estar em uma seita para declarar guerra.' };
    }
    if (player.id !== player.leader_id) {
        return { formattedResponse: '⚠️ Apenas o líder da seita pode declarar guerra.' };
    }

    // 2. Verifica se alvo existe
    const targetSectRows = await query(`SELECT * FROM sects WHERE id = ?`, [targetSectId]);
    if (targetSectRows.length === 0) {
        return { formattedResponse: `⚠️ Seita ${targetSectId} não encontrada.` };
    }
    const targetSect = targetSectRows[0];
    if (targetSect.id === player.sect_id) {
        return { formattedResponse: '⚠️ Você não pode declarar guerra contra sua própria seita.' };
    }

    // 3. Verifica se já há guerra ativa
    const warRows = await query(`SELECT * FROM sect_wars WHERE (sect_a_id = ? AND sect_b_id = ?) OR (sect_a_id = ? AND sect_b_id = ?) AND status = 'active'`, [player.sect_id, targetSectId, targetSectId, player.sect_id]);
    if (warRows.length > 0) {
        return { formattedResponse: '⚠️ Já existe uma guerra ativa entre essas seitas.' };
    }

    // 4. Declara guerra (insere em sect_wars)
    await run(`INSERT INTO sect_wars (sect_a_id, sect_b_id, declared_by, status) VALUES (?, ?, ?, 'active')`, [player.sect_id, targetSectId, player.id]);

    // 5. Registra log
    await run(`INSERT INTO game_logs (service_name, event_type, action, player_id, source_context, command_text, payload_json, status) VALUES ('sectWarService', 'war', 'declare', ?, 'whatsapp', '/guerra declarar', ?, 'success')`, [player.id, JSON.stringify({ target_sect_id: targetSectId })]);

    return { formattedResponse: `⚔️ Guerra declarada contra a seita ${targetSect.name}! Preparem-se para o conflito.` };
}

async function attemptDominateTerritory(phoneNumber, territoryId) {
    // 1. Carrega jogador e seita
    const playerRows = await query(`SELECT p.id, s.id as sect_id FROM players p LEFT JOIN sects s ON p.sect_id = s.id WHERE p.phone_number = ?`, [phoneNumber]);
    if (playerRows.length === 0) throw new Error('Seu personagem não foi encontrado. Use /registrar.');
    const player = playerRows[0];
    if (!player.sect_id) {
        return { formattedResponse: '⚠️ Você precisa estar em uma seita para dominar territórios.' };
    }

    // 2. Verifica território
    const territoryRows = await query(`SELECT * FROM territories WHERE id = ?`, [territoryId]);
    if (territoryRows.length === 0) {
        return { formattedResponse: `⚠️ Território ${territoryId} não encontrado.` };
    }
    const territory = territoryRows[0];

    // 3. Se território já pertence à seita, nada a fazer
    if (territory.sect_id === player.sect_id) {
        return { formattedResponse: `🏞️ O território ${territory.name} já pertence à sua seita.` };
    }

    // 4. Verifica se há guerra ativa entre as seitas
    const warRows = await query(`SELECT * FROM sect_wars WHERE ((sect_a_id = ? AND sect_b_id = ?) OR (sect_a_id = ? AND sect_b_id = ?)) AND status = 'active'`, [player.sect_id, territory.sect_id, territory.sect_id, player.sect_id]);
    if (warRows.length === 0) {
        return { formattedResponse: '⚠️ Você só pode dominar territórios de seitas em guerra com a sua.' };
    }

    // 5. Simula tentativa de dominação (simplificado: chance baseada em nível do jogador)
    const playerAttributes = await query(`SELECT level FROM player_attributes WHERE player_id = ?`, [player.id]);
    const level = playerAttributes[0]?.level || 1;
    const successChance = Math.min(50, level * 5); // Máx 50%
    const roll = Math.floor(Math.random() * 100) + 1;

    if (roll <= successChance) {
        // Sucesso: muda dono do território
        await run(`UPDATE territories SET sect_id = ? WHERE id = ?`, [player.sect_id, territoryId]);
        // Registra conflito
        await run(`INSERT INTO territory_conflicts (territory_id, attacker_sect_id, defender_sect_id, winner_sect_id, conflict_type) VALUES (?, ?, ?, ?, 'domination')`, [territoryId, player.sect_id, territory.sect_id, player.sect_id]);

        return { formattedResponse: `🏆 Sucesso! A seita dominou o território ${territory.name}! (Chance: ${successChance}% | Rolou: ${roll})` };
    } else {
        // Falha
        return { formattedResponse: `❌ Falha na dominação do território ${territory.name}. Tente novamente. (Chance: ${successChance}% | Rolou: ${roll})` };
    }
}

module.exports = { 
    declareSectWar, 
    attemptDominateTerritory
};
