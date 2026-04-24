-- LIMPANDO A TABELA PARA EVITAR DUPLICAÇÕES DURANTE O RE-PLANTIO
DELETE FROM items;

-- SEMENTES DE 50 ITENS DO MUNDO
INSERT INTO items (code, name, item_type, rarity, stackable, tradable, sellable_to_shop, base_value, metadata_json) VALUES

-- ==========================================
-- 1 a 10: ERVAS E PLANTAS (Alquimia/Coleta)
-- ==========================================
('erva_espiritual_comum', 'Erva Espiritual Comum', 'material', 'Comum', 1, 1, 1, 10, '{"description": "Uma erva que contém traços fracos de Qi."}'),
('flor_nevoa', 'Flor da Névoa', 'material', 'Incomum', 1, 1, 1, 35, '{"description": "Cresce apenas em locais úmidos. Usada em pílulas de Qi."}'),
('loto_sangue', 'Lótus de Sangue', 'material', 'Incomum', 1, 1, 1, 50, '{"description": "Possui propriedades curativas corporais intensas."}'),
('ginseng_fogo', 'Ginseng de Fogo Seco', 'material', 'Raro', 1, 1, 1, 120, '{"description": "Pulsa com calor. Base para pílulas do elemento fogo."}'),
('grama_vento_uivante', 'Grama do Vento Uivante', 'material', 'Raro', 1, 1, 1, 150, '{"description": "Leve como pluma, aumenta a afinidade com o vento."}'),
('cogumelo_fantasma', 'Cogumelo Ilusório Fantasma', 'material', 'Raro', 1, 1, 1, 180, '{"description": "Alucinógeno poderoso, usado em venenos e meditação de alma."}'),
('fruta_dragao_azure', 'Fruta Menor do Dragão Azure', 'material', 'Épico', 1, 1, 1, 500, '{"description": "Fortalece os ossos e os meridianos incrivelmente."}'),
('flor_gelo_milenar', 'Flor de Gelo Milenar', 'material', 'Épico', 1, 1, 1, 650, '{"description": "Congela o orvalho ao seu redor. Usada em elixires Yin."}'),
('raiz_alma_partida', 'Raiz da Alma Partida', 'material', 'Lendário', 1, 1, 1, 2000, '{"description": "Erva raríssima capaz de curar ferimentos graves na alma."}'),
('erva_estelar_divina', 'Grama Estelar Imaculada', 'material', 'Celestial', 1, 1, 1, 8000, '{"description": "Absorve a luz das estrelas há éons. Um tesouro indescritível."}'),

-- ==========================================
-- 11 a 20: MINÉRIOS E METAIS (Forja)
-- ==========================================
('minerio_ferro_negro', 'Minério de Ferro Negro', 'material', 'Comum', 1, 1, 1, 15, '{"description": "Pesado e resistente, excelente para forja básica."}'),
('cobre_espiritual', 'Cobre Espiritual', 'material', 'Comum', 1, 1, 1, 20, '{"description": "Conduz Qi moderadamente bem."}'),
('prata_lunar', 'Prata Lunar Bruta', 'material', 'Incomum', 1, 1, 1, 60, '{"description": "Minério que brilha no escuro, repele impurezas."}'),
('cristal_fogo', 'Cristal de Fogo Estilhaçado', 'material', 'Incomum', 1, 1, 1, 80, '{"description": "Aquece a pele ao toque. Usado para criar armas ígneas."}'),
('jade_fria', 'Fragmento de Jade Fria', 'material', 'Raro', 1, 1, 1, 200, '{"description": "Acalma a mente. Ótima para forjar talismãs de proteção."}'),
('aco_estelar', 'Aço Estelar', 'material', 'Raro', 1, 1, 1, 250, '{"description": "Metal forjado por pressões extremas. Extremamente cortante."}'),
('ouro_purpura', 'Ouro Púrpura Profundo', 'material', 'Épico', 1, 1, 1, 800, '{"description": "O material preferido da realeza mortal e de seitas ricas."}'),
('ferro_meteoro', 'Ferro de Meteoro Caído', 'material', 'Épico', 1, 1, 1, 1200, '{"description": "Traz consigo a densidade do espaço sideral."}'),
('essencia_terra', 'Essência Pura da Terra', 'material', 'Lendário', 1, 1, 1, 3500, '{"description": "O coração de uma montanha. Indestrutível por meios comuns."}'),
('cristal_caos', 'Cristal do Caos Primordial', 'material', 'Celestial', 1, 1, 1, 10000, '{"description": "Contém as leis da criação e destruição."}'),

