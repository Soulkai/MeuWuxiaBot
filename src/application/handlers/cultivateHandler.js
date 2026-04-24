const cultivationService = require('../services/cultivationService');

async function handleCultivation(message, senderPhone, commandName) {
    try {
        const result = await cultivationService.performCultivationAction(senderPhone, commandName);

        const reply = `[${result.actionName.toUpperCase()}]
${result.characterName} canalizou o Qi através da técnica [${result.techniqueName}].

• Trilha Focada: ${result.path.charAt(0).toUpperCase() + result.path.slice(1)}
• XP Recebido: +${result.gainedXp} (Base: ${result.baseXp})
• Custo de Fadiga: +${result.fatigueCost}

📊 Bônus Aplicados:
  ↳ Talento: x${result.multDetails.talento}
  ↳ Técnica: x${result.multDetails.tecnica}
  ↳ Linhagens: x${result.multDetails.origem}
  ↳ Região Atual: x${result.multDetails.regiao}

Próximos comandos: /status /perfil /romper`;

        await message.reply(reply);
    } catch (error) {
        // Formatação especial se o erro for a falta de técnica
        if (error.message.includes('não possui uma técnica')) {
            await message.reply(`⚠️ O Caminho está bloqueado:\n${error.message}`);
        } else {
            await message.reply(`⚠️ Ocorreu uma perturbação no fluxo de energia: ${error.message}`);
        }
    }
}

module.exports = handleCultivation;
