const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

// Cria o cliente do bot e guarda a sessão localmente
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        executablePath: '/data/data/com.termux/files/usr/bin/chromium-browser',
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--single-process', // O selo de proteção vital contra o bloqueio do Android
            '--disable-gpu'
        ]
    }
    // Removemos a Máscara de Ilusão (User-Agent) para não interferir na geração limpa do QR Code
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
