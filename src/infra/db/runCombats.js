const fs = require('fs');
const path = require('path');
const db = require('./connection');

const migrationFile = path.join(__dirname, 'migrations', '009_combats.sql');

console.log('⚔️ Preparando o Campo de Batalha...');

try {
    const migrationSQL = fs.readFileSync(migrationFile, 'utf8');
    db.exec(migrationSQL);
    console.log('✅ Sistema de combate ativado com sucesso!');
} catch (error) {
    console.error('❌ Erro ao preparar o combate:', error.message);
    process.exit(1);
}

db.close();