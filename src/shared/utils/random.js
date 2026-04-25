// Função mágica que escolhe um item baseado no "peso" (probabilidade) de cada um
function weightedRandom(options) {
    let totalWeight = 0;
    
    // Soma todos os pesos
    for (const key in options) {
        totalWeight += options[key];
    }

    // Gira a roleta
    let randomNum = Math.random() * totalWeight;

    // Define o vencedor
    for (const key in options) {
        if (randomNum < options[key]) {
            return key;
        }
        randomNum -= options[key];
    }
}

// Exportando a técnica para que as Leis do Karma possam usá-la
module.exports = { weightedRandom };
