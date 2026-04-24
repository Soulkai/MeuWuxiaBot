-- LIMPANDO A TABELA PARA EVITAR DUPLICAÇÕES DURANTE O RE-PLANTIO
DELETE FROM recipes;

-- AS 150 RECEITAS DA CRIAÇÃO
INSERT INTO recipes (code, name, profession_id, rarity, difficulty, inputs_json, outputs_json) VALUES

-- ==========================================
-- MESTRE DAS PÍLULAS (20 Receitas)
-- ==========================================
('rec_pm_01', 'Pílula de Recuperação (Pura)', (SELECT id FROM professions WHERE code = 'pill_master'), 'Comum', 10, '{"erva_espiritual_comum": 3}', '{"pilula_recuperacao_menor": 1}'),
('rec_pm_02', 'Pílula de Recuperação (Bestial)', (SELECT id FROM professions WHERE code = 'pill_master'), 'Comum', 15, '{"erva_espiritual_comum": 1, "osso_besta": 2}', '{"pilula_recuperacao_menor": 1}'),
('rec_pm_03', 'Pílula de Qi Menor (Base Névoa)', (SELECT id FROM professions WHERE code = 'pill_master'), 'Incomum', 20, '{"flor_nevoa": 2}', '{"pilula_qi_menor": 1}'),
('rec_pm_04', 'Pílula de Qi Menor (Híbrida)', (SELECT id FROM professions WHERE code = 'pill_master'), 'Incomum', 22, '{"flor_nevoa": 1, "erva_espiritual_comum": 2}', '{"pilula_qi_menor": 1}'),
('rec_pm_05', 'Pílula do Vigor Sanguíneo', (SELECT id FROM professions WHERE code = 'pill_master'), 'Incomum', 25, '{"loto_sangue": 2, "osso_besta": 1}', '{"pilula_vigor_sanguineo": 1}'),
('rec_pm_06', 'Pílula do Vigor (Aprimorada)', (SELECT id FROM professions WHERE code = 'pill_master'), 'Incomum', 28, '{"loto_sangue": 1, "sangue_lobo_sombra": 1}', '{"pilula_vigor_sanguineo": 2}'),
('rec_pm_07', 'Elixir da Mente Clara (Base Cogumelo)', (SELECT id FROM professions WHERE code = 'pill_master'), 'Raro', 40, '{"cogumelo_fantasma": 2, "flor_nevoa": 1}', '{"pilula_alma_clara": 1}'),
('rec_pm_08', 'Elixir da Mente Clara (Puro)', (SELECT id FROM professions WHERE code = 'pill_master'), 'Raro', 45, '{"cogumelo_fantasma": 1, "jade_fria": 1}', '{"pilula_alma_clara": 1}'),
('rec_pm_09', 'Pílula de Purificação Óssea', (SELECT id FROM professions WHERE code = 'pill_master'), 'Raro', 50, '{"loto_sangue": 2, "fruta_dragao_azure": 1}', '{"pilula_purificacao_ossea": 1}'),
('rec_pm_10', 'Pílula Purificadora (Forte)', (SELECT id FROM professions WHERE code = 'pill_master'), 'Raro', 55, '{"garra_urso": 2, "fruta_dragao_azure": 1}', '{"pilula_purificacao_ossea": 1}'),
('rec_pm_11', 'Pílula Yang Ardente (Ginseng)', (SELECT id FROM professions WHERE code = 'pill_master'), 'Épico', 70, '{"ginseng_fogo": 2, "cristal_fogo": 1}', '{"pilula_yang_ardente": 1}'),
('rec_pm_12', 'Pílula Yang Ardente (Escama)', (SELECT id FROM professions WHERE code = 'pill_master'), 'Épico', 75, '{"escama_serpente_fogo": 2, "loto_sangue": 1}', '{"pilula_yang_ardente": 1}'),
('rec_pm_13', 'Pílula Yin Extrema', (SELECT id FROM professions WHERE code = 'pill_master'), 'Épico', 75, '{"flor_gelo_milenar": 2, "jade_fria": 1}', '{"pilula_yin_extrema": 1}'),
('rec_pm_14', 'Pílula Yin Extrema (Fantasma)', (SELECT id FROM professions WHERE code = 'pill_master'), 'Épico', 78, '{"flor_gelo_milenar": 1, "cogumelo_fantasma": 2}', '{"pilula_yin_extrema": 1}'),
('rec_pm_15', 'Pílula da Falsa Morte', (SELECT id FROM professions WHERE code = 'pill_master'), 'Lendário', 85, '{"cogumelo_fantasma": 3, "sangue_lobo_sombra": 2}', '{"pilula_falsa_morte": 1}'),
('rec_pm_16', 'Pílula do Avanço Espiritual (Núcleo)', (SELECT id FROM professions WHERE code = 'pill_master'), 'Lendário', 90, '{"nucleo_besta_medio": 1, "raiz_alma_partida": 1}', '{"pilula_avanco_espiritual": 1}'),
('rec_pm_17', 'Pílula do Avanço Espiritual (Pura)', (SELECT id FROM professions WHERE code = 'pill_master'), 'Lendário', 92, '{"raiz_alma_partida": 2, "fruta_dragao_azure": 1}', '{"pilula_avanco_espiritual": 1}'),
('rec_pm_18', 'Pílula de Reversão Inferior (Erva Divina)', (SELECT id FROM professions WHERE code = 'pill_master'), 'Celestial', 98, '{"erva_estelar_divina": 1, "cristal_caos": 1}', '{"pilula_reversao_inferior": 1}'),
('rec_pm_19', 'Pílula de Reversão Inferior (Sangue)', (SELECT id FROM professions WHERE code = 'pill_master'), 'Celestial', 99, '{"sangue_fenix_impuro": 1, "raiz_alma_partida": 2}', '{"pilula_reversao_inferior": 1}'),
('rec_pm_20', 'Essência de Recuperação Rápida', (SELECT id FROM professions WHERE code = 'pill_master'), 'Incomum', 25, '{"erva_espiritual_comum": 5, "loto_sangue": 1}', '{"pilula_recuperacao_menor": 3}'),

