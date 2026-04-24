const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Invoca a conexão com o banco de dados que já criamos
const db = require('./connection');

console.log('🌱 Abrindo as sementes da criação...');

// Define o caminho onde guardamos o arquivo de sementes
const seedPath = path.join(__dirname, 'migrations', '002_seeds.sql');

try {
    const sql = fs.readFileSync(seedPath, 'utf8');

    console.log('🌍 Injetando Raças, Clãs, Corpos Divinos e Regiões no mundo material...');

    db.exec(sql, (err) => {
        if (err) {
            console.error('❌ Falha ao semear o mundo. A semente já foi plantada ou as runas estão erradas:', err.message);
        } else {
            console.log('🌳 Vida estabelecida! Todas as Origens foram injetadas com sucesso no banco de dados.');
        }
        
        db.close((err) => {
            if (err) console.error('Erro ao fechar o banco:', err.message);
            else console.log('🌌 Ritual de plantio finalizado.');
        });
    });

} catch (error) {
    console.error('❌ Não foi possível encontrar o pergaminho 002_seeds.sql', error.message);
}
