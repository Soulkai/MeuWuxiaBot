const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();

// Pega o caminho do banco de dados do arquivo .env ou usa um padrão
const dbPath = process.env.DB_PATH ? path.resolve(process.env.DB_PATH) : path.resolve(__dirname, '../../..', 'data', 'game.sqlite');

// Inicia a conexão com o banco de dados
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('❌ Falha ao condensar o Qi do Banco de Dados:', err.message);
    } else {
        console.log('✅ Conexão com o Reino do SQLite estabelecida com sucesso!');
        
        // Ativa o suporte a chaves estrangeiras (Foreign Keys)
        db.run('PRAGMA foreign_keys = ON;', (err) => {
            if (err) console.error('Erro ao ativar Foreign Keys:', err.message);
        });
        
        // Ativa o modo WAL para melhor performance de escrita e leitura simultânea
        db.run('PRAGMA journal_mode = WAL;', (err) => {
            if (err) console.error('Erro ao ativar modo WAL:', err.message);
        });
    }
});

module.exports = db;
