-- Migration 009: Combates Ativos
-- Tabela para armazenar estados de combates em andamento

CREATE TABLE IF NOT EXISTS active_combats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL CHECK (type IN ('pvp', 'pve', 'raid')), -- Tipo de combate
    player_ids TEXT NOT NULL, -- JSON array de IDs dos jogadores envolvidos
    current_turn INTEGER DEFAULT 1, -- Turno atual
    state TEXT NOT NULL, -- JSON com estado completo (HPs, buffs, etc.)
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Índice para buscas rápidas por jogador
CREATE INDEX IF NOT EXISTS idx_active_combats_player_ids ON active_combats(player_ids);

-- Índice para tipo de combate
CREATE INDEX IF NOT EXISTS idx_active_combats_type ON active_combats(type);