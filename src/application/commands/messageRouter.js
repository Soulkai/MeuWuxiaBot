require('dotenv').config();
const handleRegister = require('../handlers/registerHandler');
const handleProfile = require('../handlers/profileHandler');
const handleStatus = require('../handlers/statusHandler');       // <-- NOVO
const handleAtributos = require('../handlers/atributosHandler'); // <-- NOVO
const handleInventario = require('../handlers/inventarioHandler'); // <-- NOVO
const handleCultivation = require('../handlers/cultivateHandler'); // <-- NOVO
const techHandlers = require('../handlers/techniqueHandlers');
const handleRomper = require('../handlers/breakthroughHandler');
const expHandlers = require('../handlers/explorationHandler');
const profHandlers = require('../handlers/professionHandler');
const econHandlers = require('../handlers/economyHandler');
const socialHandlers = require('../handlers/socialHandler');
const sectHandlers = require('../handlers/sectHandler');
const combatHandlers = require('../handlers/combatHandler');
const beastHandlers = require('../handlers/beastHandler');
const territoryHandlers = require('../handlers/territoryHandler');
const auctionHandlers = require('../handlers/auctionHandler');
const sectWarHandlers = require('../handlers/sectWarHandler');
const puppetHandlers = require('../handlers/puppetHandler');
const formationHandlers = require('../handlers/formationHandler');
const techniqueCraftHandlers = require('../handlers/techniqueCraftHandler');
const companionHandlers = require('../handlers/companionHandler');
const eventHandlers = require('../handlers/eventHandler');
const linkHandlers = require('../handlers/linkHandler');
const menuHandlers = require('../handlers/menuHandler');
const changelogHandlers = require('../handlers/changelogHandler');


const PREFIX = process.env.BOT_PREFIX || '/';