-- ==========================================
-- 21 a 30: MATERIAIS DE BESTAS (Drops/Exploração)
-- ==========================================
('osso_besta', 'Osso de Besta Selvagem', 'material', 'Comum', 1, 1, 1, 8, '{"description": "Pode ser triturado para alquimia ou formações."}'),
('carne_besta', 'Carne de Besta Espiritual', 'material', 'Comum', 1, 1, 1, 12, '{"description": "Rica em proteínas e traços de Qi. Ótima para cozinhar."}'),
('sangue_lobo_sombra', 'Frasco de Sangue do Lobo Sombrio', 'material', 'Incomum', 1, 1, 1, 45, '{"description": "Sangue espesso usado para desenhar talismãs."}'),
('garra_urso', 'Garra de Urso Terrestre', 'material', 'Incomum', 1, 1, 1, 55, '{"description": "Dura como pedra, usada em flechas ou adagas."}'),
('escama_serpente_fogo', 'Escama da Serpente de Fogo', 'material', 'Raro', 1, 1, 1, 150, '{"description": "Retém calor. Usada para forjar armaduras leves."}'),
('pena_aguia_vento', 'Pena da Águia do Vento', 'material', 'Raro', 1, 1, 1, 160, '{"description": "Torna qualquer equipamento mais leve."}'),
('chifre_rinoceronte', 'Chifre de Rinoceronte de Ferro', 'material', 'Épico', 1, 1, 1, 600, '{"description": "Possui propriedades afrodisíacas e de cura extrema."}'),
('nucleo_besta_baixo', 'Núcleo de Besta (Baixo Nível)', 'core', 'Raro', 1, 1, 1, 300, '{"description": "A fonte de energia de uma besta mágica comum."}'),
('nucleo_besta_medio', 'Núcleo de Besta (Médio Nível)', 'core', 'Épico', 1, 1, 1, 1500, '{"description": "Energia espiritual densa. Muito cobiçado por alquimistas."}'),
('sangue_fenix_impuro', 'Gota de Sangue de Fênix Impuro', 'material', 'Lendário', 1, 1, 1, 5000, '{"description": "Até mesmo impuro, possui o poder de renascimento."}'),

