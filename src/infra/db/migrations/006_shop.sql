-- LIMPANDO A LOJA ANTIGA
DELETE FROM shop_items;

-- SEMENTES DE ITENS DA LOJA CELESTIAL
INSERT INTO shop_items (item_id, price_amount, currency, is_active) VALUES 

-- [RECURSOS BÁSICOS - MOEDA: gold]
((SELECT id FROM items WHERE code = 'erva_espiritual_comum'), 20, 'gold', 1),
((SELECT id FROM items WHERE code = 'minerio_ferro_negro'), 30, 'gold', 1),
((SELECT id FROM items WHERE code = 'osso_besta'), 15, 'gold', 1),
((SELECT id FROM items WHERE code = 'carne_besta'), 10, 'gold', 1),

-- [CONSUMÍVEIS DE CURA - MOEDA: gold]
((SELECT id FROM items WHERE code = 'pilula_recuperacao_menor'), 60, 'gold', 1),
((SELECT id FROM items WHERE code = 'pilula_vigor_sanguineo'), 120, 'gold', 1),

-- [EQUIPAMENTOS INICIAIS - MOEDA: gold]
((SELECT id FROM items WHERE code = 'espada_ferro_negro'), 450, 'gold', 1),
((SELECT id FROM items WHERE code = 'lanca_madeira_ferro'), 400, 'gold', 1),
((SELECT id FROM items WHERE code = 'manto_discípulo'), 350, 'gold', 1),
((SELECT id FROM items WHERE code = 'armadura_couro_lobo'), 600, 'gold', 1),

-- [ITENS DE NÍVEL MÉDIO - MOEDA: spirit_pearl]
((SELECT id FROM items WHERE code = 'pilula_qi_menor'), 10, 'spirit_pearl', 1),
((SELECT id FROM items WHERE code = 'sabre_vento_cortante'), 50, 'spirit_pearl', 1),
((SELECT id FROM items WHERE code = 'veste_seda_espiritual'), 65, 'spirit_pearl', 1),
((SELECT id FROM items WHERE code = 'bolsa_espacial_menor'), 80, 'spirit_pearl', 1),

-- [TESOUROS RAROS E ESPECIAIS - MOEDA: spirit_pearl / dao_crystal]
((SELECT id FROM items WHERE code = 'pilula_avanco_espiritual'), 500, 'spirit_pearl', 1),
((SELECT id FROM items WHERE code = 'pilula_purificacao_ossea'), 350, 'spirit_pearl', 1),

-- [O ITEM SUPREMO - PÍLULA DE REVERSÃO DO DESTINO]
-- Compra por 1 Cristal Dao como solicitado pelo Mestre
((SELECT id FROM items WHERE code = 'pilula_reversao_inferior'), 1, 'dao_crystal', 1);
