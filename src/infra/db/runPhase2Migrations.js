const fs = require('fs');
const path = require('path');
const db = require('./connection');

const migrationFile = path.join(__dirname, 'migrations', '010_phase2_tables.sql');

console.log('🧬 Executando migrações Phase 2...');

try {
    const migrationSQL = fs.readFileSync(migrationFile, 'utf8');
    db.exec(migrationSQL);
    console.log('✅ Migrações Phase 2 aplicadas com sucesso!');
} catch (error) {
    console.error('❌ Erro ao aplicar migrações Phase 2:', error.message);
    process.exit(1);
}

db.close();