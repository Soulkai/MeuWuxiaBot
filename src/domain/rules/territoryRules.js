/**
 * Sprint 13: Territórios
 * Regras de domínio e geração passiva de riqueza
 * 
 * Cálculos:
 * - Força de domínio
 * - Geração passiva de ouro/pedras
 * - Nível de território
 * 
 * Referência: Seção 406
 */

function calculateDominationPower(attacker, defender) {
    // Attacker/defender podem incluir campos como 'sectPower' ou 'power'
    const atk = Number(attacker?.sectPower ?? attacker?.power ?? 50);
    const def = Number(defender?.sectPower ?? defender?.power ?? 50);

    // Base de 50% ajustada pela diferença relativa
    let delta = 0;
    if (def > 0) delta = ((atk - def) / def) * 10; // cada 10% de diferença dá +1 ponto
    let chance = Math.round(50 + delta);
    if (chance < 5) chance = 5;
    if (chance > 95) chance = 95;
    return chance; // porcentagem
}

function calculatePassiveWealth(territoryLevel, developmentScore) {
    // Geração aproximada: base por nível multiplicada pelo fator de desenvolvimento
    const level = Number(territoryLevel || 1);
    const dev = Number(developmentScore || 0);
    const basePerLevel = 10;
    const wealth = Math.round(level * basePerLevel * (1 + dev / 100));
    return wealth;
}

function calculateTerritoryUpgradeCost(currentLevel) {
    const lvl = Number(currentLevel || 1);
    const cost = Math.round(1000 * Math.pow(1.5, lvl));
    return cost;
}

module.exports = {
    calculateDominationPower,
    calculatePassiveWealth,
    calculateTerritoryUpgradeCost
};
