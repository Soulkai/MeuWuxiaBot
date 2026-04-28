const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

// Cria o cliente do bot e guarda a sessão localmente
const client = new Client({
    authStrategy: new LocalAuth({ dataPath: process.env.SESSION_DIR || './.wwebjs_auth' }),
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox'
        ]
    }
});

// Evento: Geração do QR Code seguro no terminal
client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
    console.log('🔮 O Destino nos chama de volta ao caminho antigo. Escaneie o QR Code acima com o seu WhatsApp!');
});

// Evento: Confirmação de que o bot está ligado
client.on('ready', () => {
    console.log('✅ A Conexão Mágica (via QR Code) foi estabelecida! O Bot Wuxia RPG está online e operante.');
});

// Evento: Tratamento de erros de autenticação
client.on('auth_failure', msg => {
    console.error('❌ Falha na autenticação do WhatsApp:', msg);
});

module.exports = client;