-- ==========================================
-- MESTRE DE FORJA (20 Receitas)
-- ==========================================
('rec_fm_01', 'Espada Longa de Ferro Negro', (SELECT id FROM professions WHERE code = 'forge_master'), 'Comum', 15, '{"minerio_ferro_negro": 3}', '{"espada_ferro_negro": 1}'),
('rec_fm_02', 'Espada Longa de Ferro (Cabo de Osso)', (SELECT id FROM professions WHERE code = 'forge_master'), 'Comum', 18, '{"minerio_ferro_negro": 2, "osso_besta": 2}', '{"espada_ferro_negro": 1}'),
('rec_fm_03', 'Lança de Madeira de Ferro', (SELECT id FROM professions WHERE code = 'forge_master'), 'Comum', 15, '{"cobre_espiritual": 1, "osso_besta": 2}', '{"lanca_madeira_ferro": 1}'),
('rec_fm_04', 'Lança de Madeira (Ponta de Garra)', (SELECT id FROM professions WHERE code = 'forge_master'), 'Comum', 20, '{"cobre_espiritual": 1, "garra_urso": 1}', '{"lanca_madeira_ferro": 1}'),
('rec_fm_05', 'Sabre do Vento Cortante', (SELECT id FROM professions WHERE code = 'forge_master'), 'Incomum', 30, '{"cobre_espiritual": 2, "pena_aguia_vento": 1}', '{"sabre_vento_cortante": 1}'),
('rec_fm_06', 'Sabre do Vento Cortante (Leve)', (SELECT id FROM professions WHERE code = 'forge_master'), 'Incomum', 35, '{"prata_lunar": 1, "pena_aguia_vento": 2}', '{"sabre_vento_cortante": 1}'),
('rec_fm_07', 'Arco Curvo de Osso de Besta', (SELECT id FROM professions WHERE code = 'forge_master'), 'Incomum', 30, '{"osso_besta": 4, "carne_besta": 1}', '{"arco_osso_besta": 1}'),
('rec_fm_08', 'Arco de Osso (Reforçado)', (SELECT id FROM professions WHERE code = 'forge_master'), 'Incomum', 35, '{"osso_besta": 3, "cobre_espiritual": 1}', '{"arco_osso_besta": 1}'),
('rec_fm_09', 'Espada Gélida da Lua Fria', (SELECT id FROM professions WHERE code = 'forge_master'), 'Raro', 50, '{"prata_lunar": 3, "jade_fria": 2}', '{"espada_gelida_lua": 1}'),
('rec_fm_10', 'Espada Gélida (Núcleo Frio)', (SELECT id FROM professions WHERE code = 'forge_master'), 'Raro', 55, '{"prata_lunar": 2, "nucleo_besta_baixo": 1}', '{"espada_gelida_lua": 1}'),
('rec_fm_11', 'Armadura de Couro de Lobo', (SELECT id FROM professions WHERE code = 'forge_master'), 'Comum', 20, '{"sangue_lobo_sombra": 1, "carne_besta": 2}', '{"armadura_couro_lobo": 1}'),
('rec_fm_12', 'Peitoral de Escamas de Fogo', (SELECT id FROM professions WHERE code = 'forge_master'), 'Raro', 60, '{"escama_serpente_fogo": 4, "cristal_fogo": 1}', '{"armadura_escamas_fogo": 1}'),
('rec_fm_13', 'Peitoral de Fogo (Reforçado)', (SELECT id FROM professions WHERE code = 'forge_master'), 'Raro', 65, '{"escama_serpente_fogo": 3, "cobre_espiritual": 2}', '{"armadura_escamas_fogo": 1}'),
('rec_fm_14', 'Refino de Cobre Espiritual', (SELECT id FROM professions WHERE code = 'forge_master'), 'Incomum', 25, '{"minerio_ferro_negro": 5}', '{"cobre_espiritual": 1}'),
('rec_fm_15', 'Refino de Prata Lunar', (SELECT id FROM professions WHERE code = 'forge_master'), 'Raro', 40, '{"cobre_espiritual": 4, "jade_fria": 1}', '{"prata_lunar": 1}'),
('rec_fm_16', 'Lâmina de Aço Estelar', (SELECT id FROM professions WHERE code = 'forge_master'), 'Épico', 70, '{"aco_estelar": 3, "nucleo_besta_medio": 1}', '{"lâmina_estelar_nova": 1}'),
('rec_fm_17', 'Escudo de Ouro Púrpura', (SELECT id FROM professions WHERE code = 'forge_master'), 'Épico', 75, '{"ouro_purpura": 4, "essencia_terra": 1}', '{"escudo_purpura_novo": 1}'),
('rec_fm_18', 'Armadura Meteórica', (SELECT id FROM professions WHERE code = 'forge_master'), 'Lendário', 90, '{"ferro_meteoro": 5, "sangue_fenix_impuro": 1}', '{"armadura_meteoro_nova": 1}'),
('rec_fm_19', 'Adaga do Caos', (SELECT id FROM professions WHERE code = 'forge_master'), 'Celestial', 95, '{"cristal_caos": 2, "aco_estelar": 2}', '{"adaga_caos_nova": 1}'),
('rec_fm_20', 'Espada Longa (Lote de Forja)', (SELECT id FROM professions WHERE code = 'forge_master'), 'Comum', 30, '{"minerio_ferro_negro": 10}', '{"espada_ferro_negro": 3}'),

