-- LIMPANDO O PAVILHÃO ANTIGO PARA EVITAR DUPLICAÇÕES DURANTE O RE-PLANTIO
DELETE FROM player_techniques;
DELETE FROM techniques;

-- SEMENTES DE 50 TÉCNICAS VARIADAS
INSERT INTO techniques (code, name, category, quality, element, required_realm_index, path_type, effects_json) VALUES

-- ==========================================
-- 1 a 5: TÉCNICAS DE CULTIVO ESPIRITUAL
-- ==========================================
('resp_tartaruga', 'Respiração da Tartaruga Negra', 'Técnica de cultivo', 'Mortal', 'water', 1, 'espirito', '{"qi_mult": 1.10}'),
('arte_sol_nascente', 'Arte do Sol Nascente', 'Técnica de cultivo', 'Profunda', 'fire', 2, 'espirito', '{"qi_mult": 1.25, "fire_affinity": 1.05}'),
('sutra_loto_jade', 'Sutra do Lótus de Jade', 'Técnica de cultivo', 'Terrestre', 'wood', 3, 'espirito', '{"qi_mult": 1.50, "recovery_mult": 1.10}'),
('mantra_nove_ceus', 'Mantra dos Nove Céus', 'Técnica de cultivo', 'Celestial', 'wind', 5, 'espirito', '{"qi_mult": 2.00, "comprehension_bonus": 10}'),
('origem_caos', 'Devoração da Origem do Caos', 'Técnica de cultivo', 'Divina', 'void', 7, 'espirito', '{"qi_mult": 3.00, "all_elements_affinity": 1.20}'),

-- ==========================================
-- 6 a 10: TÉCNICAS DE CULTIVO CORPORAL
-- ==========================================
('forja_ferro', 'Arte da Forja de Ferro', 'Técnica corporal', 'Mortal', 'metal', 1, 'corpo', '{"body_mult": 1.10}'),
('corpo_urso_terra', 'Corpo do Urso Terrestre', 'Técnica corporal', 'Profunda', 'earth', 2, 'corpo', '{"body_mult": 1.25, "hp_max_mult": 1.10}'),
('osso_dragao_raio', 'Têmpera Óssea do Dragão do Raio', 'Técnica corporal', 'Terrestre', 'thunder', 3, 'corpo', '{"body_mult": 1.50, "strength_mult": 1.15}'),
('ouro_imortal', 'Físico do Ouro Imortal', 'Técnica corporal', 'Celestial', 'light', 5, 'corpo', '{"body_mult": 2.00, "defense_mult": 1.30}'),
('nirvana_fenix', 'Refino de Sangue do Nirvana', 'Técnica corporal', 'Divina', 'fire', 7, 'corpo', '{"body_mult": 3.00, "regeneration_mult": 2.00}'),

-- ==========================================
-- 11 a 15: TÉCNICAS DE CULTIVO DE ALMA
-- ==========================================
('mente_vazia', 'Meditação do Vazio', 'Técnica de alma', 'Mortal', 'void', 1, 'alma', '{"soul_mult": 1.10}'),
('olho_coruja_sombra', 'Visão da Coruja Sombria', 'Técnica de alma', 'Profunda', 'darkness', 2, 'alma', '{"soul_mult": 1.25, "perception_mult": 1.10}'),
('sino_imperador', 'Sino Espiritual do Imperador', 'Técnica de alma', 'Terrestre', 'metal', 3, 'alma', '{"soul_mult": 1.50, "willpower_mult": 1.20}'),
('mar_estrelas', 'Meditação do Mar de Estrelas', 'Técnica de alma', 'Celestial', 'stellar', 5, 'alma', '{"soul_mult": 2.00, "soul_capacity_mult": 1.50}'),
('reencarnacao_divina', 'Ciclo de Reencarnação Divina', 'Técnica de alma', 'Divina', 'life', 7, 'alma', '{"soul_mult": 3.00, "epiphany_chance_mult": 2.00}'),

