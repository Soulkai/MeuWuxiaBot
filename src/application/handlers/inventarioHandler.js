const playerService = require('../services/playerService');

async function handleInventario(message, senderPhone) {
    try {
        const invData = await playerService.getPlayerInventory(senderPhone);
        const { player, wallet, items } = invData;

        // Formata a lista de itens (limite visual de segurança para não poluir o chat)
        let itensTexto = '';
        if (items.length === 0) {
            itensTexto = '  ↳ Seu anel espacial está vazio.';
        } else {
            // Mostra até 5 itens distintos para respeitar as regras de UX
            const maxItems = Math.min(items.length, 5);
            for (let i = 0; i < maxItems; i++) {
                const it = items[i];
                itensTexto += `  ↳ ${it.quantity}x ${it.name} (${it.rarity} - ${it.quality_tier})\n`;
            }
            if (items.length > 5) itensTexto += `  ↳ ... e mais ${items.length - 5} tipos de itens ocultos.`;
        }

        const reply = `[INVENTÁRIO ESPIRITUAL]
Os tesouros atuais de ${player.character_name}:

• Ouro Mortal: ${wallet.gold}
• Pedras Espirituais: ${wallet.spirit_stones}
• Cristais Celestiais: ${wallet.celestial_crystals}
• Bolsa de Itens:
${itensTexto}

Próximos comandos: /perfil /status /loja`;

        await message.reply(reply);
    } catch (error) {
        await message.reply(`⚠️ O selo do seu anel espacial resiste: ${error.message}`);
    }
}

module.exports = handleInventario;