-- ==========================================
-- MESTRE DE TECELAGEM ESPIRITUAL (20 Receitas)
-- ==========================================
('rec_wv_01', 'Manto Simples de Discípulo', (SELECT id FROM professions WHERE code = 'weaver'), 'Comum', 10, '{"erva_espiritual_comum": 4}', '{"manto_discípulo": 1}'),
('rec_wv_02', 'Manto de Discípulo (Tingido)', (SELECT id FROM professions WHERE code = 'weaver'), 'Comum', 12, '{"erva_espiritual_comum": 2, "flor_nevoa": 1}', '{"manto_discípulo": 1}'),
('rec_wv_03', 'Veste de Seda Espiritual', (SELECT id FROM professions WHERE code = 'weaver'), 'Incomum', 25, '{"flor_nevoa": 3, "loto_sangue": 1}', '{"veste_seda_espiritual": 1}'),
('rec_wv_04', 'Veste de Seda (Fio de Cobre)', (SELECT id FROM professions WHERE code = 'weaver'), 'Incomum', 28, '{"flor_nevoa": 2, "cobre_espiritual": 1}', '{"veste_seda_espiritual": 1}'),
('rec_wv_05', 'Manto Oculto das Sombras', (SELECT id FROM professions WHERE code = 'weaver'), 'Épico', 60, '{"sangue_lobo_sombra": 3, "cogumelo_fantasma": 2}', '{"manto_sombras": 1}'),
('rec_wv_06', 'Manto das Sombras (Asa Águia)', (SELECT id FROM professions WHERE code = 'weaver'), 'Épico', 65, '{"pena_aguia_vento": 4, "cogumelo_fantasma": 1}', '{"manto_sombras": 1}'),
('rec_wv_07', 'Bolsa Espacial Menor', (SELECT id FROM professions WHERE code = 'weaver'), 'Incomum', 30, '{"carne_besta": 3, "flor_nevoa": 2}', '{"bolsa_espacial_menor": 1}'),
('rec_wv_08', 'Bolsa Espacial Menor (Couro Lobo)', (SELECT id FROM professions WHERE code = 'weaver'), 'Incomum', 35, '{"sangue_lobo_sombra": 2, "minerio_ferro_negro": 2}', '{"bolsa_espacial_menor": 1}'),
('rec_wv_09', 'Bolsa Espacial Média', (SELECT id FROM professions WHERE code = 'weaver'), 'Raro', 55, '{"garra_urso": 2, "jade_fria": 1}', '{"bolsa_espacial_media": 1}'),
('rec_wv_10', 'Bolsa Espacial Média (Vento)', (SELECT id FROM professions WHERE code = 'weaver'), 'Raro', 58, '{"pena_aguia_vento": 3, "prata_lunar": 1}', '{"bolsa_espacial_media": 1}'),
('rec_wv_11', 'Bolsa Espacial Maior', (SELECT id FROM professions WHERE code = 'weaver'), 'Épico', 75, '{"chifre_rinoceronte": 1, "ouro_purpura": 2}', '{"bolsa_espacial_maior": 1}'),
('rec_wv_12', 'Manto do Vento Uivante', (SELECT id FROM professions WHERE code = 'weaver'), 'Raro', 50, '{"grama_vento_uivante": 4, "pena_aguia_vento": 2}', '{"manto_vento_novo": 1}'),
('rec_wv_13', 'Cinto de Força Bestial', (SELECT id FROM professions WHERE code = 'weaver'), 'Incomum', 30, '{"osso_besta": 2, "carne_besta": 2}', '{"cinto_bestial_novo": 1}'),
('rec_wv_14', 'Cinto de Força (Garra)', (SELECT id FROM professions WHERE code = 'weaver'), 'Incomum', 35, '{"garra_urso": 1, "carne_besta": 2}', '{"cinto_bestial_novo": 1}'),
('rec_wv_15', 'Botas de Escamas Térmicas', (SELECT id FROM professions WHERE code = 'weaver'), 'Raro', 50, '{"escama_serpente_fogo": 3, "cristal_fogo": 1}', '{"botas_fogo_novo": 1}'),
('rec_wv_16', 'Botas do Caminhar Frio', (SELECT id FROM professions WHERE code = 'weaver'), 'Raro', 55, '{"flor_gelo_milenar": 2, "jade_fria": 1}', '{"botas_gelo_novo": 1}'),
('rec_wv_17', 'Veste Imperial de Ouro', (SELECT id FROM professions WHERE code = 'weaver'), 'Épico', 80, '{"ouro_purpura": 3, "fruta_dragao_azure": 1}', '{"veste_imperial_nova": 1}'),
('rec_wv_18', 'Fita de Prender Cabelo (Alma)', (SELECT id FROM professions WHERE code = 'weaver'), 'Lendário', 90, '{"raiz_alma_partida": 2, "essencia_terra": 1}', '{"fita_alma_nova": 1}'),
('rec_wv_19', 'Manto Imaculado do Caos', (SELECT id FROM professions WHERE code = 'weaver'), 'Celestial', 99, '{"cristal_caos": 2, "erva_estelar_divina": 1}', '{"manto_caos_novo": 1}'),
('rec_wv_20', 'Rolo de Fio Espiritual', (SELECT id FROM professions WHERE code = 'weaver'), 'Comum', 15, '{"erva_espiritual_comum": 5}', '{"fio_espiritual_novo": 3}'),

