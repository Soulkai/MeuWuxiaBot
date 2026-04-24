const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Invoca a conexão com o banco de dados que forjamos anteriormente
const db = require('./connection');

console.log('📜 Lendo os antigos pergaminhos de formação...');

// Define o caminho exato onde o arquivo 001_init.sql está guardado
const migrationPath = path.join(__dirname, 'migrations', '001_init.sql');

try {
    // Lê todo o conteúdo do arquivo SQL
    const sql = fs.readFileSync(migrationPath, 'utf8');

    console.log('⚙️ Iniciando a materialização das 25 Tabelas Sagradas (Players, Cultivo, Logs, etc)...');

    // Executa as múltiplas queries de uma só vez (db.exec é ideal para isso no SQLite)
    db.exec(sql, (err) => {
        if (err) {
            console.error('❌ Desvio de Cultivo ao forjar as tabelas:', err.message);
        } else {
            console.log('⛩️ A fundação do Mundo foi estabelecida! Todas as tabelas foram criadas com sucesso no SQLite.');
        }
        
        // Encerra a conexão cordialmente após terminar o serviço
        db.close((err) => {
            if (err) {
                console.error('Erro ao fechar o banco:', err.message);
            } else {
                console.log('🌌 A câmara do banco de dados foi selada com segurança.');
            }
        });
    });

} catch (error) {
    console.error('❌ Falha ao encontrar ou ler o pergaminho 001_init.sql. Verifique se ele está na pasta correta!', error.message);
}
