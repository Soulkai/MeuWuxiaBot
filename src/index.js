require('dotenv').config();

// Invoca os pergaminhos e sistemas que forjamos anteriormente
const db = require('./infra/db/connection'); 
const client = require('./transport/whatsapp/client');
const messageRouter = require('./application/commands/messageRouter');

// Conecta o Guardião do Portão (Roteador) para escutar todas as mensagens que chegam
client.on('message', async (message) => {
    try {
        await messageRouter(message);
    } catch (error) {
        console.error('❌ [LOG DE ERRO] Falha ao processar a técnica:', error);
    }
});

// Inicia o despertar do Bot
console.log(`🌌 O Ritual de Iniciação começou. Despertando o Sistema ${process.env.APP_NAME || 'Wuxia RPG'}...`);
client.initialize();
