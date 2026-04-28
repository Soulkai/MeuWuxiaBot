/**
 * Sprint 9: Leis do Combate
 * Regras de cálculo fino de combate
 * 
 * Cálculos:
 * - Dano (com redução de armadura)
 * - Ataque Espiritual
 * - Esquiva
 * - Acerto
 * - Crítico
 * 
 * Referência: Seção 266
 */

function _num(v) { return typeof v === 'number' ? v : (v ? Number(v) : 0); }

function calculateDamage(attacker, defender, technique) {
    // Normaliza valores
    const atkStr = _num(attacker.strength);
    const atkAgi = _num(attacker.agility);
    const defCon = _num(defender.constitution);

    // Dano base: força do atacante com pequeno bônus de agilidade
    let base = atkStr * 2 + Math.floor(atkAgi * 0.3) + (Math.floor(Math.random() * 6) + 1);

    // Técnica pode amplificar o dano (se fornecida)
    if (technique && technique.power) {
        base = Math.floor(base * technique.power);
    }

    // Redução por constituição do defensor
    const reduction = Math.floor(defCon * 0.6);

    let dmg = base - reduction;
    if (dmg < 1) dmg = 1;

    return Math.round(dmg);
}

function calculateHitChance(attacker, defender) {
    const atkAgi = _num(attacker.agility);
    const defAgi = _num(defender.agility);

    // Base alta para não tornar combate frustrante
    let chance = 75 + Math.floor((atkAgi - defAgi) * 2);
    if (chance < 5) chance = 5;
    if (chance > 95) chance = 95;
    return chance;
}

function calculateCriticalChance(attacker) {
    const luck = _num(attacker.luck);
    const perc = Math.min(50, Math.max(1, Math.floor(luck * 0.5)));
    return perc; // valor em porcentagem
}

function applySpiritualAttack(attacker, technique) {
    const atkSpirit = _num(attacker.spirit);
    const mult = 1 + Math.max(-0.2, Math.min(0.5, (atkSpirit - 10) / 100));
    return Number(mult.toFixed(2));
}

module.exports = {
    calculateDamage,
    calculateHitChance,
    calculateCriticalChance,
    applySpiritualAttack
};
