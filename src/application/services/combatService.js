const db = require('../../infra/db/connection');

const query = (sql, params = []) => new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => err ? reject(err) : resolve(rows));
});
const run = (sql, params = []) => new Promise((resolve, reject) => {
    db.run(sql, params, function (err) { err ? reject(err) : resolve(this) });
});

/**
 * Sprint 9: Leis do Combate
 * Motor de combate em turnos para PvE e PvP
 * 
 * Responsabilidades:
 * - Iniciar combates
 * - Calcular dano (com regras de combate)
 * - Gerenciar estado de combate
 * - Resolver vitória/derrota
 * 
 * Referência: Seção 1305
 */

const combatRules = require('../../domain/rules/combatRules');
const combatRepo = require('../../infra/db/repositories/combatRepository');

async function initiateAttack(phoneNumber, targetName) {
    // 1. Carrega atacante
    const attackerRows = await query(
        `SELECT p.id, p.character_name, a.* FROM players p JOIN player_attributes a ON p.id = a.player_id WHERE p.phone_number = ?`,
        [phoneNumber]
    );
    if (attackerRows.length === 0) throw new Error('Seu personagem não foi encontrado. Use /registrar.');
    const attacker = attackerRows[0];

    // 2. Encontra o alvo pelo nome (busca parcial)
    const defenderRows = await query(
        `SELECT p.id, p.character_name, a.* FROM players p JOIN player_attributes a ON p.id = a.player_id WHERE LOWER(p.character_name) LIKE LOWER(?) LIMIT 1`,
        [`%${targetName}%`]
    );
    if (defenderRows.length === 0) {
        return { formattedResponse: `⚠️ Alvo "${targetName}" não encontrado entre os cultivadores.` };
    }
    const defender = defenderRows[0];

    if (attacker.id === defender.id) {
        return { formattedResponse: '⚠️ Você não pode atacar a si mesmo.' };
    }

    // 3. Verifica se já há combate ativo entre eles
    let combat = await combatRepo.getCombatByPlayer(attacker.id);
    if (combat && combat.player_ids.includes(defender.id)) {
        // Combate já existe, continua
    } else {
        // Cria novo combate PvP
        const initialState = {
            players: {
                [attacker.id]: { hp: attacker.hp_current, buffs: [] },
                [defender.id]: { hp: defender.hp_current, buffs: [] }
            },
            turn_order: [attacker.id, defender.id], // Alterna turnos
            current_player: attacker.id
        };
        const combatId = await combatRepo.createCombat('pvp', [attacker.id, defender.id], initialState);
        combat = await combatRepo.getCombatById(combatId);
    }

    // 4. Calcula chance de acerto
    const hitChance = combatRules.calculateHitChance(attacker, defender);
    const roll = Math.floor(Math.random() * 100) + 1;

    if (roll > hitChance) {
        // Registra log de erro
        await run(`INSERT INTO game_logs (service_name, event_type, action, player_id, target_player_id, source_context, command_text, status) VALUES ('combatService', 'attack', 'miss', ?, ?, 'whatsapp', '/atacar', 'success')`, [attacker.id, defender.id]);
        // Avança turno
        await combatRepo.advanceTurn(combat.id);
        return { formattedResponse: `💨 ${attacker.character_name} tentou atacar ${defender.character_name} mas errou! (Chance: ${hitChance}% | Rolou: ${roll})` };
    }

    // 5. Calcula dano e crítico
    let damage = combatRules.calculateDamage(attacker, defender, null);
    const critChance = combatRules.calculateCriticalChance(attacker);
    const critRoll = Math.floor(Math.random() * 100) + 1;
    let critical = false;
    if (critRoll <= critChance) {
        damage = Math.round(damage * 1.5);
        critical = true;
    }

    // 6. Multiplicador espiritual
    const spiritMult = combatRules.applySpiritualAttack(attacker, null);
    damage = Math.max(1, Math.round(damage * spiritMult));

    // 7. Aplica dano
    const defenderHpBefore = Number(defender.hp_current || 0);
    const newHp = Math.max(0, defenderHpBefore - damage);
    await run(`UPDATE player_attributes SET hp_current = ? WHERE player_id = ?`, [newHp, defender.id]);

    // 8. Atualiza estado do combate
    combat.state.players[defender.id].hp = newHp;
    await combatRepo.updateCombatState(combat.id, combat.state);

    // 9. Registra log do ataque
    await run(`INSERT INTO game_logs (service_name, event_type, action, player_id, target_player_id, source_context, command_text, payload_json, result_json, status) VALUES ('combatService', 'attack', 'hit', ?, ?, 'whatsapp', '/atacar', ?, ?, 'success')`, [attacker.id, defender.id, JSON.stringify({ damage, critical }), JSON.stringify({ hp_before: defenderHpBefore, hp_after: newHp })]);

    // 10. Avança turno
    await combatRepo.advanceTurn(combat.id);

    let resultText = `${attacker.character_name} atacou ${defender.character_name} e causou ${damage} de dano.`;
    if (critical) resultText = `💥 CRÍTICO! ${resultText}`;
    if (newHp <= 0) {
        resultText += `\n☠️ ${defender.character_name} foi derrotado!`;
        // Remove combate
        await combatRepo.deleteCombat(combat.id);
    }

    return { formattedResponse: `⚔️ ${resultText}` };
}

