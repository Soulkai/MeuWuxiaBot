const playerService = require('../services/playerService');

// Nomes bonitos para os reinos (Baseados na sua Seção 7.5 do Documento v1)
const REALM_NAMES = {
    1: '1º Reino', 2: '2º Reino', 3: '3º Reino', 
    4: '4º Reino', 5: '5º Reino', 6: '6º Reino',
    7: '7º Reino', 8: '8º Reino', 9: '9º Reino'
};

async function handleProfile(message, senderPhone) {
    try {
        const profileData = await playerService.getPlayerProfile(senderPhone);
        const { player, cultivationPaths, wallet } = profileData;

        // Formata as trilhas de cultivo
        let cultivoText = '';
        cultivationPaths.forEach(path => {
            const pathName = path.path_type.charAt(0).toUpperCase() + path.path_type.slice(1);
            const realmName = REALM_NAMES[path.realm_index] || 'Desconhecido';
            cultivoText += `  ↳ ${pathName}: ${realmName} (${path.sublevel}/9)\n`;
        });

        const reply = `[PERFIL DO CULTIVADOR]
O espelho reflete a essência de ${player.character_name}.

• Origem: ${player.race_name} do ${player.clan_name}
• Fundações: Talento ${player.talent_tier} | ${player.root_name} | ${player.body_name}
• Cultivo Atual:
${cultivoText}
• Riqueza: ${wallet.gold} Ouro | ${wallet.spirit_stones} Pedras Espirituais
• Reputação: ${player.reputation} | Seita: Nenhuma (Mortal Errante)

Próximos comandos: /status /atributos /inventario`;

        await message.reply(reply);

    } catch (error) {
        await message.reply(`⚠️ O espelho está turvo: ${error.message}`);
    }
}

module.exports = handleProfile;
