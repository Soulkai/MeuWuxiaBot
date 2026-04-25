const db = require('../../infra/db/connection');

const query = (sql, params = []) => new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => err ? reject(err) : resolve(rows));
});
const run = (sql, params = []) => new Promise((resolve, reject) => {
    db.run(sql, params, function (err) { err ? reject(err) : resolve(this) });
});

// Transmissão de Mensagem Telepática
async function prepareWhisper(senderPhone, targetName, textMsg) {
    const sender = (await query(`SELECT character_name FROM players WHERE phone_number = ?`, [senderPhone]))[0];
    if (!sender) throw new Error('O seu cultivador não foi encontrado no plano material.');

    // Busca o alvo por nome exato ou parcial
    const target = (await query(`SELECT phone_number, character_name FROM players WHERE character_name LIKE ?`, [`%${targetName}%`]))[0];
    if (!target) throw new Error(`Nenhum cultivador conhecido como "${targetName}" foi encontrado.`);
    if (target.phone_number === senderPhone) throw new Error('Você não pode enviar uma mensagem telepática para si mesmo.');

    const formattedMessage = `🕊️ [MENSAGEM TELEPÁTICA]\nDe: ${sender.character_name}\n\n"${textMsg}"\n\n↳ Responda: /conversar ${sender.character_name} [sua mensagem]`;

    return { 
        targetPhone: target.phone_number, 
        targetName: target.character_name,
        formattedMessage 
    };
}

// Transferência Direta de Itens (O princípio do /trocar)
async function transferItem(senderPhone, targetName, itemCodeOrId, quantity = 1) {
    if (quantity <= 0) throw new Error('A quantidade deve ser maior que zero.');

    const sender = (await query(`SELECT id, character_name FROM players WHERE phone_number = ?`, [senderPhone]))[0];
    if (!sender) throw new Error('Remetente não encontrado.');

    const target = (await query(`SELECT id, phone_number, character_name FROM players WHERE character_name LIKE ?`, [`%${targetName}%`]))[0];
    if (!target) throw new Error(`Destinatário "${targetName}" não encontrado.`);
    if (sender.id === target.id) throw new Error('Você não pode transferir itens para si mesmo.');

    // Busca o item no inventário do remetente
    const invItem = (await query(`
        SELECT pi.id as inv_id, pi.quantity, i.id as item_id, i.name, i.tradable 
        FROM player_inventory pi 
        JOIN items i ON pi.item_id = i.id 
        WHERE pi.player_id = ? AND (i.code = ? OR i.id = ?)
    `, [sender.id, itemCodeOrId, itemCodeOrId]))[0];

    if (!invItem || invItem.quantity < quantity) throw new Error(`Você não possui ${quantity}x deste item para enviar.`);
    if (!invItem.tradable) throw new Error(`O item [${invItem.name}] está vinculado à sua alma e não pode ser transferido.`);

    await run('BEGIN TRANSACTION');
    try {
        // 1. Remove do remetente
        if (invItem.quantity === quantity) {
            await run(`DELETE FROM player_inventory WHERE id = ?`, [invItem.inv_id]);
        } else {
            await run(`UPDATE player_inventory SET quantity = quantity - ? WHERE id = ?`, [quantity, invItem.inv_id]);
        }

        // 2. Adiciona ao destinatário
        await run(`
            INSERT INTO player_inventory (player_id, item_id, quantity) 
            VALUES (?, ?, ?)
            ON CONFLICT(player_id, item_id) DO UPDATE SET quantity = quantity + ?
        `, [target.id, invItem.item_id, quantity, quantity]);

        // 3. Registra a transação social
        await run(`INSERT INTO transactions (player_id, transaction_type, currency, amount) VALUES (?, 'item_transfer_out', ?, ?)`, [sender.id, invItem.name, quantity]);
        await run(`INSERT INTO transactions (player_id, transaction_type, currency, amount) VALUES (?, 'item_transfer_in', ?, ?)`, [target.id, invItem.name, quantity]);

        await run('COMMIT');

        // Prepara notificação para o alvo
        const targetNotification = `🎁 [PRESENTE RECEBIDO]\nO cultivador ${sender.character_name} transferiu para você:\n+${quantity}x ${invItem.name}\n\nVerifique seu /inventario.`;

        return { 
            success: true, 
            itemName: invItem.name, 
            targetPhone: target.phone_number,
            targetName: target.character_name,
            targetNotification
        };
    } catch (e) {
        await run('ROLLBACK');
        throw e;
    }
}

module.exports = { prepareWhisper, transferItem };
