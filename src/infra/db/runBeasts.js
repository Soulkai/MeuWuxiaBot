const fs = require('fs');
const path = require('path');
const db = require('./connection');

const migrationFile = path.join(__dirname, 'migrations', '007_beasts.sql');

console.log('🐾 Invocando as Bestas Místicas...');

try {
    const migrationSQL = fs.readFileSync(migrationFile, 'utf8');
    db.exec(migrationSQL);
    console.log('✅ Bestas místicas materializadas com sucesso!');
} catch (error) {
    console.error('❌ Erro ao invocar as bestas:', error.message);
    process.exit(1);
}

db.close();