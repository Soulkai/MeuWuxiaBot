const combatService = require('../services/combatService');

/**
 * Sprint 9: Leis do Combate
 * Handler para gerenciar ações de combate em turnos (PvE e PvP)
 * 
 * Comandos suportados:
 * - /atacar [alvo] — Atacar um inimigo
 * - /defender — Entrar em postura defensiva
 * - /esquivar — Tentar esquivar do próximo ataque
 * - /fugir — Tentar fugir do combate
 * 
 * Referência: Seções 165, 1305
 */

async function handleAtacar(message, args, senderPhone) {
    const targetName = args[0];
    if (!targetName) return await message.reply('⚠️ Use: /atacar [nome_do_alvo]');
    
    try {
        const result = await combatService.initiateAttack(senderPhone, targetName);
        await message.reply(result.formattedResponse);
    } catch (e) {
        await message.reply(`⚠️ Erro no ataque: ${e.message}`);
    }
}

async function handleDefender(message, senderPhone) {
    try {
        const result = await combatService.activateDefense(senderPhone);
        await message.reply(result.formattedResponse);
    } catch (e) {
        await message.reply(`⚠️ Erro ao defender: ${e.message}`);
    }
}

async function handleEsquivar(message, senderPhone) {
    try {
        const result = await combatService.activateDodge(senderPhone);
        await message.reply(result.formattedResponse);
    } catch (e) {
        await message.reply(`⚠️ Erro ao esquivar: ${e.message}`);
    }
}

async function handleFugir(message, senderPhone) {
    try {
        const result = await combatService.attemptFlee(senderPhone);
        await message.reply(result.formattedResponse);
    } catch (e) {
        await message.reply(`⚠️ Erro ao fugir: ${e.message}`);
    }
}

async function handleChefe(message, args, senderPhone) {
    const bossName = args[0];
    if (!bossName) return await message.reply('⚠️ Use: /chefe [nome_do_chefe]');
    
    try {
        const result = await combatService.initiateBossFight(senderPhone, bossName);
        await message.reply(result.formattedResponse);
    } catch (e) {
        await message.reply(`⚠️ Erro ao invocar chefe: ${e.message}`);
    }
}

async function handleRaid(message, args, senderPhone) {
    const raidId = args[0];
    if (!raidId) return await message.reply('⚠️ Use: /raid [id_do_raid]');
    
    try {
        const result = await combatService.joinRaid(senderPhone, raidId);
        await message.reply(result.formattedResponse);
    } catch (e) {
        await message.reply(`⚠️ Erro ao entrar no raid: ${e.message}`);
    }
}

module.exports = { handleAtacar, handleDefender, handleEsquivar, handleFugir, handleChefe, handleRaid };
