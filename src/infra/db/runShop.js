const fs = require('fs');
const path = require('path');
const db = require('./connection');

const seedPath = path.join(__dirname, 'migrations', '006_shop.sql');

try {
    const sql = fs.readFileSync(seedPath, 'utf8');
    console.log('🏪 Abrindo os portões do Pavilhão de Comércio...');

    db.exec(sql, (err) => {
        if (err) console.error('❌ Ocorreu um erro ao abastecer a loja:', err.message);
        else console.log('✅ Itens da loja, incluindo a Pílula de Reversão do Destino, materializados com sucesso no SQLite!');
    });
} catch (error) {
    console.error('❌ Erro ao ler o pergaminho da loja:', error.message);
}