-- ==========================================
-- MESTRE DE CULINÁRIA ESPIRITUAL (20 Receitas)
-- ==========================================
('rec_sc_01', 'Espeto de Carne Bestial', (SELECT id FROM professions WHERE code = 'spiritual_cook'), 'Comum', 5, '{"carne_besta": 2, "erva_espiritual_comum": 1}', '{"espeto_bestial_novo": 1}'),
('rec_sc_02', 'Sopa Revigorante Clara', (SELECT id FROM professions WHERE code = 'spiritual_cook'), 'Comum', 10, '{"flor_nevoa": 1, "erva_espiritual_comum": 2}', '{"sopa_clara_nova": 1}'),
('rec_sc_03', 'Sopa de Sangue (Vigor)', (SELECT id FROM professions WHERE code = 'spiritual_cook'), 'Incomum', 20, '{"loto_sangue": 1, "carne_besta": 2}', '{"sopa_sangue_nova": 1}'),
('rec_sc_04', 'Sopa de Sangue Lobo', (SELECT id FROM professions WHERE code = 'spiritual_cook'), 'Incomum', 25, '{"sangue_lobo_sombra": 1, "carne_besta": 2}', '{"sopa_sangue_nova": 1}'),
('rec_sc_05', 'Chá de Flor de Névoa', (SELECT id FROM professions WHERE code = 'spiritual_cook'), 'Comum', 15, '{"flor_nevoa": 2}', '{"cha_nevoa_novo": 1}'),
('rec_sc_06', 'Chá do Lótus Vermelho', (SELECT id FROM professions WHERE code = 'spiritual_cook'), 'Incomum', 25, '{"loto_sangue": 2, "cristal_fogo": 1}', '{"cha_loto_novo": 1}'),
('rec_sc_07', 'Ginseng Assado no Cristal', (SELECT id FROM professions WHERE code = 'spiritual_cook'), 'Raro', 40, '{"ginseng_fogo": 1, "cristal_fogo": 2}', '{"ginseng_assado_novo": 1}'),
('rec_sc_08', 'Ginseng Picante (Escama)', (SELECT id FROM professions WHERE code = 'spiritual_cook'), 'Raro', 45, '{"ginseng_fogo": 1, "escama_serpente_fogo": 1}', '{"ginseng_assado_novo": 1}'),
('rec_sc_09', 'Salada do Vento Leve', (SELECT id FROM professions WHERE code = 'spiritual_cook'), 'Raro', 50, '{"grama_vento_uivante": 3, "flor_nevoa": 1}', '{"salada_vento_nova": 1}'),
('rec_sc_10', 'Cozido de Pata de Urso', (SELECT id FROM professions WHERE code = 'spiritual_cook'), 'Raro', 55, '{"garra_urso": 2, "loto_sangue": 1}', '{"cozido_urso_novo": 1}'),
('rec_sc_11', 'Vinho de Cogumelo Fantasma', (SELECT id FROM professions WHERE code = 'spiritual_cook'), 'Épico', 65, '{"cogumelo_fantasma": 3, "prata_lunar": 1}', '{"vinho_fantasma_novo": 1}'),
('rec_sc_12', 'Vinho Fantasma Envelhecido', (SELECT id FROM professions WHERE code = 'spiritual_cook'), 'Épico', 70, '{"cogumelo_fantasma": 2, "sangue_lobo_sombra": 2}', '{"vinho_fantasma_novo": 1}'),
('rec_sc_13', 'Banquete do Dragão Azure', (SELECT id FROM professions WHERE code = 'spiritual_cook'), 'Épico', 80, '{"fruta_dragao_azure": 2, "carne_besta": 5}', '{"banquete_dragao_novo": 1}'),
('rec_sc_14', 'Banquete do Dragão (Com Chifre)', (SELECT id FROM professions WHERE code = 'spiritual_cook'), 'Épico', 85, '{"fruta_dragao_azure": 1, "chifre_rinoceronte": 1}', '{"banquete_dragao_novo": 1}'),
('rec_sc_15', 'Raspadinha de Gelo Milenar', (SELECT id FROM professions WHERE code = 'spiritual_cook'), 'Raro', 60, '{"flor_gelo_milenar": 2, "jade_fria": 1}', '{"raspadinha_gelo_nova": 1}'),
('rec_sc_16', 'Chá Repousante da Alma', (SELECT id FROM professions WHERE code = 'spiritual_cook'), 'Lendário', 90, '{"raiz_alma_partida": 1, "flor_gelo_milenar": 1}', '{"cha_alma_novo": 1}'),
('rec_sc_17', 'Chá Repousante (Lote Duplo)', (SELECT id FROM professions WHERE code = 'spiritual_cook'), 'Lendário', 95, '{"raiz_alma_partida": 2}', '{"cha_alma_novo": 2}'),
('rec_sc_18', 'Ensopado de Carne de Fênix', (SELECT id FROM professions WHERE code = 'spiritual_cook'), 'Lendário', 95, '{"sangue_fenix_impuro": 1, "ginseng_fogo": 2}', '{"ensopado_fenix_novo": 1}'),
('rec_sc_19', 'Néctar Estelar Absoluto', (SELECT id FROM professions WHERE code = 'spiritual_cook'), 'Celestial', 99, '{"erva_estelar_divina": 1, "essencia_terra": 1}', '{"nectar_estelar_novo": 1}'),
('rec_sc_20', 'Ração de Viagem (Pacote)', (SELECT id FROM professions WHERE code = 'spiritual_cook'), 'Comum', 15, '{"carne_besta": 5}', '{"espeto_bestial_novo": 3}'),

