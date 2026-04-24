-- SEMENTES DE RAÇAS
INSERT INTO races (code, name, tier, description, effects_json) VALUES
('human', 'Humano', 'Comum', 'A raça mais numerosa. Equilibrada e com grande capacidade de compreensão do Dao.', '{"comprehension_mult": 1.05}'),
('half_spirit', 'Meio-Espírito', 'Incomum', 'Nascidos da união entre mortais e seres da natureza. Possuem Qi mais denso.', '{"qi_mult": 1.08, "spirit_bonus": 5, "constitution_mult": 0.97}'),
('beastborn', 'Bestial', 'Incomum', 'Possuem o sangue de bestas ancestrais, concedendo grande vigor físico.', '{"strength_mult": 1.08, "constitution_bonus": 6, "intelligence_mult": 0.95}'),
('shadowborn', 'Sombrio', 'Raro', 'Habitantes dos abismos, possuem afinidade natural com ilusões e trevas.', '{"perception_mult": 1.07, "willpower_bonus": 5, "charisma_mult": 0.96}'),
('draconic', 'Dracônico', 'Épico', 'Carregam a linhagem adormecida dos antigos Dragões. Corpo formidável e presença esmagadora.', '{"strength_mult": 1.10, "charisma_bonus": 6, "spirit_cultivation_mult": 0.96}'),
('phoenix', 'Fênix', 'Épico', 'Renascidos das cinzas cósmicas. Excepcional regeneração e afinidade ao fogo.', '{"regeneration_mult": 1.08, "spirit_bonus": 6, "ice_resist_mult": 0.95}'),
('fallen_celestial', 'Celestial Caído', 'Lendário', 'Almas exiladas do Reino Divino. Crescimento absurdo, mas atraem a fúria dos céus.', '{"all_gain_mult": 1.05, "tribulation_chance_mult": 1.08}'),
('void_nascent', 'Vazio Nascente', 'Divino', 'Entidades raras nascidas onde as leis do mundo não existem.', '{"dao_comprehension_mult": 1.12, "initial_stability_mult": 0.90}');

-- SEMENTES DE CLÃS
INSERT INTO clans (code, name, tier, description, effects_json) VALUES
('jade_river', 'Clã do Rio Jade', 'Comum', 'Um clã focado em harmonia e coleta de recursos naturais.', '{"gather_mult": 1.05}'),
('black_mountain', 'Clã da Montanha Negra', 'Comum', 'Praticam o refino corporal extremo usando o peso das montanhas.', '{"physical_def_mult": 1.05}'),
('cold_moon', 'Clã da Lua Fria', 'Incomum', 'Mestres no silêncio e nas artes do gelo extremo.', '{"ice_tech_mult": 1.05}'),
('scarlet_spear', 'Clã da Lança Escarlate', 'Incomum', 'Uma linhagem de guerreiros ferozes, focados em dano físico perfurante.', '{"pierce_weapon_mult": 1.05}'),
('nine_suns', 'Clã dos Nove Sóis', 'Raro', 'Dedicam-se à alquimia e ao controle absoluto do Fogo Espiritual.', '{"fire_tech_mult": 1.06, "alchemy_mult": 1.06}'),
('violet_mist', 'Clã da Névoa Violeta', 'Raro', 'Especialistas em emboscadas, venenos e formações ilusórias.', '{"illusion_tech_mult": 1.06, "perception_mult": 1.06}'),
('thunder_pavilion', 'Pavilhão do Trovão', 'Épico', 'Os mais rápidos do continente, governando as leis do relâmpago.', '{"thunder_tech_mult": 1.08, "movement_mult": 1.08}'),
('golden_lotus', 'Clã do Lótus Dourado', 'Épico', 'Um clã sagrado com técnicas de purificação absolutas.', '{"light_tech_mult": 1.08, "recovery_mult": 1.08}'),
('broken_sword', 'Clã da Espada Quebrada', 'Lendário', 'Exilados obcecados pelo Dao da Espada e pelo combate mortal.', '{"sword_tech_mult": 1.10, "attack_mult": 1.10}'),
('primordial_lineage', 'Linhagem Primordial', 'Antigo', 'Carregam os segredos do início do universo em suas veias.', '{"hybrid_progression_mult": 1.10}');

-- SEMENTES DE RAÍZES ESPIRITUAIS
INSERT INTO spiritual_roots (code, name, tier, root_type, effects_json) VALUES
('root_metal', 'Raiz de Metal', 'Comum', 'metal', '{"metal_affinity": 1.10}'),
('root_wood', 'Raiz de Madeira', 'Comum', 'wood', '{"wood_affinity": 1.10}'),
('root_water', 'Raiz de Água', 'Comum', 'water', '{"water_affinity": 1.10}'),
('root_fire', 'Raiz de Fogo', 'Comum', 'fire', '{"fire_affinity": 1.10}'),
('root_earth', 'Raiz de Terra', 'Comum', 'earth', '{"earth_affinity": 1.10}'),
('root_wind', 'Raiz de Vento', 'Incomum', 'wind', '{"wind_affinity": 1.12}'),
('root_thunder', 'Raiz de Trovão', 'Incomum', 'thunder', '{"thunder_affinity": 1.12}'),
('root_ice', 'Raiz de Gelo', 'Incomum', 'ice', '{"ice_affinity": 1.12}'),
('root_light', 'Raiz de Luz', 'Raro', 'light', '{"light_affinity": 1.15}'),
('root_darkness', 'Raiz de Trevas', 'Raro', 'darkness', '{"darkness_affinity": 1.15}'),
('root_life', 'Raiz da Vida', 'Lendário', 'life', '{"healing_affinity": 1.20}'),
('root_death', 'Raiz da Morte', 'Lendário', 'death', '{"lethal_affinity": 1.20}'),
('root_star', 'Raiz Estelar', 'Lendário', 'stellar', '{"stellar_affinity": 1.20}'),
('root_void', 'Raiz do Vazio', 'Celestial', 'void', '{"void_affinity": 1.25}');

