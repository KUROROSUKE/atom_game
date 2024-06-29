let playerPoints = 0;

async function aiTurn() {
    clearAISelection();
    const possibleCompounds = await listCreatableMaterials(aiHand);
    const aiPointsDiv = document.getElementById('aiPoints');
    const resultDiv = document.getElementById('results');

    const compound = decideCompound(aiHand, possibleCompounds);
    if (compound) {
        console.log('AIが選択するはずのカード:', compound.components);
        for (let element in compound.components) {
            let count = compound.components[element];
            const elements = document.querySelectorAll(`#aiHand img[alt="Element ${element}"]`);
            for (let i = 0; i < elements.length && count > 0; i++) {
                const cardElement = elements[i].parentNode;
                cardElement.classList.add('selected');
                count--;
                await new Promise(resolve => setTimeout(resolve, 700));
            }
        }
        await new Promise(resolve => setTimeout(resolve, 1500));
        resultDiv.innerHTML = `<p>AIが生成: ${compound.name} (${compound.formula}) - ${compound.point} ポイント</p>`;
        updatePoints(compound, aiPointsDiv);
        replaceUsedCards(compound, aiHand);
    } else {
        const elementToExchange = decideElementsToExchange(aiHand);
        if (elementToExchange) {
            const cardElement = document.querySelector(`#aiHand img[alt="Element ${elementToExchange}"]`).parentNode;
            cardElement.classList.add('selected');
            await new Promise(resolve => setTimeout(resolve, 700));
            const index = aiHand.indexOf(elementToExchange);
            if (index > -1) {
                aiHand[index] = drawRandomElements(elements, 1)[0];
                displayHand(aiHand, 'aiHand');
            }
        }
    }
}

function updatePoints(compound, pointsDiv) {
    aiPoints += compound.point;
    pointsDiv.textContent = `AIポイント: ${aiPoints}`;
}

function replaceUsedCards(compound, hand) {
    for (let element in compound.components) {
        for (let i = 0; i < compound.components[element]; i++) {
            const index = hand.indexOf(element);
            if (index > -1) {
                hand[index] = drawRandomElements(elements, 1)[0];
            }
        }
    }
    displayHand(hand, 'aiHand');
}

async function listCreatableMaterials(hand) {
    const materials = [];
    const combinations = getCombinations(hand);

    for (const combo of combinations) {
        const comboCounts = {};
        combo.forEach(el => comboCounts[el] = (comboCounts[el] || 0) + 1);
        const foundMaterials = await findMaterials(comboCounts);
        materials.push(...foundMaterials);
    }

    return materials;
}

function getCombinations(hand) {
    const results = [];

    const recurse = (path, hand, depth) => {
        if (depth === 0) {
            results.push(path);
            return;
        }
        for (let i = 0; i < hand.length; i++) {
            recurse(path.concat(hand[i]), hand.slice(i + 1), depth - 1);
        }
    };

    for (let i = 1; i <= hand.length; i++) {
        recurse([], hand, i);
    }

    return results;
}

function canGenerateCompound(hand, compound) {
    const availableElements = {};
    hand.forEach(el => availableElements[el] = (availableElements[el] || 0) + 1);

    for (let el in compound.components) {
        if (!availableElements[el] || availableElements[el] < compound.components[el]) {
            return false;
        }
    }
    return true;
}

function decideCompound(currentHand, possibleCompounds) {
    let bestCompound = null;
    let maxPoints = 0;
    for (let compound of possibleCompounds) {
        if (canGenerateCompound(currentHand, compound) && compound.point > maxPoints) {
            bestCompound = compound;
            maxPoints = compound.point;
        }
    }
    return bestCompound;
}

function decideElementsToExchange(currentHand) {
    const elementCounts = {};
    currentHand.forEach(el => elementCounts[el] = (elementCounts[el] || 0) + 1);

    let minCount = Infinity;
    let elementToExchange = null;
    for (let el in elementCounts) {
        if (elementCounts[el] < minCount) {
            minCount = elementCounts[el];
            elementToExchange = el;
        }
    }
    return elementToExchange;
}