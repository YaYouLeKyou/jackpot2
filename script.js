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
let currentLanguage = 'en'; // Default language

const slot1 = document.getElementById('slot1');
const slot2 = document.getElementById('slot2');
const slot3 = document.getElementById('slot3');
const spinButton = document.getElementById('spinButton');
const resultDisplay = document.getElementById('result');
const languageSelector = document.getElementById('language');
const emojiRainContainer = document.getElementById('emoji-rain-container'); // Get the new container
const emojiExplosionContainer = document.getElementById('emoji-explosion-container'); // Get the new explosion container

let spinning = false;
const jackpotChance = 0.6; // 60% chance of a jackpot

// Initialize slots with beer emojis on page load and attach event listener
document.addEventListener('DOMContentLoaded', () => {
    // Fetch rules from JSON
    fetch('rules.json')
        .then(response => response.json())
        .then(data => {
            jackpotRules = data; // Store the full rules object
            setLanguage(currentLanguage); // Set initial language
            spinButton.addEventListener('click', spin);
            languageSelector.addEventListener('change', (event) => {
                setLanguage(event.target.value);
            });
        })
        .catch(error => {
            console.error('Error loading jackpot rules:', error);
            resultDisplay.textContent = 'Error loading game. Please try again.';
        });
});

function setLanguage(lang) {
    currentLanguage = lang;
    // Update UI elements that are not part of jackpotRules
    document.querySelector('h1').textContent = {
        'en': 'Jackpot Drinking Game',
        'fr': 'Jeu à Boire Jackpot',
        'es': 'Juego de Beber Jackpot',
        'it': 'Gioco a Bere Jackpot'
    }[currentLanguage];
    spinButton.textContent = {
        'en': 'Spin',
        'fr': 'Lancer',
        'es': 'Girar',
        'it': 'Gira'
    }[currentLanguage];
    resultDisplay.textContent = {
        'en': 'Spin the wheel to start!',
        'fr': 'Lance la roue pour commencer !',
        'es': '¡Gira la rueda para empezar!',
        'it': 'Gira la ruota per iniziare!'
    }[currentLanguage];

    // Re-initialize slots with beer emojis in the current language
    slot1.textContent = '🍺';
    slot2.textContent = '🍺';
    slot3.textContent = '🍺';
}

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

// Function for emoji rain effect
function startEmojiRain(emoji, count) {
    if (!emojiRainContainer) return; // Ensure the container exists

    // Clear any existing emojis
    emojiRainContainer.innerHTML = '';

    for (let i = 0; i < count; i++) {
        const emojiElement = document.createElement('div');
        emojiElement.classList.add('falling-emoji');
        emojiElement.textContent = emoji;
        emojiElement.style.left = `${Math.random() * 100}vw`; // Random horizontal position
        emojiElement.style.animationDuration = `${Math.random() * 2 + 3}s`; // Random duration between 3 and 5 seconds
        emojiElement.style.animationDelay = `${Math.random() * 0.5}s`; // Staggered start

        emojiRainContainer.appendChild(emojiElement);

        // Remove the element after its animation finishes to prevent DOM clutter
        emojiElement.addEventListener('animationend', () => {
            emojiElement.remove();
        });
    }
}

// New function for emoji explosion effect
function triggerEmojiExplosion(emoji) {
    if (!emojiExplosionContainer) return;

    // Clear any existing explosion emojis
    emojiExplosionContainer.innerHTML = '';

    // Create a single large emoji for the explosion
    const explosionEmoji = document.createElement('div');
    explosionEmoji.classList.add('emoji-explosion');
    explosionEmoji.textContent = emoji;

    // Position it in the center of the screen
    explosionEmoji.style.left = '50%';
    explosionEmoji.style.top = '50%';

    emojiExplosionContainer.appendChild(explosionEmoji);

    // Remove the element after its animation finishes
    explosionEmoji.addEventListener('animationend', () => {
        explosionEmoji.remove();
    });
}


function checkResult() {
    const val1 = slot1.textContent;
    const val2 = slot2.textContent;
    const val3 = slot3.textContent;

    if (val1 === val2 && val2 === val3) {
        const jackpotKey = val1 + val2 + val3;
        const rule = jackpotRules[jackpotKey][currentLanguage]; // Access language-specific rule
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

            // Start the emoji rain!
            startEmojiRain(winningEmoji, 50); // Rain 50 of the winning emoji

            // Trigger the emoji explosion!
            triggerEmojiExplosion(winningEmoji);
        } else {
            resultDisplay.style.backgroundColor = '#f9f9f9'; // Reset to default
            resultDisplay.style.color = '#555'; // Reset to default
            resultDisplay.textContent = currentLanguage === 'en' ? `Jackpot! ${val1}${val2}${val3} - No specific rule defined for this combination. Drink!` : `Jackpot! ${val1}${val2}${val3} - Aucune règle spécifique définie pour cette combinaison. Bois !`;
        }
    } else {
        resultDisplay.style.backgroundColor = '#f9f9f9'; // Reset to default
        resultDisplay.style.color = '#555'; // Reset to default
        switch (currentLanguage) {
            case 'fr':
                resultDisplay.textContent = 'Pas de jackpot. Relance !';
                break;
            case 'es':
                resultDisplay.textContent = 'No hay jackpot. ¡Gira de nuevo!';
                break;
            case 'it':
                resultDisplay.textContent = 'Nessun jackpot. Gira di nuovo!';
                break;
            default:
                resultDisplay.textContent = 'No jackpot. Spin again!';
        }
    }
}