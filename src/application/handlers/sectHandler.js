const sectService = require('../services/sectService');

async function handleSeita(message, args, senderPhone) {
    const subCommand = args[0] ? args[0].toLowerCase() : 'info';

    try {
        if (subCommand === 'criar') {
            const sectName = args.slice(1).join(' ');
            if (!sectName) return message.reply('⚠️ Forneça um nome! Exemplo: /seita criar Seita da Nuvem Flutuante');
            
            const res = await sectService.createSect(senderPhone, sectName);
            await message.reply(`⛩️ [FUNDAÇÃO DA SEITA]\nOs céus testemunham a criação da [${res.sectName}]!\n\n↳ O Patriarca ${res.founder} pagou 1000 de Ouro e estabeleceu sua base marcial.`);

        } else if (subCommand === 'info') {
            const info = await sectService.getSectInfo(senderPhone);
            await message.reply(`⛩️ [${info.name.toUpperCase()}]\n"${info.description}"\n\n• Nível: ${info.level}\n• Prestígio: ${info.prestige}\n• Riqueza da Seita: ${info.wealth} Ouro\n• Membros: ${info.member_count}\n\nUse /seita membros para ver os discípulos.`);

        } else if (subCommand === 'membros') {
            const members = await sectService.listSectMembers(senderPhone);
            let text = `👥 [DISCÍPULOS DA SEITA]\n\n`;
            members.forEach(m => {
                text += `• ${m.character_name} [${m.role}]\n  ↳ Reino Espiritual: ${m.realm_index} | Contribuição: ${m.contribution_points}\n`;
            });
            await message.reply(text);

        } else if (subCommand === 'lista') {
            const sects = await sectService.listAllSects();
            if (sects.length === 0) return message.reply('⛩️ Nenhuma seita foi fundada ainda. Seja o primeiro usando /seita criar!');
            
            let text = `⛩️ [POTÊNCIAS DO MUNDO]\n\n`;
            sects.forEach(s => {
                text += `ID [${s.id}] - ${s.name} (Nv. ${s.level}) - Membros: ${s.count}\n`;
            });
            text += `\nPara se juntar a uma, use: /seita entrar [ID]`;
            await message.reply(text);

        } else if (subCommand === 'entrar') {
            const sectId = args[1];
            if (!sectId) return message.reply('⚠️ Forneça o ID da Seita! Ex: /seita entrar 1');
            
            const joinedName = await sectService.joinSect(senderPhone, sectId);
            await message.reply(`⛩️ Você ajoelhou-se e tornou-se um Discípulo Externo da [${joinedName}]!`);

        } else {
            await message.reply('⚠️ Comando de seita desconhecido. Use: criar, info, membros, lista ou entrar.');
        }
    } catch (e) {
        await message.reply(`⚠️ O ritual da seita falhou: ${e.message}`);
    }
}

module.exports = { handleSeita };
