const eventService = require('../services/eventService');

/**
 * Sprint 14: Mundo Vivo e Laços do Destino (Parte 2)
 * Handler para eventos globais e NPCs avançados
 * 
 * Comandos suportados:
 * - /evento listar — Listar eventos ativos
 * - /evento participar [id_evento] — Participar de evento
 * - /npc interagir [id_npc] — Interagir com NPC
 * 
 * Referência: Seção 406
 */

async function handleListarEventos(message, senderPhone) {
    try {
        const result = await eventService.listActiveEvents(senderPhone);
        await message.reply(result.formattedResponse);
    } catch (e) {
        await message.reply(`⚠️ Erro ao listar eventos: ${e.message}`);
    }
}

async function handleParticiparEvento(message, args, senderPhone) {
    const eventId = args[0];
    if (!eventId) return await message.reply('⚠️ Use: /evento participar [id_evento]');
    
    try {
        const result = await eventService.joinEvent(senderPhone, eventId);
        await message.reply(result.formattedResponse);
    } catch (e) {
        await message.reply(`⚠️ Erro ao participar de evento: ${e.message}`);
    }
}

async function handleInteragirNPC(message, args, senderPhone) {
    const npcId = args[0];
    if (!npcId) return await message.reply('⚠️ Use: /npc interagir [id_npc]');
    
    try {
        const result = await eventService.interactWithNPC(senderPhone, npcId);
        await message.reply(result.formattedResponse);
    } catch (e) {
        await message.reply(`⚠️ Erro ao interagir com NPC: ${e.message}`);
    }
}

module.exports = { handleListarEventos, handleParticiparEvento, handleInteragirNPC };
