/**
 * Auction Flow End-to-End Test - MVP 1.1.0
 * Simula um fluxo completo de leilão: criação, lances, resolução, notificações
 * 
 * Para executar: node test/auctionFlow.test.js
 */

const db = require('../src/infra/db/connection');
const auctionService = require('../src/application/services/auctionService');
const auctionRepo = require('../src/infra/db/repositories/auctionRepository');
const auctionNotif = require('../src/application/services/auctionNotificationService');

// Helpers para simular dados
const query = (sql, params = []) => new Promise((res, rej) => {
    db.all(sql, params, (err, rows) => err ? rej(err) : res(rows || []));
});
const run = (sql, params = []) => new Promise((res, rej) => {
    db.run(sql, params, function (err) { if (err) rej(err); else res(this); });
});

async function setupTestData() {
    console.log('\n[TEST] Configurando dados de teste...');
    try {
        // Insere dados de referência necessários
        await run(`INSERT OR IGNORE INTO races (id, code, name, tier, effects_json) VALUES (1, 'human', 'Human', 'Comum', '{}')`, []);
        await run(`INSERT OR IGNORE INTO clans (id, code, name, tier, effects_json) VALUES (1, 'test_clan', 'Test Clan', 'Comum', '{}')`, []);
        await run(`INSERT OR IGNORE INTO regions (id, code, name, danger_level, min_realm_index, max_realm_index, event_table_json) VALUES (1, 'test_region', 'Test Region', 1, 1, 10, '{}')`, []);

        // Cria jogadores simples
        await run(`INSERT OR IGNORE INTO players (phone_number, character_name, sex, race_id, clan_id, talent_tier, luck_tier, region_id) 
                  VALUES (?, ?, ?, 1, 1, 'comum', 'média', 1)`, ['+5511999999999', 'Vendedor_Teste', 'M']);
        await run(`INSERT OR IGNORE INTO players (phone_number, character_name, sex, race_id, clan_id, talent_tier, luck_tier, region_id) 
                  VALUES (?, ?, ?, 1, 1, 'comum', 'média', 1)`, ['+5511888888888', 'Comprador_1_Teste', 'F']);
        await run(`INSERT OR IGNORE INTO players (phone_number, character_name, sex, race_id, clan_id, talent_tier, luck_tier, region_id) 
                  VALUES (?, ?, ?, 1, 1, 'comum', 'média', 1)`, ['+5511777777777', 'Comprador_2_Teste', 'M']);

        // Obtém IDs
        const vendors = await query(`SELECT id FROM players WHERE phone_number = ?`, ['+5511999999999']);
        const buyers = await query(`SELECT id FROM players WHERE phone_number = ?`, ['+5511888888888']);
        const fallback = await query(`SELECT id FROM players WHERE phone_number = ?`, ['+5511777777777']);

        if (!vendors[0] || !buyers[0] || !fallback[0]) throw new Error('Falha ao criar jogadores de teste');

        const vendorId = vendors[0].id;
        const buyerId = buyers[0].id;
        const fallbackId = fallback[0].id;

        // Cria atributos para vendedor
        await run(`INSERT OR IGNORE INTO player_attributes (player_id, strength, agility, constitution, intelligence, perception, spirit, comprehension, luck, charisma, willpower, hp_current, hp_max, qi_current, qi_max, body_energy_current, body_energy_max, soul_current, soul_max) 
                  VALUES (?, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 100, 100, 100, 100, 100, 100, 100, 100)`, [vendorId]);
        await run(`INSERT OR IGNORE INTO player_attributes (player_id, strength, agility, constitution, intelligence, perception, spirit, comprehension, luck, charisma, willpower, hp_current, hp_max, qi_current, qi_max, body_energy_current, body_energy_max, soul_current, soul_max) 
                  VALUES (?, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 100, 100, 100, 100, 100, 100, 100, 100)`, [buyerId]);
        await run(`INSERT OR IGNORE INTO player_attributes (player_id, strength, agility, constitution, intelligence, perception, spirit, comprehension, luck, charisma, willpower, hp_current, hp_max, qi_current, qi_max, body_energy_current, body_energy_max, soul_current, soul_max) 
                  VALUES (?, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 100, 100, 100, 100, 100, 100, 100, 100)`, [fallbackId]);

        // Cria carteiras
        await run(`INSERT OR IGNORE INTO wallet_balances (player_id, gold, spirit_stones, celestial_crystals, merit, destiny_points) 
                  VALUES (?, 1000, 500, 0, 0, 0)`, [vendorId]);
        await run(`INSERT OR IGNORE INTO wallet_balances (player_id, gold, spirit_stones, celestial_crystals, merit, destiny_points) 
                  VALUES (?, 1000, 200, 0, 0, 0)`, [buyerId]);  // Fundos limitados para testar fallback
        await run(`INSERT OR IGNORE INTO wallet_balances (player_id, gold, spirit_stones, celestial_crystals, merit, destiny_points) 
                  VALUES (?, 1000, 1000, 0, 0, 0)`, [fallbackId]); // Fundos abundantes

        // Cria item para teste
        await run(`INSERT OR IGNORE INTO items (code, name, item_type, rarity, base_value) 
                  VALUES (?, 'Espada Celestial de Teste', 'weapon', 'raro', 500)`, ['TEST_SWORD_001']);

        const items = await query(`SELECT id FROM items WHERE code = ?`, ['TEST_SWORD_001']);
        const itemId = items[0].id;

        // Cria item instance
        const newInst = await run(`INSERT INTO item_instances (item_id, origin_type) VALUES (?, 'test')`, [itemId]);
        const instanceId = newInst.lastID;

        // Adiciona item ao inventário do vendedor
        await run(`INSERT INTO player_inventory (player_id, item_instance_id, quantity) VALUES (?, ?, 1)`, [vendorId, instanceId]);

        console.log('[TEST] ✅ Dados de teste criados com sucesso');
        return { vendorId, buyerId, fallbackId, itemId, instanceId };
    } catch (e) {
        console.error('[TEST] ❌ Erro ao criar dados:', e.message);
        throw e;
    }
}

