-- Sprint 13: Territories - Zonas de Domínio e Estruturas de Seitas
-- Criação de tabelas para territórios, domínios e conflitos
-- Referência: Seção 406

BEGIN TRANSACTION;

-- Tabela de Territórios do Mundo
CREATE TABLE IF NOT EXISTS world_territories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    region_id INTEGER,
    level INTEGER DEFAULT 1,
    min_cultivation_realm INTEGER DEFAULT 1,
    base_wealth INTEGER DEFAULT 1000,  -- Ouro gerado diariamente
    spirit_stone_production INTEGER DEFAULT 10,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (region_id) REFERENCES regions(id)
);

-- Tabela de Domínios (Quem controla cada território)
CREATE TABLE IF NOT EXISTS territory_dominions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    territory_id INTEGER UNIQUE NOT NULL,
    sect_id INTEGER NOT NULL,
    controlling_player_id INTEGER,  -- Fundador/Patriarca
    level INTEGER DEFAULT 1,  -- Nível de desenvolvimento
    development_score REAL DEFAULT 0.0,  -- 0-100%
    accumulated_wealth INTEGER DEFAULT 0,
    last_collected_at TIMESTAMP,
    conquered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (territory_id) REFERENCES world_territories(id) ON DELETE CASCADE,
    FOREIGN KEY (sect_id) REFERENCES sects(id) ON DELETE CASCADE,
    FOREIGN KEY (controlling_player_id) REFERENCES players(id) ON DELETE SET NULL
);

-- Tabela de Investimentos em Territórios
CREATE TABLE IF NOT EXISTS territory_investments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    dominion_id INTEGER NOT NULL,
    player_id INTEGER NOT NULL,
    amount_gold INTEGER NOT NULL,
    contribution_percentage REAL,  -- % do total investido pelo jogador
    invested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (dominion_id) REFERENCES territory_dominions(id) ON DELETE CASCADE,
    FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE
);

-- Tabela de Conflitos Territoriais
CREATE TABLE IF NOT EXISTS territory_conflicts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    territory_id INTEGER NOT NULL,
    attacker_sect_id INTEGER NOT NULL,
    defender_sect_id INTEGER NOT NULL,
    attacker_strength REAL,
    defender_strength REAL,
    status TEXT CHECK(status IN ('pending', 'ongoing', 'completed')) DEFAULT 'pending',
    outcome TEXT,  -- 'victory_attacker', 'victory_defender', 'stalemate'
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    FOREIGN KEY (territory_id) REFERENCES world_territories(id),
    FOREIGN KEY (attacker_sect_id) REFERENCES sects(id),
    FOREIGN KEY (defender_sect_id) REFERENCES sects(id)
);

-- Tabela de Cofres de Seita (Armazém de Riqueza)
CREATE TABLE IF NOT EXISTS sect_treasuries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sect_id INTEGER UNIQUE NOT NULL,
    gold INTEGER DEFAULT 0,
    spirit_stones INTEGER DEFAULT 0,
    celestial_crystals INTEGER DEFAULT 0,
    prestige_points INTEGER DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sect_id) REFERENCES sects(id) ON DELETE CASCADE
);

-- Tabela de Patrimônio da Seita (Histórico)
CREATE TABLE IF NOT EXISTS sect_wealth_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sect_id INTEGER NOT NULL,
    transaction_type TEXT,  -- deposit, withdrawal, war_loss, territory_gain
    amount_gold INTEGER DEFAULT 0,
    amount_stones INTEGER DEFAULT 0,
    details TEXT,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sect_id) REFERENCES sects(id) ON DELETE CASCADE
);

COMMIT;
