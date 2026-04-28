const db = require('../../infra/db/connection');

const query = (sql, params = []) => new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => err ? reject(err) : resolve(rows));
});
const run = (sql, params = []) => new Promise((resolve, reject) => {
    db.run(sql, params, function (err) { err ? reject(err) : resolve(this) });
});

async function getShopItems() {
    const sql = `
        SELECT si.id, i.name, i.code, si.price_amount, si.currency 
        FROM shop_items si
        JOIN items i ON si.item_id = i.id
        WHERE si.is_active = 1
    `;
    return await query(sql);
}

async function buyFromShop(phoneNumber, shopItemId, quantity = 1) {
    const player = (await query(`SELECT id FROM players WHERE phone_number = ?`, [phoneNumber]))[0];
    if (!player) throw new Error('Cultivador não encontrado.');

    const item = (await query(`SELECT * FROM shop_items WHERE id = ? AND is_active = 1`, [shopItemId]))[0];
    if (!item) throw new Error('Este item não está disponível no Pavilhão de Comércio.');

    const totalPrice = item.price_amount * quantity;
    const wallet = (await query(`SELECT * FROM wallet_balances WHERE player_id = ?`, [player.id]))[0];

    // Mapeamento das 3 moedas solicitadas pelo Mestre Fundador
    const currencyMap = {
        'gold': { field: 'gold', label: 'Ouro' },
        'spirit_pearl': { field: 'spirit_stones', label: 'Pérolas Espirituais' }, // Usando a coluna spirit_stones do DB v2 para Pérolas
        'dao_crystal': { field: 'celestial_crystals', label: 'Cristais Dao' } // Usando a coluna celestial_crystals para Cristais Dao
    };

    const currencyInfo = currencyMap[item.currency];
    if (!currencyInfo) throw new Error('Moeda desconhecida pelo Sistema.');

    const currentBalance = wallet[currencyInfo.field];

    if (currentBalance < totalPrice) {
        throw new Error(`Saldo insuficiente! Você precisa de ${totalPrice} ${currencyInfo.label} (Possui: ${currentBalance}).`);
    }

    await run('BEGIN TRANSACTION');
    try {
        // Debita o valor na moeda correspondente
        await run(
            `UPDATE wallet_balances SET ${currencyInfo.field} = ${currencyInfo.field} - ? WHERE player_id = ?`, 
            [totalPrice, player.id]
        );
        
        // Entrega o item ao inventário
        await run(`
            INSERT INTO player_inventory (player_id, item_id, quantity) 
            VALUES (?, ?, ?)
            ON CONFLICT(player_id, item_id) DO UPDATE SET quantity = quantity + ?
        `, [player.id, item.item_id, quantity, quantity]);

        // Registra o LOG econômico obrigatório
        await run(`INSERT INTO transactions (player_id, transaction_type, currency, amount) VALUES (?, 'shop_buy', ?, ?)`, 
            [player.id, item.currency, totalPrice]);

        await run('COMMIT');
        return { success: true, itemName: item.name, totalPrice, currencyLabel: currencyInfo.label };
    } catch (e) {
        await run('ROLLBACK');
        throw e;
    }
}
// --- NOVAS TÉCNICAS DE COMÉRCIO ---

// Vender um item diretamente ao sistema em troca de Ouro
async function sellToSystem(phoneNumber, itemCodeOrId, quantity = 1) {
    const playerQuery = `SELECT id FROM players WHERE phone_number = ?`;
    const player = (await query(playerQuery, [phoneNumber]))[0];
    if (!player) throw new Error('Cultivador não encontrado.');

    // Busca o item no inventário
    const invQuery = `
        SELECT pi.id as inv_id, pi.quantity, i.id as item_id, i.name, i.base_value, i.sellable_to_shop 
        FROM player_inventory pi
        JOIN items i ON pi.item_id = i.id
        WHERE pi.player_id = ? AND (i.code = ? OR i.id = ?)
    `;
    const invItem = (await query(invQuery, [player.id, itemCodeOrId, itemCodeOrId]))[0];

    if (!invItem || invItem.quantity < quantity) {
        throw new Error('Você não possui esta quantidade do item no inventário.');
    }
    if (!invItem.sellable_to_shop || invItem.base_value <= 0) {
        throw new Error('O sistema não tem interesse em comprar este item.');
    }

    const totalGoldEarned = Math.floor((invItem.base_value / 2) * quantity); // Venda por 50% do valor base

    await run('BEGIN TRANSACTION');
    try {
        // Remove o item do inventário
        if (invItem.quantity === quantity) {
            await run(`DELETE FROM player_inventory WHERE id = ?`, [invItem.inv_id]);
        } else {
            await run(`UPDATE player_inventory SET quantity = quantity - ? WHERE id = ?`, [quantity, invItem.inv_id]);
        }

        // Adiciona o ouro
        await run(`UPDATE wallet_balances SET gold = gold + ? WHERE player_id = ?`, [totalGoldEarned, player.id]);

        // Registra o LOG
        await run(`INSERT INTO transactions (player_id, transaction_type, currency, amount) VALUES (?, 'system_sell', 'gold', ?)`, [player.id, totalGoldEarned]);

        await run('COMMIT');
        return { success: true, itemName: invItem.name, totalGoldEarned };
    } catch (e) {
        await run('ROLLBACK');
        throw e;
    }
}