async function testAuctionFlow() {
    console.log('\n[TEST] Iniciando teste de fluxo de leilão...');
    
    try {
        // Obtém dados
        const testData = await setupTestData();
        const { vendorId, buyerId, fallbackId, itemId, instanceId } = testData;

        // 1. Criar leilão
        console.log('\n[TEST] 1️⃣  Criando leilão...');
        const createResult = await auctionService.createAuction('+5511999999999', itemId, 300, 24);
        console.log('[TEST]', createResult.formattedResponse);

        // 2. Obter ID do leilão
        const auctions = await query(`SELECT id FROM auction_listings WHERE seller_player_id = ? ORDER BY id DESC LIMIT 1`, [vendorId]);
        if (!auctions[0]) throw new Error('Leilão não foi criado');
        const auctionId = auctions[0].id;
        console.log(`[TEST] ✅ Leilão criado com ID: ${auctionId}`);

        // 3. Fazer lance baixo (do comprador 1 com fundos limitados)
        console.log('\n[TEST] 2️⃣  Comprador 1 fazendo lance de 250...');
        const bid1 = await auctionService.placeBid('+5511888888888', auctionId, 250);
        console.log('[TEST]', bid1.formattedResponse);

        // 4. Fazer lance do fallback (maior lance)
        console.log('\n[TEST] 3️⃣  Comprador 2 (fallback) fazendo lance de 400...');
        const bid2 = await auctionService.placeBid('+5511777777777', auctionId, 400);
        console.log('[TEST]', bid2.formattedResponse);

        // 5. Obter lances ordenados
        console.log('\n[TEST] 4️⃣  Verificando lances ordenados...');
        const bids = await auctionRepo.getAvailableBidsOrdered(auctionId, 'auction_listings');
        console.log('[TEST] Lances encontrados:', bids.length);
        bids.forEach((b, i) => {
            console.log(`[TEST]  ${i + 1}. Jogador ${b.player_id}: ${b.amount} espíritos`);
        });

        // 6. Resolver leilão (testa fallback: comprador 1 falha, fallback vence)
        console.log('\n[TEST] 5️⃣  Resolvendo leilão...');
        const resolve = await auctionRepo.resolveAuction(auctionId);
        if (resolve.success) {
            console.log(`[TEST] ✅ Leilão resolvido - Vencedor: Jogador ${resolve.winner}, Valor: ${resolve.amount}`);
        } else {
            console.log(`[TEST] ❌ Falha na resolução:`, resolve.error);
        }

        // 7. Notificar
        console.log('\n[TEST] 6️⃣  Enviando notificações...');
        if (resolve.winner) {
            const notif = await auctionNotif.notifyAuctionResolved(
                auctionId,
                resolve.winner,
                vendorId,
                resolve.amount,
                'Espada Celestial de Teste',
                'completed'
            );
            console.log('[TEST] ✅ Notificações enviadas');
        }

        // 8. Verificar balances finais
        console.log('\n[TEST] 7️⃣  Verificando saldos finais...');
        const vendorWallet = await query(`SELECT spirit_stones FROM wallet_balances WHERE player_id = ?`, [vendorId]);
        const buyerWallet = await query(`SELECT spirit_stones FROM wallet_balances WHERE player_id = ?`, [buyerId]);
        const fallbackWallet = await query(`SELECT spirit_stones FROM wallet_balances WHERE player_id = ?`, [fallbackId]);

        console.log('[TEST] Vendedor:', vendorWallet[0]?.spirit_stones || 0, 'espíritos');
        console.log('[TEST] Comprador 1:', buyerWallet[0]?.spirit_stones || 0, 'espíritos');
        console.log('[TEST] Comprador 2 (vencedor):', fallbackWallet[0]?.spirit_stones || 0, 'espíritos');

        // 9. Verificar transações registradas
        console.log('\n[TEST] 8️⃣  Verificando transações...');
        const transactions = await query(`SELECT * FROM transactions WHERE reference_id = ?`, [auctionId]);
        console.log(`[TEST] Transações registradas: ${transactions.length}`);
        transactions.forEach(t => {
            console.log(`[TEST]  - ${t.transaction_type}: ${t.amount} ${t.currency} (Jogador ${t.player_id})`);
        });

        console.log('\n[TEST] 🎉 Teste de fluxo de leilão concluído com sucesso!');
        return true;
    } catch (e) {
        console.error('\n[TEST] ❌ Erro durante teste:', e.message);
        throw e;
    } finally {
        db.close();
    }
}

// Executa teste
if (require.main === module) {
    testAuctionFlow().then(() => {
        console.log('\n[TEST] Teste finalizado.');
        process.exit(0);
    }).catch(err => {
        console.error('\n[TEST] Teste falhou:', err);
        process.exit(1);
    });
}

module.exports = { testAuctionFlow, setupTestData };