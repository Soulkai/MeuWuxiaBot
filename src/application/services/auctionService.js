const db = require('../../infra/db/connection');

const query = (sql, params = []) => new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => err ? reject(err) : resolve(rows));
});
const run = (sql, params = []) => new Promise((resolve, reject) => {
    db.run(sql, params, function (err) { err ? reject(err) : resolve(this) });
});

/**
 * Sprint 11: Leilão Celestial
 * Leilões avançados com anti-snipe refinado
 * 
 * Responsabilidades:
 * - Criar leilões
 * - Processar lances
 * - Aplicar anti-snipe (extensão automática)
 * - Resolver leilões
 * 
 * Referência: Seção 406
 */

async function createAuction(phoneNumber, itemId, startingPrice, durationHours) {
    // 1. Carrega jogador
    const playerRows = await query(`SELECT id FROM players WHERE phone_number = ?`, [phoneNumber]);
    if (playerRows.length === 0) throw new Error('Seu personagem não foi encontrado. Use /registrar.');
    const playerId = playerRows[0].id;

    // 2. Verifica se item existe no inventário
    const itemRows = await query(`SELECT * FROM player_inventory WHERE player_id = ? AND item_id = ? AND quantity > 0`, [playerId, itemId]);
    if (itemRows.length === 0) {
        return { formattedResponse: `⚠️ Item ${itemId} não encontrado no seu inventário.` };
    }

    // 3. Cria leilão (usando market_listings com tipo 'auction')
    const endTime = Date.now() + (durationHours * 60 * 60 * 1000);
    await run(`INSERT INTO market_listings (seller_id, item_id, quantity, price, listing_type, end_time) VALUES (?, ?, 1, ?, 'auction', ?)`, [playerId, itemId, startingPrice, endTime]);

    // 4. Remove item do inventário
    await run(`UPDATE player_inventory SET quantity = quantity - 1 WHERE player_id = ? AND item_id = ?`, [playerId, itemId]);

    // 5. Registra log
    await run(`INSERT INTO game_logs (service_name, event_type, action, player_id, source_context, command_text, payload_json, status) VALUES ('auctionService', 'create', 'success', ?, 'whatsapp', '/leilao criar', ?, 'success')`, [playerId, JSON.stringify({ item_id: itemId, starting_price: startingPrice, duration: durationHours })]);

    return { formattedResponse: `🏛️ Leilão criado para item ${itemId} com preço inicial de ${startingPrice} pedras espirituais, duração ${durationHours} horas.` };
}

async function placeBid(phoneNumber, auctionId, bidAmount) {
    // 1. Carrega jogador
    const playerRows = await query(`SELECT id FROM players WHERE phone_number = ?`, [phoneNumber]);
    if (playerRows.length === 0) throw new Error('Seu personagem não foi encontrado. Use /registrar.');
    const playerId = playerRows[0].id;

    // 2. Busca leilão
    const auctionRows = await query(`SELECT * FROM market_listings WHERE id = ? AND listing_type = 'auction' AND end_time > ?`, [auctionId, Date.now()]);
    if (auctionRows.length === 0) {
        return { formattedResponse: `⚠️ Leilão ${auctionId} não encontrado ou expirado.` };
    }
    const auction = auctionRows[0];

    // 3. Verifica lance mínimo
    const currentBid = auction.current_bid || auction.price;
    if (bidAmount <= currentBid) {
        return { formattedResponse: `⚠️ Lance deve ser maior que o atual: ${currentBid} pedras espirituais.` };
    }

    // 4. Verifica fundos
    const playerAttributes = await query(`SELECT spirit_stones FROM player_attributes WHERE player_id = ?`, [playerId]);
    if (playerAttributes[0].spirit_stones < bidAmount) {
        return { formattedResponse: '⚠️ Você não tem pedras espirituais suficientes.' };
    }

    // 5. Aplica anti-snipe: se lance nos últimos 5 minutos, estende por 5 minutos
    const timeLeft = auction.end_time - Date.now();
    const fiveMinutes = 5 * 60 * 1000;
    let newEndTime = auction.end_time;
    if (timeLeft <= fiveMinutes) {
        newEndTime = Date.now() + fiveMinutes;
    }

    // 6. Atualiza lance
    await run(`UPDATE market_listings SET current_bid = ?, bidder_id = ?, end_time = ? WHERE id = ?`, [bidAmount, playerId, newEndTime, auctionId]);

    // 6.5 Persistir histórico de lances
    try {
        await run(`INSERT INTO auction_bids (listing_id, listing_type, bidder_player_id, amount) VALUES (?, 'market', ?, ?)`, [auctionId, playerId, bidAmount]);
    } catch (e) {
        // Não é crítico, mas logamos
        await run(`INSERT INTO game_logs (service_name, event_type, action, player_id, source_context, command_text, payload_json, result_json, status) VALUES ('auctionService', 'bid', 'persist_fail', ?, 'whatsapp', '/leilao lance', ?, ?, 'error')`, [playerId, JSON.stringify({ auction_id: auctionId, bid: bidAmount }), JSON.stringify({ error: e.message })]);
    }

    // 7. Registra log
    await run(`INSERT INTO game_logs (service_name, event_type, action, player_id, source_context, command_text, payload_json, status) VALUES ('auctionService', 'bid', 'success', ?, 'whatsapp', '/leilao lance', ?, 'success')`, [playerId, JSON.stringify({ auction_id: auctionId, bid: bidAmount })]);

    return { formattedResponse: `💰 Lance de ${bidAmount} pedras espirituais realizado no leilão ${auctionId}.` };
}

async function listActiveAuctions(phoneNumber) {
    // 1. Lista leilões ativos
    const auctions = await query(`
        SELECT ml.*, i.name as item_name, p.character_name as seller_name
        FROM market_listings ml
        JOIN items i ON ml.item_id = i.id
        JOIN players p ON ml.seller_id = p.id
        WHERE ml.listing_type = 'auction' AND ml.end_time > ?
        ORDER BY ml.end_time ASC
    `, [Date.now()]);

    if (auctions.length === 0) {
        return { formattedResponse: '🏛️ Nenhum leilão ativo no momento.' };
    }

    let response = `🏛️ Leilões Ativos:\n`;
    auctions.forEach(auction => {
        const currentBid = auction.current_bid || auction.price;
        const timeLeft = Math.ceil((auction.end_time - Date.now()) / (1000 * 60)); // minutos
        response += `- ID: ${auction.id} | ${auction.item_name} | Lance atual: ${currentBid} | Vendedor: ${auction.seller_name} | Tempo: ${timeLeft}min\n`;
    });

    return { formattedResponse: response };
}

module.exports = { 
    createAuction, 
    placeBid, 
    listActiveAuctions
};
