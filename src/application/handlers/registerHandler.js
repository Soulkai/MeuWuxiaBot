const playerService = require('../services/playerService');

async function handleRegister(message, args, senderPhone, pushname) {
    // Validação inicial do formato do comando
    if (args.length < 2) {
        await message.reply('⚠️ Formato incorreto. Use a técnica: /registrar [Nome] [Sexo: M/F]');
        return;
    }

    const characterName = args[0];
    const sex = args[1].toUpperCase();

    // Validação do Sexo (Enum permitido)
    if (!['M', 'F'].includes(sex)) {
        await message.reply('⚠️ Sexo inválido. Escolha M ou F.');
        return;
    }

    // Validação do tamanho do Nome
    if (characterName.length < 3 || characterName.length > 18) {
        await message.reply('⚠️ O nome do seu cultivador deve ter entre 3 e 18 caracteres.');
        return;
    }

    try {
        // Invoca o Serviço de Jogador para materializar os dados no SQLite
        const result = await playerService.registerPlayer(senderPhone, pushname, characterName, sex);

        // Formata a resposta seguindo o Padrão Textual da v3
        const reply = `[REGISTRO CONCLUÍDO]
Seu personagem foi criado com sucesso, e os Céus testemunharam o seu nascimento!

• Nome: ${result.name}
• Raça: ${result.race}
• Clã: ${result.clan}
• Talento: ${result.talent}
• Raiz Espiritual: ${result.root}
• Corpo Especial: ${result.body}

Próximos comandos: /perfil /status /cultivar espirito`;

        await message.reply(reply);
    } catch (error) {
        // Trata erros como "telefone já registrado" ou "nome duplicado"
        await message.reply(`❌ Ocorreu um desvio de cultivo ao registrar: ${error.message}`);
    }
}

module.exports = handleRegister;
