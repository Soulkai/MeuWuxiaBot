const fs = require('fs');
const path = require('path');
const db = require('./connection');

const seedPath = path.join(__dirname, 'migrations', '004_items.sql');

try {
    const sql = fs.readFileSync(seedPath, 'utf8');
    console.log('📦 Abrindo os portões do tesouro do mundo...');

    db.exec(sql, (err) => {
        if (err) console.error('❌ Os itens já foram forjados ou ocorreu um erro:', err.message);
        else console.log('💎 Itens materiais injetados com sucesso no SQLite!');
    });
} catch (error) {
    console.error('❌ Erro ao ler o pergaminho:', error.message);
}
