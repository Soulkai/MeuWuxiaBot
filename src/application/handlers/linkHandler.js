const linkService = require('../services/linkService');

async function handleGetId(message, args, senderPhone) {
    if (message.isGroupMsg) {
        await message.reply('⚠️ Este comando só pode ser usado em conversa privada. Abra um chat comigo e tente novamente.');
        return;
    }

    try {
        const code = await linkService.createLinkCode(senderPhone);
        const reply = `🔐 Código de vínculo gerado!

Use este código em um grupo com o comando:
/linkar ${code}

Ele foi criado para conectar seu personagem privado ao personagem que você usa em grupo.

⏳ Validade: 60 minutos
⚠️ Não compartilhe este código publicamente.`;
        await message.reply(reply);
    } catch (error) {
        await message.reply(`❌ Não foi possível gerar o código: ${error.message}`);
    }
}

async function handleLinkar(message, args, senderPhone) {
    if (!message.isGroupMsg) {
        await message.reply('⚠️ Este comando só funciona dentro de um grupo. Use /getid no privado para gerar um código e depois digite /linkar [codigo] no grupo.');
        return;
    }

    if (!args || args.length === 0) {
        await message.reply(`⚠️ Use: /linkar [código]\nExemplo: /linkar LINK-ABC123`);
        return;
    }

    const code = args[0].trim();
    const participantJid = message.author || senderPhone;
    const groupChatId = message.from;

    try {
        const result = await linkService.linkGroupParticipant(groupChatId, participantJid, code);
        await message.reply(`✅ Vínculo realizado com sucesso!
Seu personagem de grupo foi conectado ao seu perfil privado (${result.privateJid}).`);
    } catch (error) {
        await message.reply(`❌ Não foi possível conectar o personagem: ${error.message}`);
    }
}

module.exports = {
    handleGetId,
    handleLinkar
};
