const beastService = require('../services/beastService');

/**
 * Sprint 10: Maestria das Bestas
 * Handler para gerenciar ovos, eclosão e treinamento de bestas
 * 
 * Comandos suportados:
 * - /besta chocar [id_ovo] — Chocar um ovo para obter uma besta
 * - /besta treinar — Treinar a besta ativa
 * - /besta status — Ver status da besta
 * 
 * Referência: Seção 1306
 */

async function handleBeastChocar(message, args, senderPhone) {
    const eggId = args[0];
    if (!eggId) return await message.reply('⚠️ Use: /besta chocar [id_ovo]');
    
    try {
        const result = await beastService.hatchEgg(senderPhone, eggId);
        await message.reply(result.formattedResponse);
    } catch (e) {
        await message.reply(`⚠️ Erro ao chocar ovo: ${e.message}`);
    }
}

async function handleBeastTreinar(message, senderPhone) {
    try {
        const result = await beastService.trainBeast(senderPhone);
        await message.reply(result.formattedResponse);
    } catch (e) {
        await message.reply(`⚠️ Erro ao treinar besta: ${e.message}`);
    }
}

async function handleBeastStatus(message, senderPhone) {
    try {
        const result = await beastService.getBeastStatus(senderPhone);
        await message.reply(result.formattedResponse);
    } catch (e) {
        await message.reply(`⚠️ Erro ao consultar besta: ${e.message}`);
    }
}

module.exports = { handleBeastChocar, handleBeastTreinar, handleBeastStatus };