const messageRouter = async (message) => {
    if (!message.body.startsWith(PREFIX)) return;

    const args = message.body.slice(PREFIX.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    // 🛠️ O SELO DE SEPARAÇÃO DE ALMAS (CORREÇÃO PARA GRUPOS) 🛠️
    // Tenta pegar o autor (se for grupo), ou o from (se for privado)
    let sender = message.author || message.from;
    
    // Purifica o ID removendo os sufixos do WhatsApp para guardar apenas os números
    sender = sender.replace('@c.us', '').replace('@s.whatsapp.net', '');

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
    }    else if (commandName === 'treinar') { 
        await handleCultivation(message, sender, commandName);
        console.log(`✅ [LOG] Técnica /treinar executada com sucesso.`);
    }
    else if (commandName === 'meditar') { 
        await handleCultivation(message, sender, commandName);
        console.log(`✅ [LOG] Técnica /meditar executada com sucesso.`);
    }
    else if (commandName === 'cultivar') { 
        await handleCultivation(message, sender, commandName);
        console.log(`✅ [LOG] Técnica /cultivar executada com sucesso.`);
    }    else if (commandName === 'livros') { await techHandlers.handleLivros(message, sender); }
    else if (commandName === 'tecnicas') { await techHandlers.handleTecnicas(message, sender); }
    else if (commandName === 'compreender') { await techHandlers.handleCompreender(message, args, sender); }
    else if (commandName === 'aprender') { await techHandlers.handleAprender(message, args, sender); }
    else if (commandName === 'equipartecnica') { await techHandlers.handleEquipar(message, args, sender); }
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
    else if (commandName === 'seita') { await sectHandlers.handleSeita(message, args, sender); }
    else if (commandName === 'atacar') { await combatHandlers.handleAtacar(message, args, sender); }
    else if (commandName === 'defender') { await combatHandlers.handleDefender(message, sender); }
    else if (commandName === 'esquivar') { await combatHandlers.handleEsquivar(message, sender); }
    else if (commandName === 'fugir') { await combatHandlers.handleFugir(message, sender); }
    else if (commandName === 'chefe') { await combatHandlers.handleChefe(message, args, sender); }
    else if (commandName === 'raid') { await combatHandlers.handleRaid(message, args, sender); }
    else if (commandName === 'besta' && args[0] === 'chocar') { await beastHandlers.handleBeastChocar(message, args.slice(1), sender); }
    else if (commandName === 'besta' && args[0] === 'treinar') { await beastHandlers.handleBeastTreinar(message, sender); }
    else if (commandName === 'besta' && args[0] === 'status') { await beastHandlers.handleBeastStatus(message, sender); }
    else if (commandName === 'territorio' && args[0] === 'investir') { await territoryHandlers.handleInvestirTerritorio(message, args.slice(1), sender); }
    else if (commandName === 'territorio' && args[0] === 'coletar') { await territoryHandlers.handleColetarTerritorio(message, args.slice(1), sender); }
    else if (commandName === 'territorio' && args[0] === 'listar') { await territoryHandlers.handleListarTerritorio(message, sender); }
    else if (commandName === 'leilao' && args[0] === 'criar') { await auctionHandlers.handleCriarLeilao(message, args.slice(1), sender); }
    else if (commandName === 'leilao' && args[0] === 'lance') { await auctionHandlers.handleLance(message, args.slice(1), sender); }
    else if (commandName === 'leilao' && args[0] === 'listar') { await auctionHandlers.handleListarLeiloes(message, sender); }
    else if (commandName === 'seita' && args[0] === 'guerra') { await sectWarHandlers.handleDeclararGuerra(message, args.slice(1), sender); }
    else if (commandName === 'seita' && args[0] === 'dominar') { await sectWarHandlers.handleDominarTerritorio(message, args.slice(1), sender); }
    else if (commandName === 'marionete' && args[0] === 'criar') { await puppetHandlers.handleCriarMarionete(message, args.slice(1), sender); }
    else if (commandName === 'marionete' && args[0] === 'ativar') { await puppetHandlers.handleAtivarMarionete(message, args.slice(1), sender); }
    else if (commandName === 'marionete' && args[0] === 'listar') { await puppetHandlers.handleListarMarionetes(message, sender); }
    else if (commandName === 'formacao' && args[0] === 'criar') { await formationHandlers.handleCriarFormacao(message, args.slice(1), sender); }
    else if (commandName === 'formacao' && args[0] === 'ativar') { await formationHandlers.handleAtivarFormacao(message, args.slice(1), sender); }
    else if (commandName === 'formacao' && args[0] === 'listar') { await formationHandlers.handleListarFormacoes(message, sender); }
    else if (commandName === 'tecnica_propria' && args[0] === 'criar') { await techniqueCraftHandlers.handleCriarTecnica(message, args.slice(1), sender); }
    else if (commandName === 'tecnica_propria' && args[0] === 'adicionar_efeito') { await techniqueCraftHandlers.handleAdicionarEfeito(message, args.slice(1), sender); }
    else if (commandName === 'tecnica_propria' && args[0] === 'listar') { await techniqueCraftHandlers.handleListarTecnicas(message, sender); }
    else if (commandName === 'casamento' && args[0] === 'propor') { await companionHandlers.handleProporCasamento(message, args.slice(1), sender); }
    else if (commandName === 'casamento' && args[0] === 'aceitar') { await companionHandlers.handleAceitarCasamento(message, args.slice(1), sender); }
    else if (commandName === 'dao_companion' && args[0] === 'ativar') { await companionHandlers.handleAtivarCompanheiro(message, args.slice(1), sender); }
    else if (commandName === 'evento' && args[0] === 'listar') { await eventHandlers.handleListarEventos(message, sender); }
    else if (commandName === 'evento' && args[0] === 'participar') { await eventHandlers.handleParticiparEvento(message, args.slice(1), sender); }
    else if (commandName === 'npc' && args[0] === 'interagir') { await eventHandlers.handleInteragirNPC(message, args.slice(1), sender); }
    else if (commandName === 'menu') { await menuHandlers.handleMenu(message, args, sender); }
    else if (commandName === 'changelog') { await changelogHandlers.handleChangelog(message, args, sender); }
    else if (commandName === 'getid') { await linkHandlers.handleGetId(message, args, sender); }
    else if (commandName === 'linkar') { await linkHandlers.handleLinkar(message, args, sender); }
    else {
        await message.reply('Mestre, esta técnica secreta ainda não foi compreendida pelo Sistema Celestial.');
        console.log(`⚠️ [LOG] Comando desconhecido invocado.`);
    }
};

module.exports = messageRouter;
