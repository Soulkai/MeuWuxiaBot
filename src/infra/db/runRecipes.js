const fs = require('fs');
const path = require('path');
const db = require('./connection');

const seedPath = path.join(__dirname, 'migrations', '005_recipes.sql');

try {
    const sql = fs.readFileSync(seedPath, 'utf8');
    console.log('📜 Abrindo o Antigo Compêndio de Receitas...');

    db.exec(sql, (err) => {
        if (err) console.error('❌ As receitas falharam ao serem transcritas:', err.message);
        else console.log('✅ Compêndio de Fórmulas e Projetos materializado com sucesso no SQLite!');
    });
} catch (error) {
    console.error('❌ Erro ao ler o pergaminho:', error.message);
}
