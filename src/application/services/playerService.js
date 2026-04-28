const db = require('../../infra/db/connection');
const rarityRules = require('../../domain/rules/rarityRules');

// Função auxiliar para rodar queries do SQLite como Promises (Evita Callback Hell)
const query = (sql, params = []) => new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => err ? reject(err) : resolve(rows));
});
const run = (sql, params = []) => new Promise((resolve, reject) => {
    db.run(sql, params, function (err) { err ? reject(err) : resolve(this) });
});

async function registerPlayer(phoneNumber, pushName, characterName, sex) {
    try {
        // 1. Verifica se já existe (Regra do MVP: Telefone único)
        const existing = await query(`SELECT id FROM players WHERE phone_number = ? OR character_name = ?`, [phoneNumber, characterName]);
        if (existing.length > 0) throw new Error('Este telefone ou nome já está trilhando o Caminho do Cultivo.');

        // 2. Sorteios do Destino
        const raceCode = rarityRules.rollRace();
        const clanTier = rarityRules.rollClanTier();
        const rootTier = rarityRules.rollRootTier();
        const bodyTier = rarityRules.rollBodyTier();
        const talent = rarityRules.rollTalent();
        const luck = rarityRules.rollLuck();

        // 3. Buscando os IDs no Banco de Dados
        const raceDB = await query(`SELECT id, name FROM races WHERE code = ?`, [raceCode]);
        if (raceDB.length === 0) throw new Error(`Raça ${raceCode} não encontrada nas sementes do mundo.`);
        
        // Pega todos os clãs do Tier sorteado e escolhe um aleatório
        const clansDB = await query(`SELECT id, name FROM clans WHERE tier = ?`, [clanTier]);
        const clan = clansDB[Math.floor(Math.random() * clansDB.length)];

        // Raiz Espiritual (pode ser "Nenhuma")
        let root = { id: null, name: 'Nenhuma' };
        if (rootTier !== 'Nenhuma') {
            const rootsDB = await query(`SELECT id, name FROM spiritual_roots WHERE tier = ?`, [rootTier]);
            if (rootsDB.length > 0) root = rootsDB[Math.floor(Math.random() * rootsDB.length)];
        }

        // Corpo Divino (pode ser "Nenhum")
        let body = { id: null, name: 'Nenhum' };
        if (bodyTier !== 'Nenhum') {
            const bodiesDB = await query(`SELECT id, name FROM divine_bodies WHERE tier = ?`, [bodyTier]);
            if (bodiesDB.length > 0) body = bodiesDB[Math.floor(Math.random() * bodiesDB.length)];
        }

        // Região Inicial Padrão: Vila Mortal (ID 1)
        // Região Inicial Padrão: Busca dinamicamente a área mais segura do mundo
const initialRegion = await query(`SELECT id FROM regions ORDER BY danger_level ASC LIMIT 1`);
if (initialRegion.length === 0) throw new Error('Os Céus e a Terra estão vazios! Execute o script de expansão do mundo para gerar as regiões.');
const regionId = initialRegion[0].id;

        // 4. Inserção no Banco de Dados (Transação Simulada)
        await run(`BEGIN TRANSACTION`);

        const insertPlayerResult = await run(
            `INSERT INTO players (phone_number, display_name, character_name, sex, age, race_id, clan_id, talent_tier, spiritual_root_id, divine_body_id, luck_tier, region_id) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [phoneNumber, pushName, characterName, sex, 16, raceDB[0].id, clan.id, talent, root.id, body.id, luck, regionId]
        );
        const playerId = insertPlayerResult.lastID;

        // Atributos base iniciais
        await run(
            `INSERT INTO player_attributes (player_id, strength, agility, constitution, intelligence, perception, spirit, comprehension, luck, charisma, willpower, hp_current, hp_max, qi_current, qi_max, body_energy_current, body_energy_max, soul_current, soul_max)
             VALUES (?, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 100, 100, 50, 50, 100, 100, 20, 20)`,
            [playerId]
        );

        // Trilhas de Cultivo Iniciais (Corpo, Espírito, Alma)
        await run(`INSERT INTO player_cultivation (player_id, path_type) VALUES (?, 'corpo'), (?, 'espirito'), (?, 'alma')`, [playerId, playerId, playerId]);

        // Carteira de Moedas Iniciais
        await run(`INSERT INTO wallet_balances (player_id, gold) VALUES (?, 100)`, [playerId]);

        // Registro de LOG
        await run(
            `INSERT INTO game_logs (service_name, event_type, action, player_id, source_context, command_text) VALUES ('playerService', 'player_register', 'create', ?, 'whatsapp', '/registrar')`,
            [playerId]
        );

        await run(`COMMIT`);

        // 5. Retorna o resultado para o jogador
        return {
            name: characterName,
            race: raceDB[0].name,
            clan: clan.name,
            talent: talent,
            root: root.name,
            body: body.name
        };

    } catch (error) {
        // Tenta cancelar a transação, engolindo o erro caso a transação nunca tenha sido iniciada
        try {
            await run(`ROLLBACK`);
        } catch (rollbackError) {
            // Transação não iniciada, a ilusão é ignorada silenciosamente
        }
        
        // Dispara o ERRO VERDADEIRO para ser capturado e enviado ao WhatsApp
        throw error;
    }
}

// Busca o perfil completo do cultivador
async function getPlayerProfile(phoneNumber) {
    // Busca os dados base do jogador e faz o join (junção) com as tabelas de origem
    const playerQuery = `
        SELECT 
            p.id, p.character_name, p.talent_tier, p.reputation, p.status,
            r.name as race_name, 
            c.name as clan_name,
            sr.name as root_name,
            db.name as body_name
        FROM players p
        LEFT JOIN races r ON p.race_id = r.id
        LEFT JOIN clans c ON p.clan_id = c.id
        LEFT JOIN spiritual_roots sr ON p.spiritual_root_id = sr.id
        LEFT JOIN divine_bodies db ON p.divine_body_id = db.id
        WHERE p.phone_number = ?
    `;
    
    const playerResult = await query(playerQuery, [phoneNumber]);
    
    if (playerResult.length === 0) {
        throw new Error('Você ainda não iniciou seu Caminho do Cultivo. Use /registrar primeiro.');
    }

    const player = playerResult[0];

    // Busca o nível de cultivo nas 3 trilhas
    const cultivationQuery = `SELECT path_type, realm_index, sublevel FROM player_cultivation WHERE player_id = ?`;
    const cultivationPaths = await query(cultivationQuery, [player.id]);

    // Busca as moedas do jogador
    const walletQuery = `SELECT gold, spirit_stones FROM wallet_balances WHERE player_id = ?`;
    const wallet = await query(walletQuery, [player.id]);

    return {
        player,
        cultivationPaths,
        wallet: wallet[0]
    };
}

// Busca os atributos e status do cultivador
async function getPlayerStats(phoneNumber) {
    const querySql = `
        SELECT p.character_name, a.*
        FROM players p
        JOIN player_attributes a ON p.id = a.player_id
        WHERE p.phone_number = ?
    `;
    
    const result = await query(querySql, [phoneNumber]);
    
    if (result.length === 0) {
        throw new Error('Você ainda não iniciou seu Caminho do Cultivo. Use /registrar primeiro.');
    }

    return result[0];
}

// Busca os itens guardados no anel espacial do cultivador
async function getPlayerInventory(phoneNumber) {
    // Busca os dados base do jogador
    const playerQuery = `SELECT id, character_name FROM players WHERE phone_number = ?`;
    const playerResult = await query(playerQuery, [phoneNumber]);
    
    if (playerResult.length === 0) {
        throw new Error('Você ainda não iniciou seu Caminho do Cultivo. Use /registrar primeiro.');
    }
    const player = playerResult[0];

    // Busca as moedas do jogador
    const walletQuery = `SELECT gold, spirit_stones, celestial_crystals FROM wallet_balances WHERE player_id = ?`;
    const walletResult = await query(walletQuery, [player.id]);

    // Busca os itens armazenados fazendo a ponte entre inventário, instâncias e o item base
    const inventoryQuery = `
        SELECT i.name, i.rarity, pi.quantity, ii.quality_tier 
        FROM player_inventory pi
        JOIN item_instances ii ON pi.item_instance_id = ii.id
        JOIN items i ON ii.item_id = i.id
        WHERE pi.player_id = ?
    `;
    const itemsResult = await query(inventoryQuery, [player.id]);

    return {
        player,
        wallet: walletResult[0],
        items: itemsResult
    };
}

module.exports = { registerPlayer, getPlayerProfile, getPlayerStats, getPlayerInventory };