-- SEMENTES DE CORPOS DIVINOS
INSERT INTO divine_bodies (code, name, tier, description, effects_json) VALUES
('black_iron_body', 'Corpo de Ferro Negro', 'Incomum', 'A pele do cultivador é dura como aço temperado.', '{"body_def_mult": 1.08}'),
('burning_yang_body', 'Corpo Yang Ardente', 'Raro', 'Exala um calor insuportável e possui vigor infinito.', '{"fire_affinity_mult": 1.08, "vigor_mult": 1.08}'),
('extreme_yin_body', 'Corpo Yin Extremo', 'Raro', 'Atrai as energias frias e espirituais com facilidade.', '{"ice_affinity_mult": 1.08, "soul_mult": 1.08}'),
('jade_bones', 'Ossos de Jade', 'Raro', 'Ossos purificados e inquebráveis que aumentam a expectativa de vida.', '{"hp_max_mult": 1.10}'),
('celestial_bones', 'Ossos Celestiais', 'Sagrado', 'Resistem até mesmo à fúria dos relâmpagos das tribulações.', '{"tribulation_resist_mult": 1.10}'),
('solar_saint_body', 'Corpo Santo Solar', 'Sagrado', 'Absorve a luz do sol para fechar feridas rapidamente.', '{"light_affinity_mult": 1.10, "recovery_mult": 1.10}'),
('azure_dragon_body', 'Corpo Divino do Dragão Azure', 'Divino', 'Presença aterradora que suprime feras e mortais.', '{"body_mult": 1.12, "authority_mult": 1.12}'),
('chaos_body', 'Corpo Imaculado do Caos', 'Divino', 'Permite o cultivo simultâneo de forças opostas sem penalidades.', '{"hybrid_growth_mult": 1.12}'),
('heaven_demon_body', 'Corpo do Demônio Celestial', 'Imortal', 'Devora energias do ambiente, trocando karma por poder absoluto.', '{"attack_mult": 1.15, "karma_gain_mult": -1.2}'),
('tribulation_body', 'Corpo da Tribulação', 'Imortal', 'Atrai o perigo em troca de fortunas indescritíveis.', '{"luck_mult": 1.20, "danger_mult": 1.20}');

-- SEMENTES DE PROFISSÕES
INSERT INTO professions (code, name, category, description) VALUES
('pill_master', 'Mestre das Pílulas', 'craft', 'Refino de ervas em pílulas medicinais e elixires.'),
('forge_master', 'Mestre de Forja', 'craft', 'Trabalha minérios espirituais para forjar armas e armaduras.'),
('formation_master', 'Mestre de Formação', 'craft', 'Molda as leis do universo para criar barreiras e selos.'),
('talisman_master', 'Mestre de Talismãs', 'craft', 'Usa o Qi como tinta para aprisionar feitiços em pergaminhos.'),
('puppet_master', 'Mestre de Marionetes', 'craft', 'Dá vida a constructos usando almas bestiais e núcleos espirituais.'),
('beast_master', 'Mestre de Bestas', 'gather', 'Domina, procria e vincula feras espirituais.'),
('spiritual_cook', 'Mestre de Culinária Espiritual', 'craft', 'Gera buffs poderosos temporários combinando carnes e ervas.'),
('weaver', 'Mestre de Tecelagem Espiritual', 'craft', 'Cria mantos mágicos e bolsas de armazenamento usando seda cósmica.'),
('herbalist', 'Herborista', 'gather', 'Coleta plantas raras da natureza selvagem.'),
('miner', 'Minerador Espiritual', 'gather', 'Extrai pedras e minérios preciosos do fundo da terra.'),
('hunter', 'Caçador', 'gather', 'Rastreia e abate bestas pelos seus recursos brutos.');

-- SEMENTES DE REGIÕES INICIAIS
INSERT INTO regions (code, name, danger_level, min_realm_index, max_realm_index, event_table_json) VALUES
('mortal_village', 'Vila Mortal', 1, 1, 2, '{"resource_common":25,"monster_common":8,"npc":12}'),
('mist_forest', 'Floresta Nebulosa', 2, 1, 3, '{"resource_common":18,"monster_common":16,"herb":10,"encounter":2}'),
('bone_valley', 'Vale dos Ossos', 3, 2, 4, '{"monster_common":10,"monster_elite":12,"ruin":4,"treasure":2}'),
('thunder_mountain', 'Montanha do Trovão', 4, 3, 5, '{"monster_elite":15,"mineral":10,"ambush":5}'),
('mirror_lake', 'Lago Espelhado', 3, 2, 4, '{"herb":15,"npc":10,"encounter":5}'),
('minor_immortal_ruins', 'Ruínas Imortais Menores', 5, 4, 6, '{"treasure":10,"ruin":15,"monster_elite":20,"heritage":1}');
