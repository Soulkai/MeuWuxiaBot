// Função mágica que escolhe um item baseado no "peso" (probabilidade) de cada um
function weightedRandom(options) {
    if (Array.isArray(options)) {
        // Espera-se um array de objetos com { id/name, chance/weight }
        let total = 0;
        for (const item of options) {
            const w = Number(item.chance ?? item.weight ?? 0);
            total += isNaN(w) ? 0 : w;
        }

        let rnd = Math.random() * total;
        let cum = 0;
        for (const item of options) {
            const w = Number(item.chance ?? item.weight ?? 0) || 0;
            cum += w;
            if (rnd < cum) return item;
        }
        return options[options.length - 1];
    }

    if (options && typeof options === 'object') {
        // Mapa { key: weight }
        let total = 0;
        for (const key in options) {
            total += Number(options[key]) || 0;
        }
        let rnd = Math.random() * total;
        let cum = 0;
        for (const key in options) {
            cum += Number(options[key]) || 0;
            if (rnd < cum) return key;
        }
        const keys = Object.keys(options);
        return keys[keys.length - 1];
    }

    return null;
}

// Exportando a técnica para que as Leis do Karma possam usá-la
module.exports = { weightedRandom };
