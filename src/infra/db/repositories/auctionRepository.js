const db = require('../connection');
const auctionNotif = require('../../../application/services/auctionNotificationService');

const query = (sql, params = []) => new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => err ? reject(err) : resolve(rows));
});
const run = (sql, params = []) => new Promise((resolve, reject) => {
    db.run(sql, params, function (err) { err ? reject(err) : resolve(this) });
});

/**
 * Repository para Leilões
 * Gerencia persistência de lances com lock de concorrência
 * 
 * Referência: Seção 406
 */

async function saveBidWithLock(auctionId, playerBid) {
    // playerBid: { player_id, amount }
    const playerId = playerBid.player_id;
    const amount = Number(playerBid.amount || 0);
    if (!playerId || amount <= 0) return { success: false, error: 'invalid_bid' };

    // Tenta atualizar o maior lance somente se o novo for maior
    const result = await run(
        `UPDATE auction_listings SET highest_bid_amount = ?, highest_bidder_player_id = ? WHERE id = ? AND (highest_bid_amount IS NULL OR highest_bid_amount < ?)`,
        [amount, playerId, auctionId, amount]
    );

    if (result.changes === 0) {
        // Não houve atualização: pode ser lance baixo ou leilão inexistente
        const rows = await query(`SELECT id, highest_bid_amount, status FROM auction_listings WHERE id = ?`, [auctionId]);
        if (rows.length === 0) return { success: false, error: 'not_found' };
        return { success: false, error: 'bid_too_low', current: rows[0].highest_bid_amount, status: rows[0].status };
    }

    // Log simples do lance
    await run(`INSERT INTO game_logs (service_name, event_type, action, player_id, source_context, command_text, payload_json, status) VALUES ('auctionRepository', 'bid', 'placed', ?, 'system', '/leilao lance', ?, 'success')`, [playerId, JSON.stringify({ auction_id: auctionId, amount })]);

    // Persistir histórico de lances na tabela genérica auction_bids
    try {
        await run(`INSERT INTO auction_bids (listing_id, listing_type, bidder_player_id, amount) VALUES (?, 'auction', ?, ?)`, [auctionId, playerId, amount]);
    } catch (e) {
        await run(`INSERT INTO game_logs (service_name, event_type, action, player_id, source_context, command_text, payload_json, result_json, status) VALUES ('auctionRepository', 'bid', 'persist_fail', ?, 'system', '/leilao lance', ?, ?, 'error')`, [playerId, JSON.stringify({ auction_id: auctionId, amount }), JSON.stringify({ error: e.message })]);
    }

    return { success: true };
}

