const puppetService = require('../services/puppetService');

/**
 * Sprint 12: Artesanato Supremo (Parte 1)
 * Handler para criar e usar marionetes de combate
 * 
 * Comandos suportados:
 * - /marionete criar [nome] — Criar nova marionete
 * - /marionete ativar [id] — Ativar marionete em combate
 * - /marionete listar — Listar marionetes
 * 
 * Referência: Seção 406
 */

async function handleCriarMarionete(message, args, senderPhone) {
    const puppetName = args.join(' ');
    if (!puppetName) return await message.reply('⚠️ Use: /marionete criar [nome]');
    
    try {
        const result = await puppetService.createPuppet(senderPhone, puppetName);
        await message.reply(result.formattedResponse);
    } catch (e) {
        await message.reply(`⚠️ Erro ao criar marionete: ${e.message}`);
    }
}

async function handleAtivarMarionete(message, args, senderPhone) {
    const puppetId = args[0];
    if (!puppetId) return await message.reply('⚠️ Use: /marionete ativar [id]');
    
    try {
        const result = await puppetService.activatePuppet(senderPhone, puppetId);
        await message.reply(result.formattedResponse);
    } catch (e) {
        await message.reply(`⚠️ Erro ao ativar marionete: ${e.message}`);
    }
}

async function handleListarMarionetes(message, senderPhone) {
    try {
        const result = await puppetService.listPuppets(senderPhone);
        await message.reply(result.formattedResponse);
    } catch (e) {
        await message.reply(`⚠️ Erro ao listar marionetes: ${e.message}`);
    }
}

module.exports = { handleCriarMarionete, handleAtivarMarionete, handleListarMarionetes };
