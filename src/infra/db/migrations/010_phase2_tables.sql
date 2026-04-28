-- Migration 010: Player Formations
CREATE TABLE IF NOT EXISTS player_formations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    player_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    members TEXT NOT NULL, -- JSON array of player IDs
    active BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (player_id) REFERENCES players(id)
);

-- Migration 011: Custom Techniques
CREATE TABLE IF NOT EXISTS custom_techniques (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    player_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    base_technique_id INTEGER NOT NULL,
    effects TEXT NOT NULL, -- JSON array of effects
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (player_id) REFERENCES players(id),
    FOREIGN KEY (base_technique_id) REFERENCES techniques(id)
);

-- Migration 012: Marriage Proposals
CREATE TABLE IF NOT EXISTS marriage_proposals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    proposer_id INTEGER NOT NULL,
    target_id INTEGER NOT NULL,
    status TEXT DEFAULT 'pending', -- pending, accepted, rejected
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (proposer_id) REFERENCES players(id),
    FOREIGN KEY (target_id) REFERENCES players(id)
);

-- Migration 013: Marriages
CREATE TABLE IF NOT EXISTS marriages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    player1_id INTEGER NOT NULL,
    player2_id INTEGER NOT NULL,
    dao_companion_active BOOLEAN DEFAULT 0,
    married_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (player1_id) REFERENCES players(id),
    FOREIGN KEY (player2_id) REFERENCES players(id)
);

-- Migration 014: Global Events
CREATE TABLE IF NOT EXISTS global_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL, -- invasion, tournament, etc.
    description TEXT NOT NULL,
    rewards TEXT NOT NULL, -- JSON array of rewards
    active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Migration 015: Event Participants
CREATE TABLE IF NOT EXISTS event_participants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    player_id INTEGER NOT NULL,
    event_id INTEGER NOT NULL,
    joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (player_id) REFERENCES players(id),
    FOREIGN KEY (event_id) REFERENCES global_events(id)
);

-- Migration 016: Auction Bids (histórico de lances para ambos os tipos de listagens)
CREATE TABLE IF NOT EXISTS auction_bids (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    listing_id INTEGER NOT NULL,
    listing_type TEXT NOT NULL, -- 'market' or 'auction'
    bidder_player_id INTEGER NOT NULL,
    amount INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (bidder_player_id) REFERENCES players(id)
);