// src/shared/utils/random.js

/**
 * Função mágica para rolar o destino baseado nas chances (pesos)
 * @param {Array} items - Lista de objetos contendo uma propriedade 'chance'
 */
function rollWeighted(items) {
    const totalWeight = items.reduce((sum, item) => sum + item.chance, 0);
    let randomNum = Math.random() * totalWeight;

    for (const item of items) {
        if (randomNum < item.chance) {
            // Retorna o item inteiro sorteado
            return item;
        }
        randomNum -= item.chance;
    }
    // Retorno de segurança (failsafe)
    return items[items.length - 1];
}

module.exports = { rollWeighted };