async function activateDefense(phoneNumber) {
    // 1. Carrega jogador
    const playerRows = await query(
        `SELECT p.id, p.character_name, a.* FROM players p JOIN player_attributes a ON p.id = a.player_id WHERE p.phone_number = ?`,
        [phoneNumber]
    );
    if (playerRows.length === 0) throw new Error('Seu personagem não foi encontrado. Use /registrar.');
    const player = playerRows[0];

    // 2. Verifica combate ativo
    const combat = await combatRepo.getCombatByPlayer(player.id);
    if (!combat) {
        return { formattedResponse: '⚠️ Você não está em combate ativo.' };
    }

    // 3. Calcula bônus de defesa baseado em constituição
    const defenseBonus = Math.floor(player.constitution * 0.2); // Redução de dano

    // 4. Adiciona buff ao estado
    if (!combat.state.players[player.id].buffs) combat.state.players[player.id].buffs = [];
    combat.state.players[player.id].buffs.push({
        type: 'defense',
        value: defenseBonus,
        duration: 1 // Próximo turno
    });
    await combatRepo.updateCombatState(combat.id, combat.state);

    // 5. Registra log
    await run(`INSERT INTO game_logs (service_name, event_type, action, player_id, source_context, command_text, payload_json, status) VALUES ('combatService', 'defense', 'activate', ?, 'whatsapp', '/defender', ?, 'success')`, [player.id, JSON.stringify({ defense_bonus: defenseBonus })]);

    return { formattedResponse: `🛡️ ${player.character_name} ativou defesa! Próximo dano recebido será reduzido em ${defenseBonus}.` };
}

async function activateDodge(phoneNumber) {
    // 1. Carrega jogador
    const playerRows = await query(
        `SELECT p.id, p.character_name, a.* FROM players p JOIN player_attributes a ON p.id = a.player_id WHERE p.phone_number = ?`,
        [phoneNumber]
    );
    if (playerRows.length === 0) throw new Error('Seu personagem não foi encontrado. Use /registrar.');
    const player = playerRows[0];

    // 2. Verifica combate ativo
    const combat = await combatRepo.getCombatByPlayer(player.id);
    if (!combat) {
        return { formattedResponse: '⚠️ Você não está em combate ativo.' };
    }

    // 3. Calcula bônus de esquiva baseado em agilidade
    const dodgeBonus = Math.floor(player.agility * 0.3); // Bônus temporário de esquiva

    // 4. Adiciona buff ao estado
    if (!combat.state.players[player.id].buffs) combat.state.players[player.id].buffs = [];
    combat.state.players[player.id].buffs.push({
        type: 'dodge',
        value: dodgeBonus,
        duration: 1 // Próximo turno
    });
    await combatRepo.updateCombatState(combat.id, combat.state);

    // 5. Registra log
    await run(`INSERT INTO game_logs (service_name, event_type, action, player_id, source_context, command_text, payload_json, status) VALUES ('combatService', 'dodge', 'activate', ?, 'whatsapp', '/esquivar', ?, 'success')`, [player.id, JSON.stringify({ dodge_bonus: dodgeBonus })]);

    return { formattedResponse: `💨 ${player.character_name} ativou esquiva! Chance de evitar ataques aumentada em ${dodgeBonus}%.` };
}