-- ==========================================
-- MESTRE DE TALISMÃS (20 Receitas)
-- ==========================================
('rec_tm_01', 'Talismã de Fogo Menor', (SELECT id FROM professions WHERE code = 'talisman_master'), 'Comum', 15, '{"sangue_lobo_sombra": 1, "erva_espiritual_comum": 2}', '{"talisma_fogo_novo": 1}'),
('rec_tm_02', 'Talismã de Fogo (Tinta Vermelha)', (SELECT id FROM professions WHERE code = 'talisman_master'), 'Comum', 18, '{"loto_sangue": 1, "cristal_fogo": 1}', '{"talisma_fogo_novo": 1}'),
('rec_tm_03', 'Talismã de Gelo Menor', (SELECT id FROM professions WHERE code = 'talisman_master'), 'Comum', 15, '{"sangue_lobo_sombra": 1, "flor_nevoa": 2}', '{"talisma_gelo_novo": 1}'),
('rec_tm_04', 'Talismã de Gelo (Tinta Fria)', (SELECT id FROM professions WHERE code = 'talisman_master'), 'Comum', 20, '{"jade_fria": 1, "flor_nevoa": 1}', '{"talisma_gelo_novo": 1}'),
('rec_tm_05', 'Talismã de Vento Rápido', (SELECT id FROM professions WHERE code = 'talisman_master'), 'Incomum', 30, '{"pena_aguia_vento": 1, "sangue_lobo_sombra": 1}', '{"talisma_vento_novo": 1}'),
('rec_tm_06', 'Talismã de Vento (Pó de Osso)', (SELECT id FROM professions WHERE code = 'talisman_master'), 'Incomum', 35, '{"grama_vento_uivante": 2, "osso_besta": 1}', '{"talisma_vento_novo": 1}'),
('rec_tm_07', 'Selo de Peso da Terra', (SELECT id FROM professions WHERE code = 'talisman_master'), 'Incomum', 35, '{"minerio_ferro_negro": 2, "sangue_lobo_sombra": 1}', '{"selo_terra_novo": 1}'),
('rec_tm_08', 'Selo de Ilusão Fantasma', (SELECT id FROM professions WHERE code = 'talisman_master'), 'Raro', 50, '{"cogumelo_fantasma": 2, "sangue_lobo_sombra": 1}', '{"selo_ilusao_novo": 1}'),
('rec_tm_09', 'Selo de Ilusão (Base Prata)', (SELECT id FROM professions WHERE code = 'talisman_master'), 'Raro', 55, '{"cogumelo_fantasma": 1, "prata_lunar": 1}', '{"selo_ilusao_novo": 1}'),
('rec_tm_10', 'Talismã de Proteção Maior', (SELECT id FROM professions WHERE code = 'talisman_master'), 'Raro', 60, '{"escama_serpente_fogo": 2, "garra_urso": 1}', '{"talisma_protecao_novo": 1}'),
('rec_tm_11', 'Talismã de Fogo Explosivo', (SELECT id FROM professions WHERE code = 'talisman_master'), 'Épico', 70, '{"ginseng_fogo": 2, "cristal_fogo": 2}', '{"talisma_explosivo_novo": 1}'),
('rec_tm_12', 'Talismã de Fogo Explosivo (Fênix)', (SELECT id FROM professions WHERE code = 'talisman_master'), 'Épico', 75, '{"sangue_fenix_impuro": 1, "cristal_fogo": 1}', '{"talisma_explosivo_novo": 1}'),
('rec_tm_13', 'Selo de Supressão do Dragão', (SELECT id FROM professions WHERE code = 'talisman_master'), 'Épico', 80, '{"fruta_dragao_azure": 1, "ouro_purpura": 1}', '{"selo_supressao_novo": 1}'),
('rec_tm_14', 'Selo de Sangue Devorador', (SELECT id FROM professions WHERE code = 'talisman_master'), 'Épico', 82, '{"sangue_lobo_sombra": 5, "loto_sangue": 2}', '{"selo_sangue_novo": 1}'),
('rec_tm_15', 'Talismã Ocultador de Aura', (SELECT id FROM professions WHERE code = 'talisman_master'), 'Lendário', 90, '{"raiz_alma_partida": 1, "prata_lunar": 2}', '{"talisma_ocultador_novo": 1}'),
('rec_tm_16', 'Talismã Ocultador (Pó de Terra)', (SELECT id FROM professions WHERE code = 'talisman_master'), 'Lendário', 92, '{"essencia_terra": 1, "cogumelo_fantasma": 2}', '{"talisma_ocultador_novo": 1}'),
('rec_tm_17', 'Selo do Caos Descendente', (SELECT id FROM professions WHERE code = 'talisman_master'), 'Celestial', 99, '{"cristal_caos": 1, "sangue_fenix_impuro": 1}', '{"selo_caos_novo": 1}'),
('rec_tm_18', 'Pergaminho de Retorno Estelar', (SELECT id FROM professions WHERE code = 'talisman_master'), 'Celestial', 98, '{"erva_estelar_divina": 1, "aco_estelar": 1}', '{"pergaminho_retorno_novo": 1}'),
('rec_tm_19', 'Talismãs de Fogo Menor (Lote)', (SELECT id FROM professions WHERE code = 'talisman_master'), 'Comum', 25, '{"sangue_lobo_sombra": 3, "erva_espiritual_comum": 5}', '{"talisma_fogo_novo": 3}'),
('rec_tm_20', 'Tinta Espiritual Purificada', (SELECT id FROM professions WHERE code = 'talisman_master'), 'Incomum', 20, '{"sangue_lobo_sombra": 2, "flor_nevoa": 1}', '{"tinta_espiritual_nova": 1}'),

