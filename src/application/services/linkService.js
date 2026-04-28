const linkRepository = require('../../infra/db/repositories/linkRepository');
const playerService = require('./playerService');

async function createLinkCode(privateJid) {
    // Garante que o jogador já exista no sistema antes de gerar o código
    await playerService.getPlayerProfile(privateJid);
    const code = await linkRepository.createLinkCode(privateJid);
    return code;
}

async function linkGroupParticipant(groupChatId, participantJid, code) {
    const linkRow = await linkRepository.getLinkCode(code);
    if (!linkRow) {
        throw new Error('Código inválido, expirado ou já utilizado. Gere um novo com /getid no privado.');
    }

    await linkRepository.createGroupLink(groupChatId, participantJid, linkRow.private_jid);
    await linkRepository.markLinkCodeUsed(code);

    return {
        privateJid: linkRow.private_jid
    };
}

async function getLinkedPrivateJid(groupChatId, participantJid) {
    return await linkRepository.getPrivateJidByGroupParticipant(groupChatId, participantJid);
}

module.exports = {
    createLinkCode,
    linkGroupParticipant,
    getLinkedPrivateJid
};
