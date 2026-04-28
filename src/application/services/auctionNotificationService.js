const db = require('../../infra/db/connection');

const query = (sql, params = []) => new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => err ? reject(err) : resolve(rows));
});
const run = (sql, params = []) => new Promise((resolve, reject) => {
    db.run(sql, params, function (err) { err ? reject(err) : resolve(this) });
});

/**
 * Auction Notification Service - MVP 1.1.0
 * Envia notificações via WhatsApp quando leilões são resolvidos
 * 
 * Referência: Seção 406
 */

async function notifyAuctionResolved(auctionId, winnerId, sellerId, amount, itemName, status) {
    try {
        // Busca dados do comprador
        const buyerRows = await query(`SELECT phone_number, character_name FROM players WHERE id = ?`, [winnerId]);
        const buyer = buyerRows[0];

        // Busca dados do vendedor
        const sellerRows = await query(`SELECT phone_number, character_name FROM players WHERE id = ?`, [sellerId]);
        const seller = sellerRows[0];

        if (!buyer || !seller) {
            console.warn(`[NOTIFICATION] Dados incompletos para leilão ${auctionId}`);
            return { success: false, error: 'player_data_missing' };
        }

        // mensagem para o comprador
        const buyerMsg = `🏛️ **Leilão Finalizado!**\n✅ Você venceu o leilão!\n📦 Item: ${itemName}\n💰 Valor: ${amount} espíritos\n👤 Vendedor: ${seller.character_name}\n\nO item foi transferido para seu inventário.`;

        // mensagem para o vendedor
        const sellerMsg = `🏛️ **Leilão Finalizado!**\n💼 Seu item foi vendido!\n📦 Item: ${itemName}\n💰 Valor recebido: ${amount} espíritos\n👤 Comprador: ${buyer.character_name}\n\nOs fundos foram creditados em sua carteira.`;

        // Placeholder: Aqui você integraria com o cliente WhatsApp real
        // Para agora, apenas logamos a intenção de notificação
        await run(`INSERT INTO game_logs (service_name, event_type, action, player_id, target_player_id, source_context, command_text, payload_json, status) VALUES ('auctionNotificationService', 'notification', 'sent', ?, ?, 'whatsapp', '/auction/notify', ?, 'success')`, [winnerId, sellerId, JSON.stringify({ auction_id: auctionId, amount, item: itemName, buyer_msg: buyerMsg, seller_msg: sellerMsg })]);

        console.log(`[NOTIFICATION] Para ${buyer.character_name}: ${buyerMsg}`);
        console.log(`[NOTIFICATION] Para ${seller.character_name}: ${sellerMsg}`);

        return { success: true, buyer_notified: true, seller_notified: true };
    } catch (e) {
        await run(`INSERT INTO game_logs (service_name, event_type, action, source_context, command_text, payload_json, result_json, status) VALUES ('auctionNotificationService', 'notification', 'error', 'system', '/auction/notify', ?, ?, 'error')`, [JSON.stringify({ auction_id: auctionId }), JSON.stringify({ error: e.message })]);
        console.error(`[NOTIFICATION] Erro ao notificar leilão ${auctionId}:`, e.message);
        return { success: false, error: e.message };
    }
}

async function notifyAuctionNoWinner(auctionId, sellerId, itemName) {
    try {
        const sellerRows = await query(`SELECT phone_number, character_name FROM players WHERE id = ?`, [sellerId]);
        const seller = sellerRows[0];

        if (!seller) {
            console.warn(`[NOTIFICATION] Vendedor ${sellerId} não encontrado para leilão ${auctionId}`);
            return { success: false, error: 'seller_not_found' };
        }

        const sellerMsg = `⚠️ **Leilão Encerrado Sem Vencedor**\n📦 Item: ${itemName}\n❌ Nenhum comprador com lance e fundos suficientes.\n\nO item permanece em seu inventário.`;

        await run(`INSERT INTO game_logs (service_name, event_type, action, player_id, source_context, command_text, payload_json, status) VALUES ('auctionNotificationService', 'notification', 'no_winner', ?, 'system', '/auction/notify', ?, 'success')`, [sellerId, JSON.stringify({ auction_id: auctionId, item: itemName, seller_msg: sellerMsg })]);

        console.log(`[NOTIFICATION] Para ${seller.character_name}: ${sellerMsg}`);

        return { success: true, notified: true };
    } catch (e) {
        console.error(`[NOTIFICATION] Erro ao notificar vendedor ${sellerId}:`, e.message);
        return { success: false, error: e.message };
    }
}

module.exports = {
    notifyAuctionResolved,
    notifyAuctionNoWinner
};