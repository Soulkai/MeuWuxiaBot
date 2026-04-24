const db = require('./connection');

const empires = [
    { name: "Sol Nascente", dangerBase: 1, minR: 1, maxR: 3 },
    { name: "Abismo Negro", dangerBase: 3, minR: 3, maxR: 5 },
    { name: "Nuvens Espirituais", dangerBase: 5, minR: 5, maxR: 7 },
    { name: "Fera Ancestral", dangerBase: 7, minR: 7, maxR: 8 },
    { name: "Caos Primordial", dangerBase: 9, minR: 8, maxR: 9 }
];

const kingdomThemes = ["Água Fria", "Fogo Ardente", "Terra Pesada", "Vento Uivante", "Trovão"];
const areaTypes = ["Vila", "Cidade", "Pico", "Vale", "Santuário"];

console.log('🌍 Remoldando as Leis do Espaço e do Tempo...');

db.serialize(() => {
    db.run('DELETE FROM regions');
    
    const stmt = db.prepare(`INSERT INTO regions (code, name, danger_level, min_realm_index, max_realm_index, event_table_json) VALUES (?, ?, ?, ?, ?, ?)`);

    empires.forEach((empire, eIndex) => {
        // 1. Cria o HUB do Império
        stmt.run(`emp_${eIndex}`, `Capital do Império do ${empire.name}`, empire.dangerBase + 3, empire.minR, 9, JSON.stringify({npc: 50, merchant: 50}));

        for (let k = 0; k < 5; k++) {
            // 2. Cria o HUB do Reino
            const kingName = `Capital do Reino da ${kingdomThemes[k]}`;
            stmt.run(`king_${eIndex}_${k}`, kingName, empire.dangerBase + 1, empire.minR, empire.maxR, JSON.stringify({npc: 40, guard: 30, ambush: 10}));

            for (let c = 0; c < 5; c++) {
                // 3. Cria as 5 Áreas/Cidades daquele Reino
                const areaName = `${areaTypes[c]} (${kingdomThemes[k]})`;
                const code = `area_${eIndex}_${k}_${c}`;
                const dangerLevel = empire.dangerBase + (c === 4 ? 1 : 0); 
                
                let events = dangerLevel <= 2 ? { herb: 30, monster_common: 30, npc: 20, mineral: 20 } :
                             dangerLevel <= 5 ? { monster_common: 30, monster_elite: 20, mineral: 20, ambush: 10 } :
                             { monster_elite: 40, ambush: 30, treasure: 20, heritage: 10 };

                stmt.run(code, areaName, dangerLevel, empire.minR, empire.maxR, JSON.stringify(events));
            }
        }
    });

    stmt.finalize();
    console.log(`🌌 Matriz Concluída! 5 Impérios, 25 Reinos e 125 Áreas foram estabelecidos (Total: 155 nós de viagem).`);
});
