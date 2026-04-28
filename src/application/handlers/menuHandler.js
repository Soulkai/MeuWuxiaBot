const fs = require('fs');
const path = require('path');

async function handleMenu(message, args, senderPhone) {
    try {
        const readmePath = path.join(__dirname, '../../../README.md');
        const md = fs.readFileSync(readmePath, 'utf8');
        const start = md.indexOf('## 📜 Lista de Comandos Oficiais');
        let payload;
        if (start !== -1) {
            const slice = md.slice(start);
            const endMatch = slice.search(/\n##\s/);
            payload = endMatch === -1 ? slice : slice.slice(0, endMatch);
        } else {
            payload = '📜 Menu de comandos não encontrado no README. Use /changelog para ver alterações recentes.';
        }

        const chunkSize = 15000;
        for (let i = 0; i < payload.length; i += chunkSize) {
            const chunk = payload.slice(i, i + chunkSize);
            await message.reply(chunk);
        }
    } catch (e) {
        await message.reply(`⚠️ Erro ao carregar menu: ${e.message}`);
    }
}

module.exports = { handleMenu };
