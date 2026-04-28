const sectWarService = require('../services/sectWarService');

/**
 * Sprint 13: Guerra das Seitas e Territórios (Parte 1)
 * Handler para guerras entre seitas
 * 
 * Comandos suportados:
 * - /seita guerra [id_seita_inimiga] — Declarar guerra
 * - /seita dominar [id_territorio] — Tentar dominar território
 * 
 * Referência: Seção 406
 */

async function handleDeclararGuerra(message, args, senderPhone) {
    const targetSectId = args[0];
    if (!targetSectId) return await message.reply('⚠️ Use: /seita guerra [id_seita_inimiga]');
    
    try {
        const result = await sectWarService.declareSectWar(senderPhone, targetSectId);
        await message.reply(result.formattedResponse);
    } catch (e) {
        await message.reply(`⚠️ Erro ao declarar guerra: ${e.message}`);
    }
}

async function handleDominarTerritorio(message, args, senderPhone) {
    const territoryId = args[0];
    if (!territoryId) return await message.reply('⚠️ Use: /seita dominar [id_territorio]');
    
    try {
        const result = await sectWarService.attemptDominateTerritory(senderPhone, territoryId);
        await message.reply(result.formattedResponse);
    } catch (e) {
        await message.reply(`⚠️ Erro ao dominar território: ${e.message}`);
    }
}

module.exports = { handleDeclararGuerra, handleDominarTerritorio };