-- ==========================================
-- MESTRE DE FORMAÇÃO (20 Receitas)
-- ==========================================
('rec_form_01', 'Bandeira de Formação Básica', (SELECT id FROM professions WHERE code = 'formation_master'), 'Comum', 15, '{"osso_besta": 2, "erva_espiritual_comum": 2}', '{"bandeira_formacao_nova": 1}'),
('rec_form_02', 'Bandeira de Formação (Ferro)', (SELECT id FROM professions WHERE code = 'formation_master'), 'Comum', 20, '{"minerio_ferro_negro": 2, "erva_espiritual_comum": 1}', '{"bandeira_formacao_nova": 1}'),
('rec_form_03', 'Disco de Coleta de Qi', (SELECT id FROM professions WHERE code = 'formation_master'), 'Incomum', 30, '{"cobre_espiritual": 3, "flor_nevoa": 1}', '{"disco_coleta_qi_novo": 1}'),
('rec_form_04', 'Disco de Coleta (Com Núcleo)', (SELECT id FROM professions WHERE code = 'formation_master'), 'Incomum', 35, '{"cobre_espiritual": 1, "nucleo_besta_baixo": 1}', '{"disco_coleta_qi_novo": 1}'),
('rec_form_05', 'Barreira de Fogo Protetora', (SELECT id FROM professions WHERE code = 'formation_master'), 'Raro', 50, '{"cristal_fogo": 3, "nucleo_besta_baixo": 1}', '{"barreira_fogo_nova": 1}'),
('rec_form_06', 'Barreira de Fogo (Escamas)', (SELECT id FROM professions WHERE code = 'formation_master'), 'Raro', 55, '{"escama_serpente_fogo": 4, "cobre_espiritual": 1}', '{"barreira_fogo_nova": 1}'),
('rec_form_07', 'Matriz de Gelo Congelante', (SELECT id FROM professions WHERE code = 'formation_master'), 'Raro', 55, '{"jade_fria": 3, "flor_gelo_milenar": 1}', '{"matriz_gelo_nova": 1}'),
('rec_form_08', 'Matriz de Gelo (Pó Lunar)', (SELECT id FROM professions WHERE code = 'formation_master'), 'Raro', 58, '{"prata_lunar": 2, "jade_fria": 2}', '{"matriz_gelo_nova": 1}'),
('rec_form_09', 'Olho da Matriz Espiritual', (SELECT id FROM professions WHERE code = 'formation_master'), 'Épico', 70, '{"nucleo_besta_medio": 2, "ouro_purpura": 1}', '{"olho_matriz_novo": 1}'),
('rec_form_10', 'Bandeira de Ilusão Sombria', (SELECT id FROM professions WHERE code = 'formation_master'), 'Épico', 70, '{"cogumelo_fantasma": 3, "aco_estelar": 1}', '{"bandeira_ilusao_nova": 1}'),
('rec_form_11', 'Bandeira de Ilusão (Penas)', (SELECT id FROM professions WHERE code = 'formation_master'), 'Épico', 75, '{"pena_aguia_vento": 3, "prata_lunar": 2}', '{"bandeira_ilusao_nova": 1}'),
('rec_form_12', 'Matriz da Espada Estelar', (SELECT id FROM professions WHERE code = 'formation_master'), 'Lendário', 90, '{"aco_estelar": 5, "essencia_terra": 1}', '{"matriz_espada_nova": 1}'),
('rec_form_13', 'Matriz Espada Estelar (Meteoro)', (SELECT id FROM professions WHERE code = 'formation_master'), 'Lendário', 92, '{"ferro_meteoro": 2, "aco_estelar": 3}', '{"matriz_espada_nova": 1}'),
('rec_form_14', 'Disco de Proteção da Terra', (SELECT id FROM professions WHERE code = 'formation_master'), 'Lendário', 90, '{"essencia_terra": 2, "ouro_purpura": 2}', '{"disco_terra_novo": 1}'),
('rec_form_15', 'Pilar de Supressão do Dragão', (SELECT id FROM professions WHERE code = 'formation_master'), 'Épico', 80, '{"fruta_dragao_azure": 2, "cobre_espiritual": 4}', '{"pilar_dragao_novo": 1}'),
('rec_form_16', 'Matriz do Renascimento da Fênix', (SELECT id FROM professions WHERE code = 'formation_master'), 'Celestial', 99, '{"sangue_fenix_impuro": 2, "erva_estelar_divina": 1}', '{"matriz_fenix_nova": 1}'),
('rec_form_17', 'Núcleo de Formação do Caos', (SELECT id FROM professions WHERE code = 'formation_master'), 'Celestial', 99, '{"cristal_caos": 2, "ferro_meteoro": 2}', '{"nucleo_caos_novo": 1}'),
('rec_form_18', 'Disco Básico (Lote)', (SELECT id FROM professions WHERE code = 'formation_master'), 'Comum', 25, '{"minerio_ferro_negro": 6}', '{"disco_coleta_qi_novo": 2}'),
('rec_form_19', 'Luz de Guia Espiritual', (SELECT id FROM professions WHERE code = 'formation_master'), 'Incomum', 30, '{"prata_lunar": 1, "flor_nevoa": 2}', '{"luz_guia_nova": 1}'),
('rec_form_20', 'Luz de Guia (Fogo)', (SELECT id FROM professions WHERE code = 'formation_master'), 'Incomum', 35, '{"cristal_fogo": 1, "flor_nevoa": 2}', '{"luz_guia_nova": 1}'),

