const companionService = require('../services/companionService');

/**
 * Sprint 14: Mundo Vivo e Laços do Destino (Parte 1)
 * Handler para casamentos e companheiros do Dao
 * 
 * Comandos suportados:
 * - /casamento propor [nome_alvo] — Propor casamento
 * - /casamento aceitar [id] — Aceitar proposta
 * - /dao_companion ativar [id] — Ativar companheiro
 * 
 * Referência: Seção 406
 */

async function handleProporCasamento(message, args, senderPhone) {
    const targetName = args.join(' ');
    if (!targetName) return await message.reply('⚠️ Use: /casamento propor [nome_alvo]');
    
    try {
        const result = await companionService.proposeMarriage(senderPhone, targetName);
        await message.reply(result.formattedResponse);
    } catch (e) {
        await message.reply(`⚠️ Erro ao propor casamento: ${e.message}`);
    }
}

async function handleAceitarCasamento(message, args, senderPhone) {
    const proposalId = args[0];
    if (!proposalId) return await message.reply('⚠️ Use: /casamento aceitar [id_proposta]');
    
    try {
        const result = await companionService.acceptMarriage(senderPhone, proposalId);
        await message.reply(result.formattedResponse);
    } catch (e) {
        await message.reply(`⚠️ Erro ao aceitar casamento: ${e.message}`);
    }
}

async function handleAtivarCompanheiro(message, args, senderPhone) {
    const companionId = args[0];
    if (!companionId) return await message.reply('⚠️ Use: /dao_companion ativar [id]');
    
    try {
        const result = await companionService.activateDaoCompanion(senderPhone, companionId);
        await message.reply(result.formattedResponse);
    } catch (e) {
        await message.reply(`⚠️ Erro ao ativar companheiro: ${e.message}`);
    }
}

module.exports = { handleProporCasamento, handleAceitarCasamento, handleAtivarCompanheiro };
