/**
 * Auction Fallback Payment Test - MVP 1.1.0
 * Testa a resolução de leilão com fallback de pagamento
 * 
 * Cenário: Comprador 1 faz lance maior mas sem fundos, Comprador 2 faz lance menor mas tem fundos
 * Esperado: Sistema tenta Comprador 1 (falha), depois tenta Comprador 2 (sucesso)
 * 
 * Para executar: node test/auctionFallback.test.js
 */

const db = require('../src/infra/db/connection');
const auctionRepo = require('../src/infra/db/repositories/auctionRepository');

const query = (sql, params = []) => new Promise((res, rej) => {
    db.all(sql, params, (err, rows) => err ? rej(err) : res(rows || []));
});

const run = (sql, params = []) => new Promise((res, rej) => {
    db.run(sql, params, function (err) { if (err) rej(err); else res(this); });
});

async function setupTestData() {
    console.log('[SETUP] Preparando dados de teste...\n');

    const timestamp = Date.now();

    // 1. Inserir dados de referência
    await run(`INSERT OR IGNORE INTO races (id, code, name, tier, effects_json) VALUES (1, 'human', 'Human', 'Comum', '{}')`, []);
    await run(`INSERT OR IGNORE INTO clans (id, code, name, tier, effects_json) VALUES (1, 'test_clan', 'Test', 'Comum', '{}')`, []);
    await run(`INSERT OR IGNORE INTO regions (id, code, name, danger_level, min_realm_index, max_realm_index, event_table_json) VALUES (1, 'test', 'Test', 1, 1, 10, '{}')`, []);

    // 2. Criar jogadores com nomes únicos
    const vendor = await run(`INSERT INTO players (phone_number, character_name, sex, race_id, clan_id, talent_tier, luck_tier, region_id) 
                             VALUES (?, ?, ?, 1, 1, 'comum', 'média', 1)`, 
                            [`vendor_${timestamp}`, `Vendor_${timestamp}`, 'M']);
    
    const buyer1 = await run(`INSERT INTO players (phone_number, character_name, sex, race_id, clan_id, talent_tier, luck_tier, region_id) 
                             VALUES (?, ?, ?, 1, 1, 'comum', 'média', 1)`, 
                            [`buyer1_${timestamp}`, `Buyer1_${timestamp}`, 'F']);
    
    const buyer2 = await run(`INSERT INTO players (phone_number, character_name, sex, race_id, clan_id, talent_tier, luck_tier, region_id) 
                             VALUES (?, ?, ?, 1, 1, 'comum', 'média', 1)`, 
                            [`buyer2_${timestamp}`, `Buyer2_${timestamp}`, 'M']);

    const vendorId = vendor.lastID;
    const buyerId1 = buyer1.lastID;
    const buyerId2 = buyer2.lastID;

    console.log(`[SETUP] ✅ Jogadores criados: V=${vendorId}, B1=${buyerId1}, B2=${buyerId2}\n`);

    // 3. Criar item e interface
    const item = await run(`INSERT INTO items (code, name, rarity, item_type, base_value) 
                          VALUES (?, ?, ?, ?, ?)`, 
                         [`sword_test_${timestamp}`, 'Espada de Teste', 'raro', 'weapon', 300]);
    
    const itemInstance = await run(`INSERT INTO item_instances (item_id, origin_type) 
                                   VALUES (?, ?)`, 
                                  [item.lastID, 'test']);

    console.log(`[SETUP] ✅ Item criado: ID=${item.lastID}, Instance=${itemInstance.lastID}\n`);

    // 4. Criar leilão
    const auction = await run(`INSERT INTO auction_listings (seller_player_id, item_id, item_instance_id, quantity, min_bid_amount, currency, status, starts_at, ends_at) 
                             VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now', '+1 day'))`, 
                            [vendorId, item.lastID, itemInstance.lastID, 1, 200, 'spirit_stones', 'active']);

    console.log(`[SETUP] ✅ Leilão criado: ID=${auction.lastID}\n`);

    // 5. Criar wallets
    await run(`INSERT INTO wallet_balances (player_id, spirit_stones) VALUES (?, ?)`, [vendorId, 0]);
    await run(`INSERT INTO wallet_balances (player_id, spirit_stones) VALUES (?, ?)`, [buyerId1, 100]); // Insuficiente para 300
    await run(`INSERT INTO wallet_balances (player_id, spirit_stones) VALUES (?, ?)`, [buyerId2, 500]); // Suficiente para 300

    console.log(`[SETUP] ✅ Wallets criados\n`);
    console.log(`[SETUP] Saldos: V=${0}, B1=${100}, B2=${500}\n`);

    return {
        vendorId,
        buyerId1,
        buyerId2,
        itemId: item.lastID,
        auctionId: auction.lastID
    };
}