// Visualizar o Mercado de Jogadores
async function getMarketListings() {
    const sql = `
        SELECT ml.id, i.name, ml.quantity, ml.price_amount, ml.price_currency, p.character_name as seller_name
        FROM market_listings ml
        JOIN items i ON ml.item_id = i.id
        JOIN players p ON ml.seller_player_id = p.id
        WHERE ml.status = 'active' AND ml.expires_at > CURRENT_TIMESTAMP
        ORDER BY ml.created_at DESC LIMIT 20
    `;
    return await query(sql);
}

// Criar um anúncio no Mercado
async function createMarketListing(phoneNumber, itemCodeOrId, quantity, price, currencyType) {
    if (price <= 0 || quantity <= 0) throw new Error('Valores inválidos.');

    const player = (await query(`SELECT id FROM players WHERE phone_number = ?`, [phoneNumber]))[0];
    if (!player) throw new Error('Cultivador não encontrado.');

    // Mapeamento das 3 moedas
    const validCurrencies = ['gold', 'spirit_pearl', 'dao_crystal'];
    if (!validCurrencies.includes(currencyType)) throw new Error('Moeda inválida. Use: gold, spirit_pearl ou dao_crystal.');

    // Verifica inventário e se é negociável
    const invItem = (await query(`
        SELECT pi.id as inv_id, pi.quantity, i.id as item_id, i.name, i.tradable 
        FROM player_inventory pi JOIN items i ON pi.item_id = i.id
        WHERE pi.player_id = ? AND (i.code = ? OR i.id = ?)
    `, [player.id, itemCodeOrId, itemCodeOrId]))[0];

    if (!invItem || invItem.quantity < quantity) throw new Error('Quantidade insuficiente no inventário.');
    if (!invItem.tradable) throw new Error('Este item está vinculado à sua alma e não pode ser vendido.');

    // Limite de 20 anúncios por jogador (Conforme Seção 32.2) [cite: 297]
    const activeListings = await query(`SELECT count(*) as count FROM market_listings WHERE seller_player_id = ? AND status = 'active'`, [player.id]);
    if (activeListings[0].count >= 20) throw new Error('Você atingiu o limite de 20 anúncios ativos no mercado.');

    // Taxa de listagem: 2% do valor total em Ouro (Conforme Seção 32.1) [cite: 294, 295]
    // Se a venda for em pérolas ou cristais, a taxa ainda é em Ouro como custo de serviço.
    const listingFeeGold = Math.max(1, Math.floor((price * quantity) * 0.02));
    const wallet = (await query(`SELECT gold FROM wallet_balances WHERE player_id = ?`, [player.id]))[0];
    if (wallet.gold < listingFeeGold) throw new Error(`Você precisa de ${listingFeeGold} de Ouro para pagar a taxa da Casa de Leilões.`);

    await run('BEGIN TRANSACTION');
    try {
        // Cobra a taxa
        await run(`UPDATE wallet_balances SET gold = gold - ? WHERE player_id = ?`, [listingFeeGold, player.id]);

        // Move do inventário para o mercado (Bloqueio do item)
        if (invItem.quantity === quantity) {
            await run(`DELETE FROM player_inventory WHERE id = ?`, [invItem.inv_id]);
        } else {
            await run(`UPDATE player_inventory SET quantity = quantity - ? WHERE id = ?`, [quantity, invItem.inv_id]);
        }

        // Cria a listagem (Expira em 7 dias)
        await run(`
            INSERT INTO market_listings (seller_player_id, item_id, quantity, price_amount, price_currency, status, expires_at) 
            VALUES (?, ?, ?, ?, ?, 'active', datetime('now', '+7 days'))
        `, [player.id, invItem.item_id, quantity, price, currencyType]);

        // LOG da criação do anúncio
        await run(`INSERT INTO game_logs (service_name, event_type, action, player_id) VALUES ('economyService', 'market_create', 'list_item', ?)`, [player.id]);

        await run('COMMIT');
        return { success: true, itemName: invItem.name, fee: listingFeeGold };
    } catch (e) {
        await run('ROLLBACK');
        throw e;
    }
}

