const playerService = require('../services/playerService');

async function handleAtributos(message, senderPhone) {
    try {
        const stats = await playerService.getPlayerStats(senderPhone);

        const reply = `[ATRIBUTOS PRINCIPAIS]
As capacidades inatas de ${stats.character_name}:

• Físico: Força ${stats.strength} | Agilidade ${stats.agility} | Constituição ${stats.constitution}
• Mente: Inteligência ${stats.intelligence} | Percepção ${stats.perception} | Vontade ${stats.willpower}
• Espírito: Espírito ${stats.spirit} | Compreensão ${stats.comprehension}
• Destino: Sorte ${stats.luck} | Carisma ${stats.charisma}

Próximos comandos: /status /perfil /inventario`;

        await message.reply(reply);
    } catch (error) {
        await message.reply(`⚠️ Seus atributos estão ocultos: ${error.message}`);
    }
}

module.exports = handleAtributos;
