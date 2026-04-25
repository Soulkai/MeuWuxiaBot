const travelService = require('../services/travelService');
const explorationService = require('../services/explorationService');

async function handleArea(message, senderPhone) {
    try {
        const { player, nearbyRegions } = await travelService.getNearbyAreas(senderPhone);
        const current = nearbyRegions.find(r => r.id === player.region_id);
        
        // NOVO: Puxa quem mais está na região
        const localPlayers = await explorationService.getPlayersInLocalArea(senderPhone);
        let playersText = localPlayers.length > 0 
            ? `\n\n👥 Cultivadores na área: ${localPlayers.join(', ')}` 
            : `\n\n👥 Nenhum outro cultivador à vista.`;

        await message.reply(`[SUA LOCALIZAÇÃO]\n📍 ${player.character_name} está em:\n${current.name}\n\n↳ Nível de Perigo: ${current.danger_level}\n↳ Cultivo Sugerido: Reino ${current.min_realm_index}${playersText}\n\nUse: /lista area, /explorar ou /conversar`);
    } catch (err) { await message.reply(`⚠️ Erro: ${err.message}`); }
}

async function handleListaArea(message, senderPhone) {
    try {
        const { nearbyRegions, player } = await travelService.getNearbyAreas(senderPhone);
        
        let text = `[ÁREAS ACESSÍVEIS]\nRotas disponíveis a partir de onde você está:\n\n`;
        nearbyRegions.forEach(r => {
            const isCurrent = r.id === player.region_id ? ' (📍 Você está aqui)' : '';
            text += `🗺️ ID [${r.id}] - ${r.name}${isCurrent}\n↳ Perigo: Nv. ${r.danger_level} | Cultivo Mínimo: Reino ${r.min_realm_index}\n\n`;
        });
        text += `Use: /viajar [ID ou Nome]`;
        await message.reply(text);
    } catch (err) { await message.reply(`⚠️ Erro: ${err.message}`); }
}

async function handleViajar(message, args, senderPhone) {
    const destino = args.join(' ');
    if (!destino) return await message.reply('⚠️ Para onde deseja ir? Ex: /viajar 15 ou /viajar Vila');
    try {
        const target = await travelService.travelTo(senderPhone, destino);
        await message.reply(`[VIAGEM CONCLUÍDA] 🥾\nApós horas de caminhada, você atravessou as fronteiras e chegou em:\n\n📍 ${target.name}\n\n↳ A partir daqui, novas áreas podem estar visíveis em /lista area.`);
    } catch (err) { await message.reply(`⚠️ A viagem falhou: ${err.message}`); }
}

async function handleExplorar(message, senderPhone) {
    try {
        const res = await explorationService.exploreArea(senderPhone);
        
        // NOVO: Inclui o "socialEncounter" caso tenha esbarrado em alguém
        await message.reply(`[EXPLORAÇÃO] 🧭\nCaminhando pelos arredores de ${res.regionName}...\n\n${res.encounterText}\n${res.dropText}${res.socialEncounter}\n\nPróximos comandos: /status /explorar /inventario`);
    } catch (err) { await message.reply(`⚠️ Erro: ${err.message}`); }
}

module.exports = { handleArea, handleListaArea, handleViajar, handleExplorar };
