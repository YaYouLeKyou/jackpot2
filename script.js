const emojis = ['🍑', '🍆', '🍺', '🍷', '😂', '👽', '❤️'];

const emojiColors = {
    '🍑': '#FFC0CB', // Pink
    '🍆': '#800080', // Purple
    '🍺': '#FFD700', // Gold
    '🍷': '#8B0000', // Dark Red
    '😂': '#FFFF00', // Yellow
    '👽': '#00FF00', // Green
    '❤️': '#FF0000'  // Red
};

let jackpotRules = {}; // Will be loaded from JSON

const slot1 = document.getElementById('slot1');
const slot2 = document.getElementById('slot2');
const slot3 = document.getElementById('slot3');
const spinButton = document.getElementById('spinButton');
const resultDisplay = document.getElementById('result');

let spinning = false;
const jackpotChance = 0.6; // 60% chance of a jackpot

// Initialize slots with beer emojis on page load and attach event listener
document.addEventListener('DOMContentLoaded', () => {
    // Fetch rules from JSON
    fetch('rules.json')
        .then(response => response.json())
        .then(data => {
            jackpotRules = data;
            // Populate initial beer emojis
            slot1.textContent = '🍺';
            slot2.textContent = '🍺';
            slot3.textContent = '🍺';
            spinButton.addEventListener('click', spin);
        })
        .catch(error => {
            console.error('Error loading jackpot rules:', error);
            resultDisplay.textContent = 'Error loading game. Please try again.';
        });
});

function getRandomEmoji() {
    return emojis[Math.floor(Math.random() * emojis.length)];
}

function spin() {
    console.log('Spin function called!'); // Added for debugging
    if (spinning) return;
    spinning = true;
    spinButton.textContent = 'Spinning...';
    resultDisplay.textContent = '';
    resultDisplay.style.backgroundColor = '#f9f9f9'; // Reset background color
    resultDisplay.style.color = '#555'; // Reset text color

    slot1.classList.add('spinning');
    slot2.classList.add('spinning');
    slot3.classList.add('spinning');

    let spins = 0;
    const maxSpins = 20; // Number of times to change emoji before stopping
    const intervalTime = 100; // Milliseconds between changes

    let finalEmoji1, finalEmoji2, finalEmoji3;

    if (Math.random() < jackpotChance) {
        // Force a jackpot
        const forcedEmoji = getRandomEmoji();
        finalEmoji1 = forcedEmoji;
        finalEmoji2 = forcedEmoji;
        finalEmoji3 = forcedEmoji;
    } else {
        // Normal random spin
        finalEmoji1 = getRandomEmoji();
        finalEmoji2 = getRandomEmoji();
        finalEmoji3 = getRandomEmoji();
    }

    const spinInterval = setInterval(() => {
        slot1.textContent = getRandomEmoji();
        slot2.textContent = getRandomEmoji();
        slot3.textContent = getRandomEmoji();
        spins++;

        if (spins > maxSpins) {
            clearInterval(spinInterval);
            spinning = false;
            spinButton.textContent = 'Spin';
            slot1.classList.remove('spinning');
            slot2.classList.remove('spinning');
            slot3.classList.remove('spinning');

            // Set the final emojis after spinning stops
            slot1.textContent = finalEmoji1;
            slot2.textContent = finalEmoji2;
            slot3.textContent = finalEmoji3;

            checkResult();
        }
    }, intervalTime);
}

function checkResult() {
    const val1 = slot1.textContent;
    const val2 = slot2.textContent;
    const val3 = slot3.textContent;

    if (val1 === val2 && val2 === val3) {
        const jackpotKey = val1 + val2 + val3;
        const rule = jackpotRules[jackpotKey];
        if (rule) {
            const winningEmoji = val1; // Get the winning emoji
            const emojiColor = emojiColors[winningEmoji]; // Get the color from mapping
            resultDisplay.style.backgroundColor = emojiColor || '#f9f9f9'; // Apply color, default if not found
            resultDisplay.style.color = 'white'; // Set text color for contrast
            const randomQuestion = rule.questions[Math.floor(Math.random() * rule.questions.length)];
            
            // Extract message text without the emoji and arrow
            const messageParts = rule.message.split(' → ');
            const messageText = messageParts.length > 1 ? messageParts[1] : messageParts[0];

            resultDisplay.innerHTML = `${val1}${val2}${val3}<br>${messageText}<br><br>${randomQuestion}`;
        } else {
            resultDisplay.style.backgroundColor = '#f9f9f9'; // Reset to default
            resultDisplay.style.color = '#555'; // Reset to default
            resultDisplay.textContent = `Jackpot! ${val1}${val2}${val3} - No specific rule defined for this combination. Drink!`;
        }
    } else {
        resultDisplay.style.backgroundColor = '#f9f9f9'; // Reset to default
        resultDisplay.style.color = '#555'; // Reset to default
        resultDisplay.textContent = 'No jackpot. Spin again!';
    }
}