-- ==========================================
-- MESTRE DE MARIONETES (15 Receitas)
-- ==========================================
('rec_pup_01', 'Esqueleto de Madeira e Osso', (SELECT id FROM professions WHERE code = 'puppet_master'), 'Comum', 15, '{"osso_besta": 4, "erva_espiritual_comum": 2}', '{"esqueleto_marionete_novo": 1}'),
('rec_pup_02', 'Esqueleto de Ferro Negro', (SELECT id FROM professions WHERE code = 'puppet_master'), 'Incomum', 30, '{"minerio_ferro_negro": 4, "osso_besta": 2}', '{"esqueleto_ferro_novo": 1}'),
('rec_pup_03', 'Núcleo Motriz Básico', (SELECT id FROM professions WHERE code = 'puppet_master'), 'Incomum', 35, '{"nucleo_besta_baixo": 1, "cobre_espiritual": 2}', '{"nucleo_motriz_novo": 1}'),
('rec_pup_04', 'Núcleo Motriz (Sangue)', (SELECT id FROM professions WHERE code = 'puppet_master'), 'Incomum', 40, '{"sangue_lobo_sombra": 2, "cristal_fogo": 1}', '{"nucleo_motriz_novo": 1}'),
('rec_pup_05', 'Marionete Lobo de Madeira', (SELECT id FROM professions WHERE code = 'puppet_master'), 'Raro', 50, '{"osso_besta": 5, "sangue_lobo_sombra": 2}', '{"marionete_lobo_nova": 1}'),
('rec_pup_06', 'Marionete Aranha de Prata', (SELECT id FROM professions WHERE code = 'puppet_master'), 'Épico', 70, '{"prata_lunar": 4, "nucleo_besta_medio": 1}', '{"marionete_aranha_nova": 1}'),
('rec_pup_07', 'Marionete Aranha (Cobre Quente)', (SELECT id FROM professions WHERE code = 'puppet_master'), 'Épico', 75, '{"cobre_espiritual": 5, "cristal_fogo": 2}', '{"marionete_aranha_nova": 1}'),
('rec_pup_08', 'Braço de Urso Esmagador', (SELECT id FROM professions WHERE code = 'puppet_master'), 'Raro', 55, '{"garra_urso": 2, "minerio_ferro_negro": 3}', '{"braco_urso_novo": 1}'),
('rec_pup_09', 'Braço de Urso (Couro)', (SELECT id FROM professions WHERE code = 'puppet_master'), 'Raro', 60, '{"carne_besta": 4, "garra_urso": 1}', '{"braco_urso_novo": 1}'),
('rec_pup_10', 'Armadura de Marionete (Escamas)', (SELECT id FROM professions WHERE code = 'puppet_master'), 'Épico', 70, '{"escama_serpente_fogo": 5, "cobre_espiritual": 2}', '{"armadura_marionete_nova": 1}'),
('rec_pup_11', 'Armadura de Marionete (Ouro)', (SELECT id FROM professions WHERE code = 'puppet_master'), 'Lendário', 85, '{"ouro_purpura": 3, "essencia_terra": 1}', '{"armadura_marionete_nova": 1}'),
('rec_pup_12', 'Marionete Dragão de Ferro', (SELECT id FROM professions WHERE code = 'puppet_master'), 'Lendário', 92, '{"ferro_meteoro": 4, "fruta_dragao_azure": 2}', '{"marionete_dragao_nova": 1}'),
('rec_pup_13', 'Marionete Anjo Caído', (SELECT id FROM professions WHERE code = 'puppet_master'), 'Celestial', 99, '{"aco_estelar": 4, "erva_estelar_divina": 1}', '{"marionete_anjo_nova": 1}'),
('rec_pup_14', 'Peça de Juntas Lubrificadas', (SELECT id FROM professions WHERE code = 'puppet_master'), 'Comum', 20, '{"carne_besta": 3, "minerio_ferro_negro": 1}', '{"junta_marionete_nova": 1}'),
('rec_pup_15', 'Fio de Controle da Alma', (SELECT id FROM professions WHERE code = 'puppet_master'), 'Lendário', 90, '{"raiz_alma_partida": 1, "prata_lunar": 2}', '{"fio_alma_novo": 1}'),

