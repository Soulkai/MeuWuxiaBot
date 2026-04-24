const playerService = require('../services/playerService');

async function handleStatus(message, senderPhone) {
    try {
        const stats = await playerService.getPlayerStats(senderPhone);

        const reply = `[STATUS DO CULTIVADOR]
A energia vital de ${stats.character_name} flui da seguinte forma:

• HP (Vida): ${stats.hp_current} / ${stats.hp_max}
• Qi (Espiritual): ${stats.qi_current} / ${stats.qi_max}
• Energia Corporal: ${stats.body_energy_current} / ${stats.body_energy_max}
• Alma: ${stats.soul_current} / ${stats.soul_max}
• Fadiga: ${stats.fatigue}

Próximos comandos: /atributos /perfil /inventario`;

        await message.reply(reply);
    } catch (error) {
        await message.reply(`⚠️ Não foi possível ler o seu status: ${error.message}`);
    }
}

module.exports = handleStatus;
