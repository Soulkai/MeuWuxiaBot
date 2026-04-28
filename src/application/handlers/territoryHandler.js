const territoryService = require('../services/territoryService');

/**
 * Sprint 13: Guerra das Seitas e Territórios (Parte 2)
 * Handler para gerenciar territórios e geração de riqueza
 * 
 * Comandos suportados:
 * - /territorio investir [id_territorio] [amount] — Investir em desenvolvimento
 * - /territorio coletar [id_territorio] — Coletar riquezas geradas
 * - /territorio listar — Listar territórios da seita
 * 
 * Referência: Seção 406
 */

async function handleInvestirTerritorio(message, args, senderPhone) {
    const [territoryId, amount] = args;
    if (!territoryId || !amount) return await message.reply('⚠️ Use: /territorio investir [id] [valor]');
    
    try {
        const result = await territoryService.investTerritory(senderPhone, territoryId, amount);
        await message.reply(result.formattedResponse);
    } catch (e) {
        await message.reply(`⚠️ Erro ao investir: ${e.message}`);
    }
}

async function handleColetarTerritorio(message, args, senderPhone) {
    const territoryId = args[0];
    if (!territoryId) return await message.reply('⚠️ Use: /territorio coletar [id]');
    
    try {
        const result = await territoryService.collectTerritoryWealth(senderPhone, territoryId);
        await message.reply(result.formattedResponse);
    } catch (e) {
        await message.reply(`⚠️ Erro ao coletar: ${e.message}`);
    }
}

async function handleListarTerritorio(message, senderPhone) {
    try {
        const result = await territoryService.listSectTerritories(senderPhone);
        await message.reply(result.formattedResponse);
    } catch (e) {
        await message.reply(`⚠️ Erro ao listar territórios: ${e.message}`);
    }
}

module.exports = { handleInvestirTerritorio, handleColetarTerritorio, handleListarTerritorio };