-- ==========================================
-- MESTRE DE BESTAS (15 Receitas)
-- ==========================================
('rec_bm_01', 'Ração Bestial Comum', (SELECT id FROM professions WHERE code = 'beast_master'), 'Comum', 10, '{"carne_besta": 2, "erva_espiritual_comum": 2}', '{"racao_bestial_nova": 1}'),
('rec_bm_02', 'Ração Bestial (Nutritiva)', (SELECT id FROM professions WHERE code = 'beast_master'), 'Comum', 15, '{"carne_besta": 3, "osso_besta": 1}', '{"racao_bestial_nova": 2}'),
('rec_bm_03', 'Pílula de Crescimento Bestial', (SELECT id FROM professions WHERE code = 'beast_master'), 'Incomum', 30, '{"loto_sangue": 1, "nucleo_besta_baixo": 1}', '{"pilula_crescimento_nova": 1}'),
('rec_bm_04', 'Pílula de Crescimento (Carne)', (SELECT id FROM professions WHERE code = 'beast_master'), 'Incomum', 35, '{"carne_besta": 5, "flor_nevoa": 1}', '{"pilula_crescimento_nova": 1}'),
('rec_bm_05', 'Selo de Domesticação Menor', (SELECT id FROM professions WHERE code = 'beast_master'), 'Incomum', 40, '{"sangue_lobo_sombra": 2, "prata_lunar": 1}', '{"selo_domesticacao_novo": 1}'),
('rec_bm_06', 'Coleira de Retenção de Qi', (SELECT id FROM professions WHERE code = 'beast_master'), 'Raro', 50, '{"cobre_espiritual": 3, "jade_fria": 1}', '{"coleira_besta_nova": 1}'),
('rec_bm_07', 'Coleira de Retenção (Osso)', (SELECT id FROM professions WHERE code = 'beast_master'), 'Raro', 55, '{"osso_besta": 5, "minerio_ferro_negro": 2}', '{"coleira_besta_nova": 1}'),
('rec_bm_08', 'Isca de Carne Perfumada', (SELECT id FROM professions WHERE code = 'beast_master'), 'Raro', 60, '{"carne_besta": 4, "ginseng_fogo": 1}', '{"isca_besta_nova": 1}'),
('rec_bm_09', 'Isca Perfumada (Sangue)', (SELECT id FROM professions WHERE code = 'beast_master'), 'Raro', 65, '{"sangue_lobo_sombra": 3, "loto_sangue": 1}', '{"isca_besta_nova": 1}'),
('rec_bm_10', 'Essência Despertadora de Linhagem', (SELECT id FROM professions WHERE code = 'beast_master'), 'Épico', 80, '{"nucleo_besta_medio": 2, "fruta_dragao_azure": 1}', '{"essencia_linhagem_nova": 1}'),
('rec_bm_11', 'Essência Despertadora (Urso)', (SELECT id FROM professions WHERE code = 'beast_master'), 'Épico', 85, '{"garra_urso": 4, "loto_sangue": 2}', '{"essencia_linhagem_nova": 1}'),
('rec_bm_12', 'Selo de Domesticação Maior', (SELECT id FROM professions WHERE code = 'beast_master'), 'Lendário', 90, '{"ouro_purpura": 2, "sangue_fenix_impuro": 1}', '{"selo_domesticacao_maior": 1}'),
('rec_bm_13', 'Armadura Bestial Leve', (SELECT id FROM professions WHERE code = 'beast_master'), 'Raro', 60, '{"escama_serpente_fogo": 3, "cobre_espiritual": 2}', '{"armadura_pet_nova": 1}'),
('rec_bm_14', 'Ninho de Incubação Acelerado', (SELECT id FROM professions WHERE code = 'beast_master'), 'Lendário', 95, '{"essencia_terra": 2, "cristal_fogo": 3}', '{"ninho_incubacao_novo": 1}'),
('rec_bm_15', 'Cristal de Evolução do Caos', (SELECT id FROM professions WHERE code = 'beast_master'), 'Celestial', 99, '{"cristal_caos": 2, "nucleo_besta_medio": 2}', '{"cristal_evolucao_novo": 1}');
