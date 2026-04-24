const db = require('../../infra/db/connection');

const query = (sql, params = []) => new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => err ? reject(err) : resolve(rows));
});
const run = (sql, params = []) => new Promise((resolve, reject) => {
    db.run(sql, params, function (err) { err ? reject(err) : resolve(this) });
});

async function exploreArea(phoneNumber) {
    const playerQuery = `SELECT p.id, p.character_name, r.name as region_name, r.event_table_json FROM players p JOIN regions r ON p.region_id = r.id WHERE p.phone_number = ?`;
    const playerResult = await query(playerQuery, [phoneNumber]);
    if (playerResult.length === 0) throw new Error('Personagem não encontrado.');
    const player = playerResult[0];

    // Custo de explorar
    await run(`UPDATE player_attributes SET fatigue = fatigue + 5 WHERE player_id = ?`, [player.id]);

    // Rola o evento
    const events = JSON.parse(player.event_table_json);
    let totalWeight = 0;
    for (let key in events) totalWeight += events[key];
    
    let roll = Math.floor(Math.random() * totalWeight);
    let selectedEvent = 'nada';

    for (let key in events) {
        if (roll < events[key]) { selectedEvent = key; break; }
        roll -= events[key];
    }

    let encounterText = '';
    let dropText = '';

    // Resolução Simples do Evento (MVP)
    if (selectedEvent.includes('monster')) {
        encounterText = '🐺 Você encontrou uma Fera Selvagem!';
        // Simula uma vitória e um drop (O combate real virá nos próximos sprints)
        const drop = await query(`SELECT id, name FROM items WHERE item_type = 'material' ORDER BY RANDOM() LIMIT 1`);
        await run(`INSERT INTO player_inventory (player_id, item_instance_id, quantity) VALUES (?, ?, 1) ON CONFLICT DO UPDATE SET quantity = quantity + 1`, [player.id, drop[0].id]); // Simplificado para itens base
        dropText = `Após uma batalha feroz, você recolheu: 1x ${drop[0].name}.`;
    } 
    else if (selectedEvent === 'herb' || selectedEvent === 'mineral') {
        encounterText = '🌿 Você encontrou um recurso natural cintilante.';
        const drop = await query(`SELECT id, name FROM items WHERE item_type = 'material' ORDER BY RANDOM() LIMIT 1`);
        dropText = `Você coletou com cuidado: 1x ${drop[0].name}.`;
    }
    else if (selectedEvent === 'npc') {
        encounterText = '👤 Um cultivador viajante passou por você.';
        dropText = '"As seitas estão se movendo...", ele murmurou, indo embora.';
    } else {
        encounterText = '🍃 Tudo está calmo por aqui.';
        dropText = 'Você não encontrou nada de útil desta vez.';
    }

    await run(`INSERT INTO game_logs (service_name, event_type, action, player_id) VALUES ('explorationService', 'explore', ?, ?)`, [selectedEvent, player.id]);

    return { regionName: player.region_name, encounterText, dropText };
}

module.exports = { exploreArea };
