const socialService = require('../services/socialService');

async function handleConversar(message, args, senderPhone) {
    const targetName = args[0];
    const textMsg = args.slice(1).join(' ');

    if (!targetName || !textMsg) {
        return message.reply('⚠️ Formato incorreto!\nUse: /conversar [Nome_do_Jogador] [Sua mensagem aqui]\nEx: /conversar LinMing Você quer caçar bestas hoje?');
    }

    try {
        const res = await socialService.prepareWhisper(senderPhone, targetName, textMsg);
        
        // Magia do WhatsApp: Envia a mensagem telepática diretamente para o número do alvo!
        await message.client.sendMessage(res.targetPhone, res.formattedMessage);
        
        // Confirma para quem enviou
        await message.reply(`✨ Mensagem telepática enviada com sucesso para ${res.targetName}!`);
    } catch (e) { 
        await message.reply(`⚠️ Falha na transmissão: ${e.message}`); 
    }
}

async function handleTransferir(message, args, senderPhone) {
    // /transferir [Nome_do_Jogador] [ID_do_Item] [Quantidade]
    const targetName = args[0];
    const itemTarget = args[1];
    const qty = parseInt(args[2]) || 1;

    if (!targetName || !itemTarget) {
        return message.reply('⚠️ Formato incorreto!\nUse: /transferir [Nome_do_Jogador] [ID_do_Item] [Quantidade]');
    }

    try {
        const res = await socialService.transferItem(senderPhone, targetName, itemTarget, qty);
        
        // Magia do WhatsApp: Notifica o recebedor do presente
        await message.client.sendMessage(res.targetPhone, res.targetNotification);

        // Confirma para o remetente
        await message.reply(`📦 [TRANSFERÊNCIA SUCEDIDA]\nVocê entregou ${qty}x ${res.itemName} para ${res.targetName}.`);
    } catch (e) { 
        await message.reply(`⚠️ A transferência falhou: ${e.message}`); 
    }
}

module.exports = { handleConversar, handleTransferir };
