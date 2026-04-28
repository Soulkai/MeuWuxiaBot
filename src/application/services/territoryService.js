const db = require('../../infra/db/connection');

const query = (sql, params = []) => new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => err ? reject(err) : resolve(rows));
});
const run = (sql, params = []) => new Promise((resolve, reject) => {
    db.run(sql, params, function (err) { err ? reject(err) : resolve(this) });
});

/**
 * Sprint 13: Territórios
 * Gerenciar territórios e geração passiva de riqueza
 * 
 * Responsabilidades:
 * - Investir em desenvolvimento
 * - Coletar riquezas
 * - Calcular ganhos passivos
 * 
 * Referência: Seção 406
 */

async function investTerritory(phoneNumber, territoryId, amount) {
    // 1. Carrega jogador e verifica seita
    const playerRows = await query(`SELECT p.id, s.id as sect_id FROM players p LEFT JOIN sects s ON p.sect_id = s.id WHERE p.phone_number = ?`, [phoneNumber]);
    if (playerRows.length === 0) throw new Error('Seu personagem não foi encontrado. Use /registrar.');
    const player = playerRows[0];
    if (!player.sect_id) {
        return { formattedResponse: '⚠️ Você precisa estar em uma seita para investir em territórios.' };
    }

    // 2. Verifica território
    const territoryRows = await query(`SELECT * FROM territories WHERE id = ? AND sect_id = ?`, [territoryId, player.sect_id]);
    if (territoryRows.length === 0) {
        return { formattedResponse: `⚠️ Território ${territoryId} não encontrado ou não pertence à sua seita.` };
    }
    const territory = territoryRows[0];

    // 3. Verifica fundos do jogador
    const playerAttributes = await query(`SELECT spirit_stones FROM player_attributes WHERE player_id = ?`, [player.id]);
    if (playerAttributes.length === 0 || playerAttributes[0].spirit_stones < amount) {
        return { formattedResponse: '⚠️ Você não tem pedras espirituais suficientes.' };
    }

    // 4. Deduz fundos e registra investimento
    await run(`UPDATE player_attributes SET spirit_stones = spirit_stones - ? WHERE player_id = ?`, [amount, player.id]);
    await run(`INSERT INTO territory_investments (territory_id, player_id, amount, invested_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP)`, [territoryId, player.id, amount]);

    // 5. Registra log
    await run(`INSERT INTO game_logs (service_name, event_type, action, player_id, source_context, command_text, payload_json, status) VALUES ('territoryService', 'invest', 'success', ?, 'whatsapp', '/territorio investir', ?, 'success')`, [player.id, JSON.stringify({ territory_id: territoryId, amount })]);

    return { formattedResponse: `💰 Você investiu ${amount} pedras espirituais no território ${territory.name}. O desenvolvimento aumentará os ganhos passivos.` };
}

async function collectTerritoryWealth(phoneNumber, territoryId) {
    // 1. Carrega jogador e verifica seita
    const playerRows = await query(`SELECT p.id, s.id as sect_id FROM players p LEFT JOIN sects s ON p.sect_id = s.id WHERE p.phone_number = ?`, [phoneNumber]);
    if (playerRows.length === 0) throw new Error('Seu personagem não foi encontrado. Use /registrar.');
    const player = playerRows[0];
    if (!player.sect_id) {
        return { formattedResponse: '⚠️ Você precisa estar em uma seita para coletar riquezas de territórios.' };
    }

    // 2. Verifica território
    const territoryRows = await query(`SELECT * FROM territories WHERE id = ? AND sect_id = ?`, [territoryId, player.sect_id]);
    if (territoryRows.length === 0) {
        return { formattedResponse: `⚠️ Território ${territoryId} não encontrado ou não pertence à sua seita.` };
    }
    const territory = territoryRows[0];

    // 3. Calcula ganhos (baseado em investimentos e tempo)
    const investments = await query(`SELECT SUM(amount) as total FROM territory_investments WHERE territory_id = ?`, [territoryId]);
    const totalInvested = investments[0].total || 0;
    const baseYield = totalInvested * 0.01; // 1% por dia ou algo (simplificado)
    const collected = Math.floor(baseYield);

    if (collected <= 0) {
        return { formattedResponse: `⚠️ Nenhum ganho disponível no território ${territory.name}. Investa mais para aumentar os rendimentos.` };
    }

    // 4. Adiciona ao treasury da seita
    await run(`UPDATE territory_treasuries SET amount = amount + ? WHERE territory_id = ?`, [collected, territoryId]);

    // 5. Registra log
    await run(`INSERT INTO game_logs (service_name, event_type, action, player_id, source_context, command_text, payload_json, status) VALUES ('territoryService', 'collect', 'success', ?, 'whatsapp', '/territorio coletar', ?, 'success')`, [player.id, JSON.stringify({ territory_id: territoryId, collected })]);

    return { formattedResponse: `💰 Você coletou ${collected} pedras espirituais do território ${territory.name} e adicionou ao tesouro da seita.` };
}

async function listSectTerritories(phoneNumber) {
    // 1. Carrega jogador e verifica seita
    const playerRows = await query(`SELECT p.id, s.id as sect_id, s.name as sect_name FROM players p LEFT JOIN sects s ON p.sect_id = s.id WHERE p.phone_number = ?`, [phoneNumber]);
    if (playerRows.length === 0) throw new Error('Seu personagem não foi encontrado. Use /registrar.');
    const player = playerRows[0];
    if (!player.sect_id) {
        return { formattedResponse: '⚠️ Você não está em uma seita. Junte-se a uma para acessar territórios.' };
    }

    // 2. Lista territórios da seita
    const territories = await query(`
        SELECT t.*, COALESCE(ti.total_invested, 0) as total_invested, COALESCE(tt.amount, 0) as treasury
        FROM territories t
        LEFT JOIN (SELECT territory_id, SUM(amount) as total_invested FROM territory_investments GROUP BY territory_id) ti ON t.id = ti.territory_id
        LEFT JOIN territory_treasuries tt ON t.id = tt.territory_id
        WHERE t.sect_id = ?
    `, [player.sect_id]);

    if (territories.length === 0) {
        return { formattedResponse: `🏞️ A seita ${player.sect_name} não possui territórios ainda.` };
    }

    let response = `🏞️ Territórios da Seita ${player.sect_name}:\n`;
    territories.forEach(terr => {
        response += `- ${terr.name} (ID: ${terr.id}) - Investido: ${terr.total_invested} - Tesouro: ${terr.treasury}\n`;
    });

    return { formattedResponse: response };
}

module.exports = { 
    investTerritory, 
    collectTerritoryWealth, 
    listSectTerritories
};