async function resolveAuction(auctionId) {
    // Tenta encontrar o leilão nas duas tabelas suportadas
    let rows = await query(`SELECT * FROM auction_listings WHERE id = ?`, [auctionId]);
    let listing = null;
    let listingTable = null;

    if (rows.length > 0) {
        listing = rows[0];
        listingTable = 'auction_listings';
    } else {
        // Verifica se é um market listing (usado por algumas rotinas)
        rows = await query(`SELECT * FROM market_listings WHERE id = ?`, [auctionId]);
        if (rows.length > 0) {
            listing = rows[0];
            listingTable = 'market_listings';
        }
    }

    if (!listing || !listingTable) return { success: false, error: 'not_found' };

    // Evita reprocessar leilões já finalizados
    if (listing.status === 'completed' || listing.status === 'cancelled') {
        return { success: false, error: 'already_closed' };
    }

    // Tenta lances em ordem de valor (maior primeiro) - implementa fallback
    const bids = await getAvailableBidsOrdered(auctionId, listingTable);
    if (bids.length === 0) {
        // Nenhum lance
        await run(`UPDATE ${listingTable} SET status = 'completed' WHERE id = ?`, [auctionId]);
        await run(`INSERT INTO game_logs (service_name, event_type, action, source_context, command_text, payload_json, status) VALUES ('auctionRepository', 'resolve', 'no_bids', 'system', '/auction/resolve', ?, 'success')`, [JSON.stringify({ listing_id: auctionId, table: listingTable })]);
        return { success: true, winner: null };
    }

    const ALLOWED_CURRENCIES = ['gold', 'spirit_stones', 'celestial_crystals', 'merit', 'destiny_points'];
    const currency = listing.currency || listing.price_currency || 'spirit_stones';
    const currencyCol = ALLOWED_CURRENCIES.includes(currency) ? currency : 'spirit_stones';
    const sellerId = listing.seller_player_id || listing.seller_id || listing.sellerPlayerId;

    // Tenta processar cada lance em ordem até encontrar um com fundos suficientes
    let processedBid = null;
    for (const bid of bids) {
        const walletRows = await query(`SELECT ${currencyCol} as balance FROM wallet_balances WHERE player_id = ?`, [bid.player_id]);
        const bidBalance = walletRows[0]?.balance || 0;
        if (bidBalance >= bid.amount) {
            processedBid = bid;
            break; // Encontrou um lance viável
        }
    }

    if (!processedBid) {
        // Nenhum comprador com fundos suficientes
        await run(`UPDATE ${listingTable} SET status = 'completed' WHERE id = ?`, [auctionId]);
        await run(`INSERT INTO game_logs (service_name, event_type, action, source_context, command_text, payload_json, status) VALUES ('auctionRepository', 'resolve', 'no_valid_bids', 'system', '/auction/resolve', ?, 'success')`, [JSON.stringify({ listing_id: auctionId, bids_attempted: bids.length })]);
        
        // Notifica vendedor que não houve vencedor
        try {
            const itemName = listing.item_id ? `Item #${listing.item_id}` : 'Item';
            auctionNotif.notifyAuctionNoWinner(auctionId, sellerId, itemName).catch(e => {
                console.error('[AUCTION] Erro ao enviar notificação (sem vencedor):', e.message);
            });
        } catch (e) {
            console.error('[AUCTION] Erro ao disparar notificação (sem vencedor):', e.message);
        }

        return { success: true, winner: null };
    }

    const winnerId = processedBid.player_id;
    const amount = processedBid.amount;

    // Inicia transação atômica
    await run('BEGIN TRANSACTION');
    try {
        // Debita comprador
        const buyerRows = await query(`SELECT ${currencyCol} as balance FROM wallet_balances WHERE player_id = ?`, [winnerId]);
        const beforeBuyer = buyerRows[0]?.balance || 0;
        const afterBuyer = beforeBuyer - amount;
        await run(`UPDATE wallet_balances SET ${currencyCol} = ${currencyCol} - ? WHERE player_id = ?`, [amount, winnerId]);

        // Credita vendedor
        const sellerId = listing.seller_player_id || listing.seller_id || listing.sellerPlayerId;
        const sellerRows = await query(`SELECT ${currencyCol} as balance FROM wallet_balances WHERE player_id = ?`, [sellerId]);
        const beforeSeller = sellerRows[0]?.balance || 0;
        const afterSeller = beforeSeller + amount;
        await run(`UPDATE wallet_balances SET ${currencyCol} = ${currencyCol} + ? WHERE player_id = ?`, [amount, sellerId]);

        // Insere transações
        await run(`INSERT INTO transactions (player_id, transaction_type, currency, amount, balance_before, balance_after, reference_type, reference_id) VALUES (?, 'auction_purchase', ?, ?, ?, ?, ?, ?)`, [winnerId, currencyCol, amount, beforeBuyer, afterBuyer, listingTable, auctionId]);
        await run(`INSERT INTO transactions (player_id, transaction_type, currency, amount, balance_before, balance_after, reference_type, reference_id) VALUES (?, 'auction_sale', ?, ?, ?, ?, ?, ?)`, [sellerId, currencyCol, amount, beforeSeller, afterSeller, listingTable, auctionId]);

        // Transfere item (prefer item_instance_id se disponível)
        if (listing.item_instance_id) {
            // Tenta mover o item do vendedor para o comprador
            const invRows = await query(`SELECT * FROM player_inventory WHERE player_id = ? AND item_instance_id = ?`, [sellerId, listing.item_instance_id]);
            if (invRows.length > 0) {
                // Update ownership
                await run(`UPDATE player_inventory SET player_id = ? WHERE id = ?`, [winnerId, invRows[0].id]);
            } else {
                // Se o vendedor não tem o instance (possível devido a inconsistências), cria uma nova entrada para comprador
                await run(`INSERT INTO player_inventory (player_id, item_instance_id, quantity) VALUES (?, ?, ?)`, [winnerId, listing.item_instance_id, listing.quantity || 1]);
            }
        } else if (listing.item_id) {
            // Para itens sem instance, cria novo item_instance simples e atribui ao comprador
            const newInstance = await run(`INSERT INTO item_instances (item_id, origin_type, created_at) VALUES (?, 'auction', datetime('now'))`, [listing.item_id]);
            const newInstanceId = newInstance.lastID;
            await run(`INSERT INTO player_inventory (player_id, item_instance_id, quantity) VALUES (?, ?, ?)`, [winnerId, newInstanceId, listing.quantity || 1]);
        }

        // Marca como concluído
        await run(`UPDATE ${listingTable} SET status = 'completed' WHERE id = ?`, [auctionId]);

        await run('COMMIT');

        await run(`INSERT INTO game_logs (service_name, event_type, action, player_id, target_player_id, source_context, command_text, payload_json, status) VALUES ('auctionRepository', 'resolve', 'complete', ?, ?, 'system', '/auction/resolve', ?, 'success')`, [winnerId, sellerId, JSON.stringify({ listing_id: auctionId, amount })]);

        // Envia notificações (async, sem bloquear)
        try {
            const itemName = listing.item_id ? `Item #${listing.item_id}` : 'Item';
            auctionNotif.notifyAuctionResolved(auctionId, winnerId, sellerId, amount, itemName, 'completed').catch(e => {
                console.error('[AUCTION] Erro ao enviar notificações:', e.message);
            });
        } catch (e) {
            console.error('[AUCTION] Erro ao disparar notificações:', e.message);
        }

        return { success: true, winner: winnerId, amount };
    } catch (err) {
        await run('ROLLBACK');
        await run(`INSERT INTO game_logs (service_name, event_type, action, source_context, command_text, payload_json, result_json, status) VALUES ('auctionRepository', 'resolve', 'error', 'system', '/auction/resolve', ?, ?, 'error')`, [JSON.stringify({ listing_id: auctionId }), JSON.stringify({ error: err.message })]);
        return { success: false, error: err.message };
    }
}

async function getAvailableBidsOrdered(auctionId, listingTable = 'auction_listings') {
    // Recupera todos os lances para este leilão ordenados por valor (maior primeiro)
    const sql = `SELECT ab.bidder_player_id as player_id, ab.amount FROM auction_bids ab WHERE ab.listing_id = ? AND ab.listing_type = ? ORDER BY ab.amount DESC`;
    const type = listingTable === 'market_listings' ? 'market' : 'auction';
    const rows = await query(sql, [auctionId, type]);
    return rows;
}

async function loadActiveAuctions() {
    const rows = await query(`SELECT * FROM auction_listings WHERE status != 'completed' AND status != 'cancelled'`);
    return rows;
}

module.exports = {
    saveBidWithLock,
    resolveAuction,
    loadActiveAuctions,
    getAvailableBidsOrdered
};
