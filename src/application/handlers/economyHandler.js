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

module.exports = { handleLoja, handleComprar };