async function attemptFlee(phoneNumber) {
    // 1. Carrega jogador
    const playerRows = await query(
        `SELECT p.id, p.character_name, a.* FROM players p JOIN player_attributes a ON p.id = a.player_id WHERE p.phone_number = ?`,
        [phoneNumber]
    );
    if (playerRows.length === 0) throw new Error('Seu personagem não foi encontrado. Use /registrar.');
    const player = playerRows[0];

    // 2. Verifica combate ativo
    const combat = await combatRepo.getCombatByPlayer(player.id);
    if (!combat) {
        return { formattedResponse: '⚠️ Você não está em combate ativo.' };
    }

    // 3. Calcula chance de fuga baseada em agilidade vs nível (simplificado)
    const fleeChance = Math.min(80, Math.max(10, player.agility - (player.level * 2))); // Chance base
    const roll = Math.floor(Math.random() * 100) + 1;

    let success = false;
    if (roll <= fleeChance) {
        success = true;
        // Remove combate
        await combatRepo.deleteCombat(combat.id);
    }

    // 4. Registra log
    await run(`INSERT INTO game_logs (service_name, event_type, action, player_id, source_context, command_text, payload_json, result_json, status) VALUES ('combatService', 'flee', 'attempt', ?, 'whatsapp', '/fugir', ?, ?, 'success')`, [player.id, JSON.stringify({ flee_chance: fleeChance, roll }), JSON.stringify({ success })]);

    if (success) {
        return { formattedResponse: `🏃 ${player.character_name} conseguiu fugir do combate! (Chance: ${fleeChance}% | Rolou: ${roll})` };
    } else {
        return { formattedResponse: `❌ ${player.character_name} tentou fugir mas falhou! (Chance: ${fleeChance}% | Rolou: ${roll})` };
    }
}

async function initiateBossFight(phoneNumber, bossName) {
    // 1. Carrega jogador
    const playerRows = await query(
        `SELECT p.id, p.character_name, a.* FROM players p JOIN player_attributes a ON p.id = a.player_id WHERE p.phone_number = ?`,
        [phoneNumber]
    );
    if (playerRows.length === 0) throw new Error('Seu personagem não foi encontrado. Use /registrar.');
    const player = playerRows[0];

    // 2. Busca chefe na tabela de beasts (assumindo que bosses são beasts especiais)
    const bossRows = await query(
        `SELECT * FROM beasts WHERE LOWER(name) LIKE LOWER(?) AND type = 'boss' LIMIT 1`,
        [`%${bossName}%`]
    );
    if (bossRows.length === 0) {
        return { formattedResponse: `⚠️ Chefe "${bossName}" não encontrado.` };
    }
    const boss = bossRows[0];

    // 3. Inicia combate PvE contra o chefe
    // TODO: Implementar estado de combate PvE
    await run(`INSERT INTO game_logs (service_name, event_type, action, player_id, source_context, command_text, payload_json, status) VALUES ('combatService', 'boss_fight', 'initiate', ?, 'whatsapp', '/chefe', ?, 'success')`, [player.id, JSON.stringify({ boss_id: boss.id, boss_name: boss.name })]);

    return { formattedResponse: `👹 ${player.character_name} iniciou combate contra o chefe ${boss.name}! Prepare-se para a batalha.` };
}

async function joinRaid(phoneNumber, raidId) {
    // 1. Carrega jogador
    const playerRows = await query(
        `SELECT p.id, p.character_name FROM players p WHERE p.phone_number = ?`,
        [phoneNumber]
    );
    if (playerRows.length === 0) throw new Error('Seu personagem não foi encontrado. Use /registrar.');
    const player = playerRows[0];

    // 2. Verifica se raid existe (placeholder - sem tabela ainda)
    // TODO: Implementar tabela de raids ativos
    const raidExists = true; // Simulação
    if (!raidExists) {
        return { formattedResponse: `⚠️ Raid "${raidId}" não encontrado ou já encerrado.` };
    }

    // 3. Entra no raid
    await run(`INSERT INTO game_logs (service_name, event_type, action, player_id, source_context, command_text, payload_json, status) VALUES ('combatService', 'raid', 'join', ?, 'whatsapp', '/raid', ?, 'success')`, [player.id, JSON.stringify({ raid_id: raidId })]);

    return { formattedResponse: `⚔️ ${player.character_name} entrou no raid ${raidId}! Boa sorte na batalha.` };
}

module.exports = { 
    initiateAttack, 
    activateDefense, 
    activateDodge, 
    attemptFlee,
    initiateBossFight,
    joinRaid
};