-- ==========================================
-- 31 a 40: CONSUMÍVEIS E PÍLULAS (Uso/Recuperação)
-- ==========================================
('pilula_recuperacao_menor', 'Pílula de Recuperação Menor', 'consumable', 'Comum', 1, 1, 1, 50, '{"description": "Restaura 30 HP.", "restore_hp": 30}'),
('pilula_qi_menor', 'Pílula de Condensação de Qi Menor', 'consumable', 'Incomum', 1, 1, 1, 100, '{"description": "Restaura 25 Qi.", "restore_qi": 25}'),
('pilula_vigor_sanguineo', 'Pílula do Vigor Sanguíneo', 'consumable', 'Incomum', 1, 1, 1, 120, '{"description": "Restaura 30 de Energia Corporal e reduz 5 Fadiga.", "restore_body": 30, "reduce_fatigue": 5}'),
('pilula_alma_clara', 'Elixir da Mente Clara', 'consumable', 'Raro', 1, 1, 1, 350, '{"description": "Restaura 20 Alma e ajuda a focar a mente.", "restore_soul": 20}'),
('pilula_purificacao_ossea', 'Pílula de Purificação Óssea', 'consumable', 'Raro', 1, 1, 1, 500, '{"description": "Expulsa as impurezas mortais do corpo."}'),
('pilula_yang_ardente', 'Pílula Yang Ardente', 'consumable', 'Épico', 1, 1, 1, 1200, '{"description": "Fornece energia yang pura. Perigosa se consumida em excesso."}'),
('pilula_yin_extrema', 'Pílula Yin Extrema', 'consumable', 'Épico', 1, 1, 1, 1200, '{"description": "Fornece energia yin pura. Pode congelar os meridianos."}'),
('pilula_falsa_morte', 'Pílula da Falsa Morte', 'consumable', 'Lendário', 1, 1, 1, 4500, '{"description": "Pára o coração por 7 dias, ocultando a aura perfeitamente."}'),
('pilula_avanco_espiritual', 'Pílula do Avanço Espiritual', 'consumable', 'Lendário', 1, 1, 1, 5000, '{"description": "Aumenta a chance de sucesso ao tentar romper um gargalo."}'),
('pilula_reversao_inferior', 'Pílula de Reversão do Destino (Inferior)', 'consumable', 'Celestial', 1, 1, 1, 15000, '{"description": "Pode rerrolar o clã ou afinidade do cultivador."}'),

-- ==========================================
-- 41 a 45: ARMAS (Equipamento)
-- ==========================================
('espada_ferro_negro', 'Espada Longa de Ferro Negro', 'weapon', 'Comum', 0, 1, 1, 150, '{"description": "Uma espada robusta e pesada.", "attack_bonus": 10}'),
('lanca_madeira_ferro', 'Lança de Madeira de Ferro', 'weapon', 'Comum', 0, 1, 1, 140, '{"description": "Feita com a resistente madeira de ferro.", "attack_bonus": 12, "durability": 50}'),
('sabre_vento_cortante', 'Sabre do Vento Cortante', 'weapon', 'Incomum', 0, 1, 1, 350, '{"description": "Um sabre curvo e extremamente ágil.", "attack_bonus": 25, "agility_bonus": 2}'),
('arco_osso_besta', 'Arco Curvo de Osso de Besta', 'weapon', 'Incomum', 0, 1, 1, 320, '{"description": "Exige muita força para ser puxado.", "attack_bonus": 22, "range_bonus": 5}'),
('espada_gelida_lua', 'Espada Gélida da Lua Fria', 'weapon', 'Raro', 0, 1, 1, 900, '{"description": "Forjada no gelo. Retarda os movimentos do inimigo.", "attack_bonus": 55, "ice_damage": 10}'),

-- ==========================================
-- 46 a 50: ARMADURAS E VESTES (Equipamento)
-- ==========================================
('manto_discípulo', 'Manto Simples de Discípulo', 'armor', 'Comum', 0, 1, 1, 120, '{"description": "Roupa resistente a cortes leves.", "defense_bonus": 5}'),
('armadura_couro_lobo', 'Armadura de Couro de Lobo', 'armor', 'Comum', 0, 1, 1, 180, '{"description": "Resistente e quente, ideal para regiões frias.", "defense_bonus": 12}'),
('veste_seda_espiritual', 'Veste de Seda Espiritual', 'armor', 'Incomum', 0, 1, 1, 400, '{"description": "Levemente imbuída de Qi. Protege contra golpes mágicos.", "defense_bonus": 8, "magic_resist": 15}'),
('armadura_escamas_fogo', 'Peitoral de Escamas de Fogo', 'armor', 'Raro', 0, 1, 1, 950, '{"description": "Forjada com escamas de serpente. Imune a chamas comuns.", "defense_bonus": 45, "fire_resist": 25}'),
('manto_sombras', 'Manto Oculto das Sombras', 'armor', 'Épico', 0, 1, 1, 2200, '{"description": "Dificulta a percepção inimiga, excelente para emboscadas.", "defense_bonus": 60, "dodge_bonus": 10}');
