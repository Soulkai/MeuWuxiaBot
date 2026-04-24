const professionService = require('../services/professionService');

async function handleEscolherProfissao(message, args, senderPhone) {
    if (!args[0]) return message.reply('⚠️ Use: /profissao escolher [pill_master|forge_master|weaver|etc]');
    try {
        const profName = await professionService.chooseProfession(senderPhone, args[0]);
        await message.reply(`✨ [ARTE INICIADA]\nVocê agora é um aprendiz na arte de: ${profName}!\nUse /receitas para ver o que pode criar.`);
    } catch (e) { message.reply(`⚠️ Erro: ${e.message}`); }
}

async function handleRefinar(message, args, senderPhone) {
    if (!args[0]) return message.reply('⚠️ Use: /refinar [codigo_da_receita]');
    try {
        const res = await professionService.craftItem(senderPhone, args[0]);
        if (res.success) {
            await message.reply(`🔥 [REFINO CONCLUÍDO]\nSucesso! Você criou: ${res.name}\nQualidade: ${res.quality}`);
        } else {
            await message.reply(`💨 [REFINO FALHOU]\nA chama oscilou e os materiais foram perdidos...`);
        }
    } catch (e) { message.reply(`⚠️ Erro: ${e.message}`); }
}

module.exports = { handleEscolherProfissao, handleRefinar };
