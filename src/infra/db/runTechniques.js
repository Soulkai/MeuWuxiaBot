const fs = require('fs');
const path = require('path');
const db = require('./connection');

const seedPath = path.join(__dirname, 'migrations', '003_techniques.sql');

try {
    const sql = fs.readFileSync(seedPath, 'utf8');
    console.log('📜 Lendo o Pavilhão de Técnicas...');

    db.exec(sql, (err) => {
        if (err) console.error('❌ As técnicas já foram estabelecidas ou ocorreu um erro:', err.message);
        else console.log('📚 Conhecimento ancestral materializado com sucesso!');
    });
} catch (error) {
    console.error('❌ Erro ao ler o arquivo:', error.message);
}