-- ==========================================
-- 16 a 25: ARTES MARCIAIS (Ataque Físico/Armas)
-- ==========================================
('punho_pedra', 'Punho Quebra-Pedra', 'Arte marcial', 'Mortal', 'earth', 1, null, '{"damage_base": 15, "stun_chance": 5}'),
('espada_vento_cai', 'Espada do Vento Caído', 'Arte marcial', 'Mortal', 'wind', 1, null, '{"damage_base": 18, "bleed_chance": 10}'),
('palma_trovao', 'Palma do Trovão Estrondoso', 'Arte marcial', 'Profunda', 'thunder', 2, null, '{"damage_base": 35, "stun_chance": 15}'),
('lanca_dragao_mar', 'Perfuração do Dragão do Mar', 'Arte marcial', 'Profunda', 'water', 2, null, '{"damage_base": 40, "armor_pen": 15}'),
('espada_quebrada', 'Corte do Dao Partido', 'Arte marcial', 'Terrestre', 'metal', 3, null, '{"damage_base": 80, "armor_pen": 30}'),
('punho_meteoro', 'Punho do Meteoro Ardente', 'Arte marcial', 'Terrestre', 'fire', 3, null, '{"damage_base": 90, "burn_chance": 25}'),
('sabre_sombra', 'Dança do Sabre Sombrio', 'Arte marcial', 'Terrestre', 'darkness', 4, null, '{"damage_base": 85, "crit_chance_bonus": 15}'),
('corte_vazio', 'Corte Separador de Mundos', 'Arte marcial', 'Celestial', 'void', 5, null, '{"damage_base": 180, "ignore_defense": true}'),
('lanca_julgamento', 'Lança do Julgamento Divino', 'Arte marcial', 'Divina', 'light', 7, null, '{"damage_base": 350, "holy_damage": 50}'),
('punho_imperador', 'Punho Esmagador do Imperador', 'Arte marcial', 'Imortal', 'stellar', 8, null, '{"damage_base": 600, "stun_chance": 50}'),

-- ==========================================
-- 26 a 30: TÉCNICAS ESPIRITUAIS (Magia/Distância)
-- ==========================================
('esfera_agua', 'Esfera de Água Pesada', 'Técnica espiritual', 'Mortal', 'water', 1, null, '{"magic_damage": 20, "slow_chance": 10}'),
('flecha_chama', 'Flecha de Chama Espiritual', 'Técnica espiritual', 'Mortal', 'fire', 1, null, '{"magic_damage": 25, "burn_chance": 15}'),
('prisao_gelo', 'Prisão do Gelo Milenar', 'Técnica espiritual', 'Profunda', 'ice', 2, null, '{"magic_damage": 40, "freeze_chance": 20}'),
('chama_devoradora', 'Lótus de Fogo Devorador', 'Técnica espiritual', 'Terrestre', 'fire', 3, null, '{"magic_damage": 100, "burn_chance": 40}'),
('dragao_raio', 'Invocação do Dragão de Raio', 'Técnica espiritual', 'Celestial', 'thunder', 5, null, '{"magic_damage": 220, "chain_damage": 3}'),

-- ==========================================
-- 31 a 35: TÉCNICAS DEFENSIVAS
-- ==========================================
('pele_pedra', 'Pele de Pedra', 'Técnica defensiva', 'Mortal', 'earth', 1, null, '{"defense_bonus": 20}'),
('escudo_gelo', 'Escudo de Gelo Refletor', 'Técnica defensiva', 'Profunda', 'ice', 2, null, '{"defense_bonus": 45, "reflect_damage": 10}'),
('armadura_ouro', 'Armadura de Ouro Imaculado', 'Técnica defensiva', 'Terrestre', 'metal', 3, null, '{"defense_bonus": 100, "block_chance": 15}'),
('muralha_vento', 'Muralha do Vento Uivante', 'Técnica defensiva', 'Celestial', 'wind', 5, null, '{"defense_bonus": 250, "projectile_evasion": 40}'),
('protecao_estrelas', 'Proteção do Manto Estelar', 'Técnica defensiva', 'Divina', 'stellar', 7, null, '{"defense_bonus": 500, "invulnerability_chance": 5}'),

