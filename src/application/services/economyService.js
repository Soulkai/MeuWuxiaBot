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

module.exports = { getShopItems, buyFromShop };
