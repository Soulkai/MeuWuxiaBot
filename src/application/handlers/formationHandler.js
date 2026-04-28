const formationService = require('../services/formationService');

/**
 * Sprint 12: Artesanato Supremo (Parte 2)
 * Handler para criar e usar formações complexas
 * 
 * Comandos suportados:
 * - /formacao criar [nome] — Criar nova formação
 * - /formacao ativar [id] — Ativar formação
 * - /formacao listar — Listar formações
 * 
 * Referência: Seção 406
 */

async function handleCriarFormacao(message, args, senderPhone) {
    const formationName = args.join(' ');
    if (!formationName) return await message.reply('⚠️ Use: /formacao criar [nome]');
    
    try {
        const result = await formationService.createFormation(senderPhone, formationName);
        await message.reply(result.formattedResponse);
    } catch (e) {
        await message.reply(`⚠️ Erro ao criar formação: ${e.message}`);
    }
}

async function handleAtivarFormacao(message, args, senderPhone) {
    const formationId = args[0];
    if (!formationId) return await message.reply('⚠️ Use: /formacao ativar [id]');
    
    try {
        const result = await formationService.activateFormation(senderPhone, formationId);
        await message.reply(result.formattedResponse);
    } catch (e) {
        await message.reply(`⚠️ Erro ao ativar formação: ${e.message}`);
    }
}

async function handleListarFormacoes(message, senderPhone) {
    try {
        const result = await formationService.listFormations(senderPhone);
        await message.reply(result.formattedResponse);
    } catch (e) {
        await message.reply(`⚠️ Erro ao listar formações: ${e.message}`);
    }
}

module.exports = { handleCriarFormacao, handleAtivarFormacao, handleListarFormacoes };
