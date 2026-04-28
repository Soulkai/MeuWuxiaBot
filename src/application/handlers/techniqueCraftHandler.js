const techniqueCraftService = require('../services/techniqueCraftService');

/**
 * Sprint 12: Artesanato Supremo (Parte 3)
 * Handler para criar técnicas próprias personalizadas
 * 
 * Comandos suportados:
 * - /tecnica_propria criar [nome] — Criar nova técnica
 * - /tecnica_propria adicionar_efeito [id_tecnica] [efeito] — Adicionar efeito
 * - /tecnica_propria listar — Listar técnicas próprias
 * 
 * Referência: Seção 406
 */

async function handleCriarTecnica(message, args, senderPhone) {
    const techniqueName = args.join(' ');
    if (!techniqueName) return await message.reply('⚠️ Use: /tecnica_propria criar [nome]');
    
    try {
        const result = await techniqueCraftService.createCustomTechnique(senderPhone, techniqueName);
        await message.reply(result.formattedResponse);
    } catch (e) {
        await message.reply(`⚠️ Erro ao criar técnica: ${e.message}`);
    }
}

async function handleAdicionarEfeito(message, args, senderPhone) {
    const [techniqueId, ...effectArgs] = args;
    if (!techniqueId || effectArgs.length === 0) return await message.reply('⚠️ Use: /tecnica_propria adicionar_efeito [id] [efeito]');
    
    try {
        const result = await techniqueCraftService.addEffectToTechnique(senderPhone, techniqueId, effectArgs.join(' '));
        await message.reply(result.formattedResponse);
    } catch (e) {
        await message.reply(`⚠️ Erro ao adicionar efeito: ${e.message}`);
    }
}

async function handleListarTecnicas(message, senderPhone) {
    try {
        const result = await techniqueCraftService.listCustomTechniques(senderPhone);
        await message.reply(result.formattedResponse);
    } catch (e) {
        await message.reply(`⚠️ Erro ao listar técnicas: ${e.message}`);
    }
}

module.exports = { handleCriarTecnica, handleAdicionarEfeito, handleListarTecnicas };
