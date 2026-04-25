require('dotenv').config();
const handleRegister = require('../handlers/registerHandler');
const handleProfile = require('../handlers/profileHandler');
const handleStatus = require('../handlers/statusHandler');       // <-- NOVO
const handleAtributos = require('../handlers/atributosHandler'); // <-- NOVO
const handleInventario = require('../handlers/inventarioHandler'); // <-- NOVO
const techHandlers = require('../handlers/techniqueHandlers');
const handleRomper = require('../handlers/breakthroughHandler');
const expHandlers = require('../handlers/explorationHandler');
const profHandlers = require('../handlers/professionHandler');
const econHandlers = require('../handlers/economyHandler');
const socialHandlers = require('../handlers/socialHandler');


const PREFIX = process.env.BOT_PREFIX || '/';

const messageRouter = async (message) => {
    if (!message.body.startsWith(PREFIX)) return;

    const args = message.body.slice(PREFIX.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const sender = message.from;
    const pushname = message._data?.notifyName || 'Cultivador Anônimo';

    console.log(`\n📜 [LOG DE COMANDO]`);
    console.log(`👤 Cultivador: ${pushname} (${sender})`);
    console.log(`⚔️ Técnica utilizada: /${commandName}`);
    
    if (commandName === 'registrar') {
        await handleRegister(message, args, sender, pushname);
        console.log(`✅ [LOG] Técnica /registrar executada com sucesso.`);
    } 
    else if (commandName === 'perfil') {
        await handleProfile(message, sender);
        console.log(`✅ [LOG] Técnica /perfil executada com sucesso.`);
    }
    else if (commandName === 'status') { // <-- NOVO BLOCO
        await handleStatus(message, sender);
        console.log(`✅ [LOG] Técnica /status executada com sucesso.`);
    }
    else if (commandName === 'atributos') { // <-- NOVO BLOCO
        await handleAtributos(message, sender);
        console.log(`✅ [LOG] Técnica /atributos executada com sucesso.`);
    }
else if (commandName === 'inventario') { // <-- NOVO BLOCO
        await handleInventario(message, sender);
        console.log(`✅ [LOG] Técnica /inventario executada com sucesso.`);
    }
    else if (commandName === 'livros') { await techHandlers.handleLivros(message, sender); }
    else if (commandName === 'tecnicas') { await techHandlers.handleTecnicas(message, sender); }
    else if (commandName === 'compreender') { await techHandlers.handleCompreender(message, args, sender); }
    else if (commandName === 'aprender') { await techHandlers.handleAprender(message, args, sender); }
    else if (commandName === 'equipartecnica') { await techHandlers.handleEquipar(message, args, sender); }
    else if (commandName === 'equipartecnica') { 
        await techHandlers.handleEquipar(message, args, sender); 
    }
    else if (commandName === 'romper') { // <-- NOVO COMANDO DO SPRINT 3
        await handleRomper(message, args, sender);
        console.log(`✅ [LOG] Técnica /romper executada.`);
    }
    else if (commandName === 'area') { await expHandlers.handleArea(message, sender); }
    else if (commandName === 'lista' && args[0] === 'area') { await expHandlers.handleListaArea(message, sender); }
    else if (commandName === 'viajar') { await expHandlers.handleViajar(message, args, sender); }
    else if (commandName === 'explorar') { await expHandlers.handleExplorar(message, sender); }
else if (commandName === 'profissao' && args[0] === 'escolher') { 
    await profHandlers.handleEscolherProfissao(message, args.slice(1), sender); 
}
else if (commandName === 'refinar' || commandName === 'forjar') { 
    await profHandlers.handleRefinar(message, args, sender); 
}
else if (commandName === 'loja') { await econHandlers.handleLoja(message); }
else if (commandName === 'comprar') { await econHandlers.handleComprar(message, args, sender); }
    else if (commandName === 'vender') { await econHandlers.handleVender(message, args, sender); }
    else if (commandName === 'mercado') { await econHandlers.handleMercado(message, args, sender); }
        else if (commandName === 'conversar') { await socialHandlers.handleConversar(message, args, sender); }
    else if (commandName === 'transferir' || commandName === 'trocar') { await socialHandlers.handleTransferir(message, args, sender); }
    else {
        await message.reply('Mestre, esta técnica secreta ainda não foi compreendida pelo Sistema Celestial.');
        console.log(`⚠️ [LOG] Comando desconhecido invocado.`);
    }
};

module.exports = messageRouter;
