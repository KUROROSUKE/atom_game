const elements = [
    ...Array(30).fill('H'), ...Array(25).fill('O'), ...Array(20).fill('C'),
    'He', 'Li', 'Be', 'B', 'N', 'F', 'Ne', 'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar', 'K', 'Ca',
    'Fe', 'Cu', 'Zn', 'I'
];

let currentHand = [];
let selectedElements = {};
let aiHand = [];
let aiPoints = 0;

function drawRandomElements(elementsArray, count) {
    const selectedElements = [];
    for (let i = 0; i < count; i++) {
        const randomIndex = Math.floor(Math.random() * elementsArray.length);
        selectedElements.push(elementsArray[randomIndex]);
    }
    return selectedElements;
}

function displayHand(hand, handDivId) {
    const handDiv = document.getElementById(handDivId);
    handDiv.innerHTML = '';
    hand.forEach((element) => {
        const card = document.createElement('div');
        const img = document.createElement('img');
        img.src = `../image/${elementToNumber[element]}.png`;
        img.alt = `Element ${element}`;
        img.style.width = '60px';
        card.appendChild(img);
        card.style.margin = '5px';
        card.style.display = 'inline-block';
        card.style.padding = '10px';
        card.style.border = '1px solid black';
        card.className = 'card';
        card.addEventListener('click', function() {
            if (this.style.pointerEvents === 'auto') { // 有効時のみ選択可能
                clearAISelection();
                this.classList.toggle('selected');
                if (this.classList.contains('selected')) {
                    selectedElements[element] = (selectedElements[element] || 0) + 1;
                } else {
                    if (selectedElements[element]) {
                        selectedElements[element]--;
                        if (selectedElements[element] === 0) {
                            delete selectedElements[element];
                        }
                    }
                }
                console.log(selectedElements);
            }
        });
        handDiv.appendChild(card);
    });
}

function clearAISelection() {
    const aiCards = document.querySelectorAll('#aiHand .selected');
    aiCards.forEach(card => card.classList.remove('selected'));
}

document.getElementById('drawCards').addEventListener('click', () => {
    selectedElements = {};
    currentHand = drawRandomElements(elements, 8);
    displayHand(currentHand, 'hand');
    aiHand = drawRandomElements(elements, 8);
    displayHand(aiHand, 'aiHand');
    document.getElementById('drawCards').style.display = 'none';
});
