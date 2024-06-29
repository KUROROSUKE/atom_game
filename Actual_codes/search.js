async function loadMaterials() {
    const response = await fetch('../compound/standard.json');
    const data = await response.json();
    if (!data.material || !Array.isArray(data.material)) {
        console.error('Loaded data does not contain a valid "material" array:', data);
        return [];
    }
    return data.material;
}

async function findMaterials(components) {
    const materials = await loadMaterials();
    return materials.filter(material => {
        for (const element in components) {
            if (!material.components[element] || material.components[element] !== components[element]) {
                return false;
            }
        }
        for (const element in material.components) {
            if (!components[element]) {
                return false;
            }
        }
        return true;
    });
}

document.getElementById('exchangeButton').addEventListener('click', () => {
    const selectedCards = document.querySelectorAll('#hand .selected img');
    selectedCards.forEach(card => {
        const element = card.alt.split(' ')[1];
        const index = currentHand.indexOf(element);
        if (index > -1) {
            currentHand[index] = drawRandomElements(elements, 1)[0];
            card.parentNode.classList.remove('selected'); // Deselect the card
        }
    });
    selectedElements = {}; // Clear selected elements
    displayHand(currentHand, 'hand');

    aiTurn();
});

let totalPoints = 0; // ポイントの合計を保持する変数


document.getElementById('searchButton').addEventListener('click', async () => {
    const foundMaterials = await findMaterials(selectedElements);
    const resultDiv = document.getElementById('results');
    const pointsDiv = document.getElementById('points');
    resultDiv.innerHTML = '';

    if (foundMaterials.length > 0) {
        foundMaterials.forEach(material => {
            resultDiv.innerHTML += `<p>${material.name} (${material.formula}) - ${material.point} points</p>`;
            totalPoints += material.point;
            replaceUsedCards(material, playerHand); // replaceUsedCards関数で内部データと表示を更新
        });
        pointsDiv.textContent = `ポイント： ${totalPoints}`;
    } else {
        resultDiv.innerHTML = '<p>該当する物質が見つかりませんでした。</p>';
    }

    aiTurn(); // AIのターンを開始
});
