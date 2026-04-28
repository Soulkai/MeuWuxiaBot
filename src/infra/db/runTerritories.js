const fs = require('fs');
const path = require('path');
const db = require('./connection');

const migrationFile = path.join(__dirname, 'migrations', '008_territories.sql');

console.log('🏰 Estabelecendo Domínios Territoriais...');

try {
    const migrationSQL = fs.readFileSync(migrationFile, 'utf8');
    db.exec(migrationSQL);
    console.log('✅ Territórios estabelecidos com sucesso!');
} catch (error) {
    console.error('❌ Erro ao estabelecer territórios:', error.message);
    process.exit(1);
}

db.close();