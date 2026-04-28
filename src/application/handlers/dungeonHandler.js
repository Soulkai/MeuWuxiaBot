const combatService = require('../services/combatService');

/**
 * Sprint 9: Leis do Combate
 * Handler para combates avançados contra chefes e raids
 * 
 * Comandos suportados:
 * - /boss [nome_chefe] — Enfrentar um chefe de masmorra
 * - /raid [id_raid] — Participar de um raid em grupo
 * 
 * Referência: Seção 164
 */

async function handleBoss(message, args, senderPhone) {
    const bossName = args.join(' ');
    if (!bossName) return await message.reply('⚠️ Use: /boss [nome_do_chefe]');
    
    try {
        const result = await combatService.initiateBossFight(senderPhone, bossName);
        await message.reply(result.formattedResponse);
    } catch (e) {
        await message.reply(`⚠️ Erro ao invocar chefe: ${e.message}`);
    }
}

async function handleRaid(message, args, senderPhone) {
    const raidId = args[0];
    if (!raidId) return await message.reply('⚠️ Use: /raid [id_raid]');
    
    try {
        const result = await combatService.joinRaid(senderPhone, raidId);
        await message.reply(result.formattedResponse);
    } catch (e) {
        await message.reply(`⚠️ Erro ao entrar no raid: ${e.message}`);
    }
}

module.exports = { handleBoss, handleRaid };
