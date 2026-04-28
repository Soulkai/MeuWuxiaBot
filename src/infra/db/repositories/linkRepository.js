const db = require('../connection');

const query = (sql, params = []) => new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => err ? reject(err) : resolve(rows));
});
const run = (sql, params = []) => new Promise((resolve, reject) => {
    db.run(sql, params, function (err) { err ? reject(err) : resolve(this) });
});

let initialized = false;

async function ensureTables() {
    if (initialized) return;

    await run(`CREATE TABLE IF NOT EXISTS link_codes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        code TEXT NOT NULL UNIQUE,
        private_jid TEXT NOT NULL,
        used INTEGER NOT NULL DEFAULT 0,
        expires_at TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );`);

    await run(`CREATE TABLE IF NOT EXISTS group_links (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        group_chat_id TEXT NOT NULL,
        participant_jid TEXT NOT NULL,
        private_jid TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(group_chat_id, participant_jid)
    );`);

    initialized = true;
}

function generateCode() {
    const raw = Math.random().toString(36).slice(2, 8).toUpperCase();
    return `LINK-${raw}`;
}

async function createLinkCode(privateJid, expiryMinutes = 60) {
    await ensureTables();

    let code = generateCode();
    let exists = await query(`SELECT id FROM link_codes WHERE code = ?`, [code]);
    while (exists.length > 0) {
        code = generateCode();
        exists = await query(`SELECT id FROM link_codes WHERE code = ?`, [code]);
    }

    await run(`INSERT INTO link_codes (code, private_jid, expires_at) VALUES (?, ?, datetime('now', ?))`, [code, privateJid, `+${expiryMinutes} minutes`]);
    return code;
}

async function getLinkCode(code) {
    await ensureTables();
    const rows = await query(`SELECT * FROM link_codes WHERE code = ? AND used = 0 AND expires_at > datetime('now')`, [code]);
    return rows[0] || null;
}

async function markLinkCodeUsed(code) {
    await ensureTables();
    await run(`UPDATE link_codes SET used = 1 WHERE code = ?`, [code]);
}

async function createGroupLink(groupChatId, participantJid, privateJid) {
    await ensureTables();

    const existing = await query(`SELECT * FROM group_links WHERE group_chat_id = ? AND participant_jid = ?`, [groupChatId, participantJid]);
    if (existing.length > 0) {
        if (existing[0].private_jid !== privateJid) {
            throw new Error('Este participante já está vinculado a outra conta privada.');
        }
        await run(`UPDATE group_links SET private_jid = ?, created_at = CURRENT_TIMESTAMP WHERE id = ?`, [privateJid, existing[0].id]);
        return existing[0].id;
    }

    const result = await run(`INSERT INTO group_links (group_chat_id, participant_jid, private_jid) VALUES (?, ?, ?)`, [groupChatId, participantJid, privateJid]);
    return result.lastID;
}

async function getPrivateJidByGroupParticipant(groupChatId, participantJid) {
    await ensureTables();
    const rows = await query(`SELECT private_jid FROM group_links WHERE group_chat_id = ? AND participant_jid = ?`, [groupChatId, participantJid]);
    return rows[0]?.private_jid || null;
}

module.exports = {
    createLinkCode,
    getLinkCode,
    markLinkCodeUsed,
    createGroupLink,
    getPrivateJidByGroupParticipant
};
