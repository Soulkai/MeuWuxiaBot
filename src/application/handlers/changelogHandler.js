const fs = require('fs');
const path = require('path');

async function handleChangelog(message, args, senderPhone) {
    try {
        const changelogPath = path.join(__dirname, '../../../CHANGELOG.md');
        if (fs.existsSync(changelogPath)) {
            const md = fs.readFileSync(changelogPath, 'utf8');
            const chunkSize = 1500;
            for (let i = 0; i < md.length; i += chunkSize) {
                await message.reply(md.slice(i, i + chunkSize));
            }
            return;
        }

        const pkgPath = path.join(__dirname, '../../../package.json');
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
        const msg = `CHANGELOG não encontrado. Versão atual: ${pkg.version}\nNovidades: Atualização MVP ${pkg.version} - consulte README para detalhes.`;
        await message.reply(msg);
    } catch (e) {
        await message.reply(`⚠️ Erro ao carregar changelog: ${e.message}`);
    }
}

module.exports = { handleChangelog };