-- ==========================================
-- 36 a 40: TÉCNICAS DE MOVIMENTO / FUGA
-- ==========================================
('passos_vento', 'Passos do Vento Fantasma', 'Técnica de movimento', 'Mortal', 'wind', 1, null, '{"dodge_bonus": 10, "escape_chance": 10}'),
('salto_trovao', 'Salto do Trovão', 'Técnica de movimento', 'Profunda', 'thunder', 2, null, '{"dodge_bonus": 20, "initiative_bonus": 15}'),
('danca_folhas', 'Dança das Folhas Caídas', 'Técnica de movimento', 'Terrestre', 'wood', 3, null, '{"dodge_bonus": 35, "escape_chance": 30}'),
('caminho_sombras', 'Caminhar nas Sombras', 'Técnica de fuga', 'Celestial', 'darkness', 5, null, '{"escape_chance": 80, "stealth_duration": 3}'),
('passo_vazio', 'Passo de Encolhimento do Vazio', 'Técnica de movimento', 'Divina', 'void', 7, null, '{"dodge_bonus": 70, "teleportation": true}'),

-- ==========================================
-- 41 a 45: TÉCNICAS DE SUPORTE (Cura / Buffs)
-- ==========================================
('luz_curativa', 'Brilho da Lótus Branca', 'Técnica de suporte', 'Profunda', 'light', 1, null, '{"healing_base": 40}'),
('chuva_vital', 'Chuva da Vitalidade', 'Técnica de suporte', 'Terrestre', 'wood', 3, null, '{"healing_base": 120, "cure_poison": true}'),
('bencao_ancestral', 'Bênção do Espírito Ancestral', 'Técnica de suporte', 'Celestial', 'life', 5, null, '{"all_stats_bonus": 15, "duration": 5}'),
('renascimento_cinzas', 'Renascimento das Cinzas', 'Técnica de suporte', 'Divina', 'fire', 7, null, '{"auto_revive": true, "hp_restore_percent": 50}'),
('canto_sereia', 'Canto Purificador da Sereia', 'Técnica de suporte', 'Terrestre', 'water', 4, null, '{"clear_debuffs": true, "mental_heal": 50}'),

-- ==========================================
-- 46 a 48: TÉCNICAS OCULARES E PROFISSÕES
-- ==========================================
('olho_verdade', 'Olho Espiritual da Verdade', 'Técnica ocular', 'Terrestre', 'light', 3, null, '{"reveal_stealth": true, "perception_bonus": 30}'),
('chama_alquimica', 'Controle da Chama dos Nove Sóis', 'Técnica de alquimia', 'Terrestre', 'fire', 3, null, '{"alchemy_success_rate": 15, "pill_quality_bonus": 10}'),
('martelo_titã', 'Martelada do Titã Terrestre', 'Técnica de forja', 'Terrestre', 'earth', 3, null, '{"forge_success_rate": 15, "artifact_durability_bonus": 20}'),

-- ==========================================
-- 49 a 50: TÉCNICAS PROIBIDAS
-- ==========================================
('combustao_sangue', 'Combustão de Sangue Demoníaco', 'Técnica proibida', 'Celestial', 'blood', 5, null, '{"damage_mult": 3.0, "hp_cost_percent": 30, "backlash_chance": 20}'),
('devorar_almas', 'Sutra Devorador de Almas', 'Técnica proibida', 'Divina', 'death', 7, null, '{"lifesteal_percent": 50, "karma_penalty": 100, "tribulation_aggro": true}');

-- ==========================================
-- RITUAL DE ENTREGA (Manuais Iniciais)
-- Dá os 3 manuais básicos para todos os jogadores registrados
-- ==========================================
INSERT INTO player_techniques (player_id, technique_id, level, xp_current, is_equipped)
SELECT p.id, t.id, 0, 0, 0
FROM players p
CROSS JOIN techniques t
WHERE t.code IN ('resp_tartaruga', 'forja_ferro', 'mente_vazia')
AND NOT EXISTS (SELECT 1 FROM player_techniques pt WHERE pt.player_id = p.id AND pt.technique_id = t.id);
