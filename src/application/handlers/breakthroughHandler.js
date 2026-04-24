const cultivationService = require('../services/cultivationService');

async function handleRomper(message, args, senderPhone) {
    if (!args[0]) {
        return await message.reply('⚠️ Que caminho deseja romper? Use a técnica: /romper [corpo/espirito/alma]');
    }

    const pathType = args[0].toLowerCase();

    try {
        const result = await cultivationService.attemptBreakthrough(senderPhone, pathType);

        if (result.success) {
            const reply = `[TRIBULAÇÃO SUPERADA] ⚡
Os céus tremem! ${result.characterName} rompeu com sucesso o gargalo do Dao!

• Trilha Focada: ${result.path.charAt(0).toUpperCase() + result.path.slice(1)}
• Chance de Sucesso: ${result.chance}% (Rolou: ${result.roll})
• Novo Reino Alcançado: ${result.newRealm}º Reino

↳ Sua base avançou e seus limites de energia e atributos foram expandidos permanentemente.`;
            await message.reply(reply);
        } else {
            const reply = `[FALHA NO ROMPIMENTO] 💥
A energia saiu do controle e o gargalo resistiu à investida de ${result.characterName}.

• Trilha Focada: ${result.path.charAt(0).toUpperCase() + result.path.slice(1)}
• Chance de Sucesso: ${result.chance}% (Rolou: ${result.roll})
• Punição: Seus meridianos sofreram impacto e seu XP atual caiu para ${result.penaltyXp}.

↳ Medite para recuperar seu foco e tente novamente quando acumular Qi suficiente.`;
            await message.reply(reply);
        }
    } catch (error) {
        await message.reply(`⚠️ O ritual foi bloqueado: ${error.message}`);
    }
}

module.exports = handleRomper;
