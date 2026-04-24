const { weightedRandom } = require('../../shared/utils/random');

// 24.1 Raças (Sorteio direto pelo código da raça no banco)
const RACE_CHANCES = [
    { id: 'human', chance: 55.00 },
    { id: 'half_spirit', chance: 15.00 },
    { id: 'beastborn', chance: 12.00 },
    { id: 'shadowborn', chance: 7.00 },
    { id: 'draconic', chance: 5.00 },
    { id: 'phoenix', chance: 3.00 },
    { id: 'fallen_celestial', chance: 2.50 },
    { id: 'void_nascent', chance: 0.50 }
];

// 24.2 Clãs (Sorteio por Tier, depois buscaremos um clã aleatório deste Tier no banco)
const CLAN_TIER_CHANCES = [
    { tier: 'Comum', chance: 50.00 },
    { tier: 'Incomum', chance: 25.00 },
    { tier: 'Raro', chance: 15.00 },
    { tier: 'Épico', chance: 7.00 },
    { tier: 'Lendário', chance: 2.50 },
    { tier: 'Antigo', chance: 0.50 }
];

// 24.4 Raízes Espirituais (Adaptado aos Tiers das sementes)
const ROOT_TIER_CHANCES = [
    { tier: 'Nenhuma', chance: 8.00 },
    { tier: 'Comum', chance: 40.00 },
    { tier: 'Incomum', chance: 25.00 },
    { tier: 'Raro', chance: 15.00 },
    { tier: 'Lendário', chance: 8.00 },
    { tier: 'Celestial', chance: 4.00 }
];

// 24.5 Corpos Divinos
const BODY_TIER_CHANCES = [
    { tier: 'Nenhum', chance: 89.00 },
    { tier: 'Incomum', chance: 7.00 },
    { tier: 'Raro', chance: 2.50 },
    { tier: 'Sagrado', chance: 1.00 },
    { tier: 'Divino', chance: 0.45 },
    { tier: 'Imortal', chance: 0.05 }
];

// 24.3 e 24.8 Atributos Fixos
const TALENT_TIERS = [
    { tier: 'Comum', chance: 35.00 }, { tier: 'Incomum', chance: 25.00 },
    { tier: 'Raro', chance: 18.00 }, { tier: 'Épico', chance: 11.00 },
    { tier: 'Lendário', chance: 6.00 }, { tier: 'Celestial', chance: 4.00 },
    { tier: 'Inominável', chance: 1.00 }
];

const LUCK_TIERS = [
    { tier: 'Muito baixa', chance: 10.00 }, { tier: 'Baixa', chance: 20.00 },
    { tier: 'Média', chance: 40.00 }, { tier: 'Alta', chance: 20.00 },
    { tier: 'Excepcional', chance: 8.00 }, { tier: 'Destino Abençoado', chance: 2.00 }
];

module.exports = {
    rollRace: () => weightedRandom(RACE_CHANCES).id,
    rollClanTier: () => weightedRandom(CLAN_TIER_CHANCES).tier,
    rollRootTier: () => weightedRandom(ROOT_TIER_CHANCES).tier,
    rollBodyTier: () => weightedRandom(BODY_TIER_CHANCES).tier,
    rollTalent: () => weightedRandom(TALENT_TIERS).tier,
    rollLuck: () => weightedRandom(LUCK_TIERS).tier
};