// Comprar de outro jogador no Mercado
async function buyFromMarket(phoneNumber, marketListingId, quantity = 1) {
    const player = (await query(`SELECT id FROM players WHERE phone_number = ?`, [phoneNumber]))[0];
    if (!player) throw new Error('Cultivador não encontrado.');

    // Busca o anúncio
    const listing = (await query(`
        SELECT ml.*, i.name, i.id as item_id 
        FROM market_listings ml
        JOIN items i ON ml.item_id = i.id
        WHERE ml.id = ? AND ml.status = 'active' AND ml.expires_at > CURRENT_TIMESTAMP
    `, [marketListingId]))[0];

    if (!listing) throw new Error('Anúncio não encontrado ou expirado.');
    if (listing.quantity < quantity) throw new Error(`Quantidade insuficiente. O anúncio oferece apenas ${listing.quantity} unidades.`);

    // Mapear a moeda
    const currencyMap = {
        'gold': { field: 'gold', label: 'Ouro' },
        'spirit_pearl': { field: 'spirit_stones', label: 'Pérolas Espirituais' },
        'dao_crystal': { field: 'celestial_crystals', label: 'Cristais Dao' }
    };
    const currencyInfo = currencyMap[listing.price_currency];
    if (!currencyInfo) throw new Error('Moeda desconhecida.');

    const totalPrice = listing.price_amount * quantity;
    const buyerWallet = (await query(`SELECT * FROM wallet_balances WHERE player_id = ?`, [player.id]))[0];

    if (buyerWallet[currencyInfo.field] < totalPrice) {
        throw new Error(`Saldo insuficiente! Você precisa de ${totalPrice} ${currencyInfo.label} (Possui: ${buyerWallet[currencyInfo.field]}).`);
    }

    const sellerQuery = `SELECT id FROM players WHERE id = (SELECT seller_player_id FROM market_listings WHERE id = ?)`;
    const seller = (await query(sellerQuery, [marketListingId]))[0];

    await run('BEGIN TRANSACTION');
    try {
        // Debita do comprador
        await run(
            `UPDATE wallet_balances SET ${currencyInfo.field} = ${currencyInfo.field} - ? WHERE player_id = ?`,
            [totalPrice, player.id]
        );

        // Entrega o item ao comprador
        await run(`
            INSERT INTO player_inventory (player_id, item_id, quantity) 
            VALUES (?, ?, ?)
            ON CONFLICT(player_id, item_id) DO UPDATE SET quantity = quantity + ?
        `, [player.id, listing.item_id, quantity, quantity]);

        // Credita o vendedor
        await run(
            `UPDATE wallet_balances SET ${currencyInfo.field} = ${currencyInfo.field} + ? WHERE player_id = ?`,
            [totalPrice, listing.seller_player_id]
        );

        // Atualiza a listagem
        if (listing.quantity === quantity) {
            await run(`UPDATE market_listings SET status = 'sold' WHERE id = ?`, [marketListingId]);
        } else {
            await run(`UPDATE market_listings SET quantity = quantity - ? WHERE id = ?`, [quantity, marketListingId]);
        }

        // Log de transação
        await run(`INSERT INTO transactions (player_id, transaction_type, currency, amount) VALUES (?, 'market_buy', ?, ?)`, 
            [player.id, listing.price_currency, totalPrice]);

        await run('COMMIT');
        return { 
            success: true, 
            itemName: listing.name, 
            totalPrice, 
            currencyLabel: currencyInfo.label 
        };
    } catch (e) {
        await run('ROLLBACK');
        throw e;
    }
}

module.exports = { getShopItems, buyFromShop, sellToSystem, getMarketListings, createMarketListing, buyFromMarket };
