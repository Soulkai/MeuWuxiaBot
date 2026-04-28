const economyService = require('../services/economyService');

async function handleLoja(message) {
    try {
        const items = await economyService.getShopItems();
        if (items.length === 0) return message.reply('🏪 A loja está vazia ou fechada para inventário.');

        let text = `[PAVILHÃO DE COMÉRCIO]\nItens disponíveis para venda:\n\n`;
        items.forEach(it => {
            text += `📦 ID [${it.id}] - ${it.name}\n   Preço: ${it.price_amount} ${it.currency}\n\n`;
        });
        text += `Use: /comprar [ID] [quantidade]`;
        await message.reply(text);
    } catch (e) { message.reply(`⚠️ Erro ao abrir a loja: ${e.message}`); }
}

async function handleComprar(message, args, senderPhone) {
    const itemId = args[0];
    const qty = parseInt(args[1]) || 1;
    if (!itemId) return message.reply('⚠️ Use: /comprar [ID] [quantidade]');

    try {
        const res = await economyService.buyFromShop(senderPhone, itemId, qty);
        await message.reply(`✅ [COMPRA SUCEDIDA]\nVocê adquiriu os itens com sucesso!\nTotal pago: ${res.totalPrice} moedas.`);
    } catch (e) { message.reply(`⚠️ A transação falhou: ${e.message}`); }
}

async function handleVender(message, args, senderPhone) {
    const itemTarget = args[0];
    const qty = parseInt(args[1]) || 1;

    if (!itemTarget) return message.reply('⚠️ Use: /vender [ID_do_Item_ou_Codigo] [quantidade]');

    try {
        const res = await economyService.sellToSystem(senderPhone, itemTarget, qty);
        await message.reply(`💰 [VENDA CONCLUÍDA]\nVocê vendeu ${qty}x ${res.itemName} para o Sistema.\n\n↳ Recebeu: +${res.totalGoldEarned} Ouro.`);
    } catch (e) { await message.reply(`⚠️ A venda falhou: ${e.message}`); }
}

async function handleMercado(message, args, senderPhone) {
    try {
        if (args[0] === 'vender') {
            const itemTarget = args[1];
            const price = parseInt(args[2]);
            const qty = parseInt(args[3]) || 1;
            const currency = args[4] || 'gold';

            if (!itemTarget || !price) return message.reply('⚠️ Formato incorreto!\nUse: /mercado vender [ID_do_Item] [Preço] [Quantidade] [Moeda: gold/spirit_pearl/dao_crystal]');

            const res = await economyService.createMarketListing(senderPhone, itemTarget, qty, price, currency);
            await message.reply(`⚖️ [MERCADO GLOBAL]\nVocê anunciou ${qty}x [${res.itemName}] com sucesso!\n\n↳ Taxa paga: ${res.fee} Ouro.`);
        
        } else if (args[0] === 'comprar') {
             const listingId = args[1];
             const qty = parseInt(args[2]) || 1;

             if (!listingId) return message.reply('⚠️ Formato incorreto!\nUse: /mercado comprar [ID_do_Anuncio] [Quantidade]');

             const res = await economyService.buyFromMarket(senderPhone, listingId, qty);
             await message.reply(`🛍️ [COMPRA CONCLUÍDA]\nVocê adquiriu com sucesso o item do Mercado Global!\n\n↳ Produto: ${qty}x ${res.itemName}\n↳ Total pago: ${res.totalPrice} ${res.currencyLabel}.`);

        } else {
            const listings = await economyService.getMarketListings();
            if (listings.length === 0) return message.reply('⚖️ O Mercado Global está vazio. Ninguém está vendendo nada no momento.');

            let text = `[MERCADO GLOBAL]\nAnúncios de Cultivadores:\n\n`;
            listings.forEach(l => {
                const moedasStr = { 'gold': 'Ouro', 'spirit_pearl': 'Pérolas', 'dao_crystal': 'Cristais Dao' };
                text += `🏷️ ID Anúncio: [${l.id}] - Vendedor: ${l.seller_name}\n   Item: ${l.quantity}x ${l.name}\n   Preço Unitário: ${l.price_amount} ${moedasStr[l.price_currency] || l.price_currency}\n\n`;
            });
            text += `Para comprar algo, use: /mercado comprar [ID_do_Anuncio] [quantidade]`; 
            await message.reply(text);
        }
    } catch (e) { await message.reply(`⚠️ Erro no Mercado: ${e.message}`); }
}

module.exports = { handleLoja, handleComprar, handleVender, handleMercado };
