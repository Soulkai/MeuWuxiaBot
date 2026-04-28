/**
 * Sprint 10: Maestria das Bestas
 * Regras de mutação e evolução de bestas
 * 
 * Cálculos:
 * - Probabilidade de mutação
 * - Evolução de bestas
 * - Geração de raridade
 * 
 * Referência: Seção 308
 */

const { weightedRandom } = require('../../shared/utils/random');

const BEAST_RARITY_WEIGHTS = [
    { id: 'comum', chance: 50 },
    { id: 'incomum', chance: 25 },
    { id: 'raro', chance: 12 },
    { id: 'epico', chance: 8 },
    { id: 'lendario', chance: 4 },
    { id: 'celestial', chance: 1 }
];

function calculateMutationChance(beastRarity) {
    const map = {
        'comum': 0.05,
        'incomum': 0.10,
        'raro': 0.15,
        'epico': 0.20,
        'lendario': 0.25,
        'celestial': 0.30
    };
    return map[beastRarity] || 0;
}

function calculateEvolutionThreshold(currentLevel) {
    // Cada evolução requer mais XP (valor arredondado)
    return Math.round(currentLevel * 100 * Math.pow(1.5, currentLevel));
}

function determineEggRarity() {
    const pick = weightedRandom(BEAST_RARITY_WEIGHTS);
    return pick ? pick.id : 'comum';
}

function applyMutation(beast) {
    // Aplica uma mutação leve: aumenta aleatoriamente 1-2 atributos em 5-15%
    const attrs = ['strength', 'agility', 'constitution', 'intelligence', 'spirit'];
    const mutations = Math.random() < 0.5 ? 1 : 2;
    for (let i = 0; i < mutations; i++) {
        const attr = attrs[Math.floor(Math.random() * attrs.length)];
        const base = Number(beast[attr] || 1);
        const mult = 0.05 + Math.random() * 0.10; // 5% - 15%
        beast[attr] = Math.max(1, Math.round(base * (1 + mult)));
    }
    beast.mutated = true;
    return beast;
}

module.exports = {
    calculateMutationChance,
    calculateEvolutionThreshold,
    determineEggRarity,
    applyMutation
};
