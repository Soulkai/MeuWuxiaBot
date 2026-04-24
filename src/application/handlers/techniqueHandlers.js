const techniqueService = require('../services/techniqueService');

async function handleLivros(message, senderPhone) {
    try {
        const data = await techniqueService.getPlayerTechniques(senderPhone, false);
        if (data.items.length === 0) return await message.reply('↳ Você não possui nenhum manual de técnica sendo estudado.');
        
        let text = `[PAVILHÃO DE MANUAIS]\nManuais em estudo por ${data.playerName}:\n\n`;
        data.items.forEach(i => {
            const status = i.level === -1 ? '⚠️ Sofreu Desvio (Requer 100%)' : 'Apto para /aprender';
            text += `📖 ID [${i.pt_id}] - ${i.name}\n↳ Compreensão: ${i.xp_current}% ${i.xp_current >= 50 ? `(${status})` : ''}\n\n`;
        });
        text += `Use: /compreender [ID] ou /aprender [ID]`;
        await message.reply(text);
    } catch (err) { await message.reply(`⚠️ Erro: ${err.message}`); }
}

async function handleTecnicas(message, senderPhone) {
    try {
        const data = await techniqueService.getPlayerTechniques(senderPhone, true);
        if (data.items.length === 0) return await message.reply('↳ Você ainda não aprendeu nenhuma técnica.');
        
        let text = `[TÉCNICAS DOMINADAS]\nArtes marciais e métodos de ${data.playerName}:\n\n`;
        data.items.forEach(i => {
            text += `⚔️ ID [${i.pt_id}] - ${i.name} [Lv. ${i.level}]\n↳ Tipo: ${i.category} | Proficiência: ${i.xp_current}/100 | Equipado: ${i.is_equipped ? 'Sim ✅' : 'Não ❌'}\n\n`;
        });
        text += `Use: /equipartecnica [ID]`;
        await message.reply(text);
    } catch (err) { await message.reply(`⚠️ Erro: ${err.message}`); }
}

async function handleCompreender(message, args, senderPhone) {
    if (!args[0]) return await message.reply('⚠️ Formato: /compreender [ID]');
    try {
        const res = await techniqueService.comprehendTechnique(senderPhone, args[0]);
        await message.reply(`[ESTUDO PROFUNDO]\nVocê meditou sobre o manual [${res.name}].\n\n• Ganho de Compreensão: +${res.gain}%\n• Compreensão Total: ${res.current}%\n\n${res.current >= 50 && !res.failedBefore ? '💡 Você atingiu 50%! Já pode usar /aprender para tentar a epifania, ou continuar estudando até 100% para garantir!' : ''}`);
    } catch (err) { await message.reply(`⚠️ Erro: ${err.message}`); }
}

async function handleAprender(message, args, senderPhone) {
    if (!args[0]) return await message.reply('⚠️ Formato: /aprender [ID]');
    try {
        const res = await techniqueService.learnTechnique(senderPhone, args[0]);
        if (res.success) {
            await message.reply(`[EPIFANIA ALCANÇADA] 🌟\nSua mente se abriu e você dominou a técnica [${res.name}]!\n\n• Detalhes: ${res.chanceDesc}\n\n↳ Use /equipartecnica ${args[0]} para ativá-la!`);
        } else {
            await message.reply(`[FALHA DE COMPREENSÃO] 💥\nVocê tentou absorver os segredos de [${res.name}], mas sofreu uma rejeição de Qi!\n\n• Detalhes: ${res.chanceDesc}\n• Punição: Compreensão caiu para ${res.penaltyXp}%\n\n↳ O Dao o rejeitou hoje. Agora você só poderá aprender esta técnica quando chegar em 100% de compreensão.`);
        }
    } catch (err) { await message.reply(`⚠️ Erro: ${err.message}`); }
}

async function handleEquipar(message, args, senderPhone) {
    if (!args[0]) return await message.reply('⚠️ Formato: /equipartecnica [ID]');
    try {
        const name = await techniqueService.equipTechnique(senderPhone, args[0]);
        await message.reply(`[TÉCNICA EQUIPADA] ⚔️\nVocê ativou a técnica [${name}] com sucesso no seu Mar de Consciência!`);
    } catch (err) { await message.reply(`⚠️ Erro: ${err.message}`); }
}

module.exports = { handleLivros, handleTecnicas, handleCompreender, handleAprender, handleEquipar };