async function testAuctionFallback() {
    console.log('\n======================================');
    console.log('    TESTE DE FALLBACK DE LEILÃO');
    console.log('======================================\n');

    try {
        data = await setupTestData();
    } catch (err) {
        console.error('[SETUP-ERR] Falha em setupTestData:', err.message);
        console.error(err.stack);
        throw err;
    }
    
    const { vendorId, buyerId1, buyerId2, auctionId } = data;

    try {
        // 1. Comprador 2 faz lance de 250 (menor, mas com fundos)
        console.log('[TEST-1] Comprador 2 fazendo lance de 250 spirit_stones...');
        await auctionRepo.saveBidWithLock(auctionId, { player_id: buyerId2, amount: 250 });
        console.log('[TEST-1] ✅ Lance registrado\n');

        // 2. Comprador 1 faz lance de 400 (maior, mas sem fundos)
        console.log('[TEST-2] Comprador 1 fazendo lance de 400 spirit_stones...');
        await auctionRepo.saveBidWithLock(auctionId, { player_id: buyerId1, amount: 400 });
        console.log('[TEST-2] ✅ Lance registrado\n');

        // 3. Verificar lances ordenados
        console.log('[TEST-3] Verificando lances ordenados (DESC)...');
        const bidsOrdered = await auctionRepo.getAvailableBidsOrdered(auctionId, 'auction_listings');
        console.log(`[TEST-3] ${bidsOrdered.length} lances encontrados:`);
        bidsOrdered.forEach((b, i) => {
            console.log(`[TEST-3]   ${i + 1}. Jogador #${b.player_id}: ${b.amount} spirit_stones`);
        });
        console.log();

        // 4. RESOLVER LEILÃO (teste do fallback)
        console.log('[TEST-4] 🔄 RESOLVENDO LEILÃO (teste de fallback)...\n');
        console.log('[TEST-4] Esperado: Sistema tenta Comprador1 (falha) → Comprador2 (sucesso)\n');
        
        const result = await auctionRepo.resolveAuction(auctionId);
        
        if (!result.success) {
            throw new Error(`❌ Falha na resolução: ${result.error}`);
        }

        console.log(`[TEST-4] ✅ Leilão resolvido com sucesso!\n`);
        console.log(`[TEST-4] Resultado:`);
        console.log(`[TEST-4]   - Vencedor: Comprador #${result.winner}`);
        console.log(`[TEST-4]   - Valor pago: ${result.amount} spirit_stones`);
        console.log(`[TEST-4]   - Status: ${result.success}\n`);

        // 5. Verificar se fallback funcionou (Comprador 2 deve ter vencido)
        if (result.winner !== buyerId2) {
            throw new Error(`❌ Fallback FALHOU! Esperado ${buyerId2}, obteve ${result.winner}`);
        }
        console.log(`[TEST-4] ✅ FALLBACK FUNCIONOU: Comprador 2 foi escolhido no lugar de Comprador 1\n`);

        // 6. Verificar saldos finais
        console.log('[TEST-5] Verificando saldos finais...\n');
        
        const vendorWallet = await query(`SELECT spirit_stones FROM wallet_balances WHERE player_id = ?`, [vendorId]);
        const buyer1Wallet = await query(`SELECT spirit_stones FROM wallet_balances WHERE player_id = ?`, [buyerId1]);
        const buyer2Wallet = await query(`SELECT spirit_stones FROM wallet_balances WHERE player_id = ?`, [buyerId2]);

        const vendorFinal = vendorWallet[0]?.spirit_stones || 0;
        const buyer1Final = buyer1Wallet[0]?.spirit_stones || 0;
        const buyer2Final = buyer2Wallet[0]?.spirit_stones || 0;

        console.log(`[TEST-5] Vendedor: 0 → ${vendorFinal} spirit_stones (ganhou ${result.amount})`);
        console.log(`[TEST-5] Comprador 1: 100 → ${buyer1Final} spirit_stones (sem mudança)`);
        console.log(`[TEST-5] Comprador 2: 500 → ${buyer2Final} spirit_stones (pagou ${result.amount})\n`);

        // 7. Verificar logs
        console.log('[TEST-6] Verificando logs de transações...\n');
        const logs = await query(`SELECT * FROM game_logs WHERE source_context = 'system' AND event_type LIKE '%resolve%' ORDER BY created_at DESC LIMIT 3`);
        console.log(`[TEST-6] ${logs.length} eventos encontrados\n`);

        console.log('\n======================================');
        console.log('    ✅ TESTE COMPLETADO COM SUCESSO!');
        console.log('======================================\n');
        return true;

    } catch (err) {
        console.error('\n❌ ERRO NO TESTE:\n', err.message, '\n');
        console.error('Stack:', err.stack);
        throw err;
    }
}

// Executar teste
if (require.main === module) {
    testAuctionFallback()
        .then(() => {
            console.log('[FINISH] Teste encerrado.');
            db.close();
            process.exit(0);
        })
        .catch(err => {
            console.error('[FINISH] Teste falhou com erro.');
            db.close();
            process.exit(1);
        });
}

module.exports = { setupTestData, testAuctionFallback };
