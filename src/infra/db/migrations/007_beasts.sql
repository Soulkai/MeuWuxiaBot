-- Sprint 10: Beasts - Sistema de Ovos e Feras Místicas
-- Criação das tabelas para bestas, ovos e núcleos bestiais
-- Referência: Seções 308, 1306

BEGIN TRANSACTION;

-- Tabela de Espécies de Bestas
CREATE TABLE IF NOT EXISTS beast_species (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    base_stats_json TEXT NOT NULL,  -- Atributos base em JSON
    evolution_stage INTEGER DEFAULT 0,
    rarity TEXT CHECK(rarity IN ('comum', 'incomum', 'raro', 'epico', 'lendario', 'celestial')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Ovos
CREATE TABLE IF NOT EXISTS beast_eggs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    player_id INTEGER NOT NULL,
    species_id INTEGER NOT NULL,
    hatch_progress REAL DEFAULT 0.0,  -- 0-100%
    incubation_time_hours INTEGER DEFAULT 72,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    hatched_at TIMESTAMP,
    status TEXT CHECK(status IN ('incubating', 'ready', 'hatched')) DEFAULT 'incubating',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE,
    FOREIGN KEY (species_id) REFERENCES beast_species(id)
);

-- Tabela de Bestas Ativas
CREATE TABLE IF NOT EXISTS player_beasts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    player_id INTEGER NOT NULL,
    species_id INTEGER NOT NULL,
    nickname TEXT,
    level INTEGER DEFAULT 1,
    experience REAL DEFAULT 0.0,
    current_stats_json TEXT NOT NULL,  -- Atributos atuais
    happiness INTEGER DEFAULT 50,  -- 0-100
    health_current INTEGER DEFAULT 100,
    health_max INTEGER DEFAULT 100,
    is_active BOOLEAN DEFAULT 0,
    bonded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE,
    FOREIGN KEY (species_id) REFERENCES beast_species(id)
);

-- Tabela de Núcleos Bestiais (Dropados por bestas selvagens)
CREATE TABLE IF NOT EXISTS beast_cores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    rarity TEXT,
    effect_json TEXT,  -- Bônus ao equipar
    sellable_to_shop BOOLEAN DEFAULT 1,
    base_value INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Núcleos no Inventário
CREATE TABLE IF NOT EXISTS player_beast_cores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    player_id INTEGER NOT NULL,
    core_id INTEGER NOT NULL,
    quantity INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE,
    FOREIGN KEY (core_id) REFERENCES beast_cores(id),
    UNIQUE(player_id, core_id)
);

-- Logs de Atividades de Bestas
CREATE TABLE IF NOT EXISTS beast_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    player_id INTEGER NOT NULL,
    beast_id INTEGER,
    event_type TEXT NOT NULL,  -- hatch, level_up, mutation, evolution, etc
    details_json TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE,
    FOREIGN KEY (beast_id) REFERENCES player_beasts(id) ON DELETE SET NULL
);

COMMIT;
