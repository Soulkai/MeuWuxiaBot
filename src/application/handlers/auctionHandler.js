const auctionService = require('../services/auctionService');

/**
 * Sprint 11: Leilão Celestial
 * Handler para gerenciar leilões avançados com anti-snipe
 * 
 * Comandos suportados:
 * - /leilao criar [item] [preço_inicial] [duracao] — Criar novo leilão
 * - /leilao lance [id_leilao] [valor] — Fazer lance em leilão
 * - /leilao listar — Listar leilões ativos
 * 
 * Referência: Seção 406
 */

async function handleCriarLeilao(message, args, senderPhone) {
    if (args.length < 3) return await message.reply('⚠️ Use: /leilao criar [item] [preço] [duracao_horas]');
    
    try {
        const result = await auctionService.createAuction(senderPhone, args);
        await message.reply(result.formattedResponse);
    } catch (e) {
        await message.reply(`⚠️ Erro ao criar leilão: ${e.message}`);
    }
}

async function handleLance(message, args, senderPhone) {
    const [auctionId, bidAmount] = args;
    if (!auctionId || !bidAmount) return await message.reply('⚠️ Use: /leilao lance [id_leilao] [valor]');
    
    try {
        const result = await auctionService.placeBid(senderPhone, auctionId, bidAmount);
        await message.reply(result.formattedResponse);
    } catch (e) {
        await message.reply(`⚠️ Erro ao fazer lance: ${e.message}`);
    }
}

async function handleListarLeiloes(message, senderPhone) {
    try {
        const result = await auctionService.listActiveAuctions(senderPhone);
        await message.reply(result.formattedResponse);
    } catch (e) {
        await message.reply(`⚠️ Erro ao listar leilões: ${e.message}`);
    }
}

module.exports = { handleCriarLeilao, handleLance, handleListarLeiloes };
