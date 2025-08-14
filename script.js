let gameState = {
    playerScore: 0,
    computerScore: 0,
    currentRound: 1,
    maxRounds: 5,
    gameOver: false,
    playerStreak: 0,
    computerStreak: 0,
    soundEnabled: true
};

// Choice mappings
const choices = {
    rock: { icon: '🪨', name: 'ROCK', power: 'Crushes Scissors' },
    paper: { icon: '📄', name: 'PAPER', power: 'Covers Rock' },
    scissors: { icon: '✂️', name: 'SCISSORS', power: 'Cuts Paper' }
};

// Sound effects
const sounds = {
    click: null,
    win: null,
    lose: null,
    tie: null
};

// DOM elements
const choiceButtons = document.querySelectorAll('.choice-btn');
const battleSection = document.getElementById('battle-section');
const gameOverSection = document.getElementById('game-over-section');
const currentRoundElement = document.getElementById('current-round');
const playerScoreElement = document.getElementById('player-score');
const computerScoreElement = document.getElementById('computer-score');
const playerChoiceIcon = document.getElementById('player-choice-icon');
const playerChoiceText = document.getElementById('player-choice-text');
const computerChoiceIcon = document.getElementById('computer-choice-icon');
const computerChoiceText = document.getElementById('computer-choice-text');
const resultMessage = document.getElementById('result-message');
const finalMessage = document.getElementById('final-message');
const finalPlayerScore = document.getElementById('final-player-score');
const finalComputerScore = document.getElementById('final-computer-score');
const playAgainBtn = document.getElementById('play-again-btn');
const newGameBtn = document.getElementById('new-game-btn');
const resetBtn = document.getElementById('reset-btn');
const soundBtn = document.getElementById('sound-btn');
const progressFill = document.getElementById('progress-fill');
const playerStreak = document.getElementById('player-streak');
const computerStreak = document.getElementById('computer-streak');
const impactZone = document.getElementById('impact-zone');
const trophy = document.getElementById('trophy');
const resultExplosion = document.querySelector('.result-explosion');
const playerAura = document.querySelector('.player-aura');
const computerAura = document.querySelector('.computer-aura');
const playerHealth = document.querySelector('.player-health');
const computerHealth = document.querySelector('.computer-health');

// Initialize game
function initGame() {
    // Initialize sound effects
    initSounds();

    // Add event listeners to choice buttons
    choiceButtons.forEach(button => {
        button.addEventListener('click', handlePlayerChoice);
    });

    // Add event listeners to control buttons
    playAgainBtn.addEventListener('click', resetGame);
    newGameBtn.addEventListener('click', resetGame);
    resetBtn.addEventListener('click', resetGame);
    soundBtn.addEventListener('click', toggleSound);

    // Update display
    updateDisplay();
    updateProgressBar();
}

// Initialize sound effects
function initSounds() {
    // Create audio context for better sound control
    try {
        sounds.click = createBeepSound(800, 0.1, 'square');
        sounds.win = createBeepSound(600, 0.3, 'sine');
        sounds.lose = createBeepSound(300, 0.3, 'sawtooth');
        sounds.tie = createBeepSound(500, 0.2, 'triangle');
    } catch (error) {
        console.log('Audio not supported');
        gameState.soundEnabled = false;
    }
}

// Create beep sound using Web Audio API
function createBeepSound(frequency, duration, type = 'sine') {
    return function() {
        if (!gameState.soundEnabled) return;

        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.value = frequency;
            oscillator.type = type;

            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + duration);
        } catch (error) {
            console.log('Sound playback failed');
        }
    };
}

// Toggle sound
function toggleSound() {
    gameState.soundEnabled = !gameState.soundEnabled;
    updateSoundButton();
    playSound('click');
}

// Update sound button appearance
function updateSoundButton() {
    const soundIcon = soundBtn.querySelector('.btn-icon');
    const soundText = soundBtn.querySelector('.btn-text');

    if (gameState.soundEnabled) {
        soundIcon.textContent = '🔊';
        soundText.textContent = 'Sound';
        soundBtn.classList.remove('muted');
    } else {
        soundIcon.textContent = '🔇';
        soundText.textContent = 'Sound';
        soundBtn.classList.add('muted');
    }
}

// Play sound effect
function playSound(soundType) {
    if (sounds[soundType] && gameState.soundEnabled) {
        sounds[soundType]();
    }
}

// Handle player choice
function handlePlayerChoice(event) {
    if (gameState.gameOver) return;

    const playerChoice = event.currentTarget.dataset.choice;
    playSound('click');

    // Add visual feedback to clicked button
    event.currentTarget.style.transform = 'translateY(-5px) scale(0.95)';
    setTimeout(() => {
        event.currentTarget.style.transform = '';
    }, 200);

    // Disable choice buttons during round
    choiceButtons.forEach(btn => btn.style.pointerEvents = 'none');

    const computerChoice = getComputerChoice();

    // Play the round with delay for suspense
    setTimeout(() => {
        playRound(playerChoice, computerChoice);
    }, 500);
}

// Get random computer choice
function getComputerChoice() {
    const choiceKeys = Object.keys(choices);
    const randomIndex = Math.floor(Math.random() * choiceKeys.length);
    return choiceKeys[randomIndex];
}

// Play a single round
function playRound(playerChoice, computerChoice) {
    // Show battle section with animation
    battleSection.style.display = 'block';
    battleSection.classList.add('fade-in');

    // Update choice displays with animation
    updateChoiceDisplay(playerChoice, computerChoice);

    // Show battle effects
    showBattleEffects();

    // Determine winner after battle animation
    setTimeout(() => {
        const roundResult = determineWinner(playerChoice, computerChoice);

        // Update scores and streaks
        updateScoresAndStreaks(roundResult);

        // Show impact effect
        showImpactEffect();

        // Show round result with delay
        setTimeout(() => {
            showRoundResult(roundResult);
            playResultSound(roundResult);
        }, 500);

        // Update display
        updateDisplay();
        updateProgressBar();
        updateHealthBars();

        // Check if game is over
        if (gameState.currentRound >= gameState.maxRounds) {
            setTimeout(() => {
                endGame();
            }, 3000);
        } else {
            // Prepare for next round
            gameState.currentRound++;
            setTimeout(() => {
                battleSection.style.display = 'none';
                battleSection.classList.remove('fade-in');
                // Re-enable choice buttons
                choiceButtons.forEach(btn => btn.style.pointerEvents = 'auto');
            }, 4000);
        }
    }, 1500);
}

// Update scores and streaks
function updateScoresAndStreaks(roundResult) {
    if (roundResult === 'player') {
        gameState.playerScore++;
        gameState.playerStreak++;
        gameState.computerStreak = 0;
    } else if (roundResult === 'computer') {
        gameState.computerScore++;
        gameState.computerStreak++;
        gameState.playerStreak = 0;
    } else {
        gameState.playerStreak = 0;
        gameState.computerStreak = 0;
    }
}

// Show battle effects
function showBattleEffects() {
    // Activate auras
    if (playerAura) playerAura.style.opacity = '1';
    if (computerAura) computerAura.style.opacity = '1';

    // Hide auras after animation
    setTimeout(() => {
        if (playerAura) playerAura.style.opacity = '0';
        if (computerAura) computerAura.style.opacity = '0';
    }, 1000);
}

// Show impact effect
function showImpactEffect() {
    if (impactZone) {
        impactZone.classList.add('impact-blast');
        setTimeout(() => {
            impactZone.classList.remove('impact-blast');
        }, 500);
    }
}

// Play result sound
function playResultSound(result) {
    switch (result) {
        case 'player':
            playSound('win');
            break;
        case 'computer':
            playSound('lose');
            break;
        case 'tie':
            playSound('tie');
            break;
    }
}

// Determine round winner
function determineWinner(playerChoice, computerChoice) {
    if (playerChoice === computerChoice) {
        return 'tie';
    }

    const winConditions = {
        rock: 'scissors',
        paper: 'rock',
        scissors: 'paper'
    };

    if (winConditions[playerChoice] === computerChoice) {
        return 'player';
    } else {
        return 'computer';
    }
}

// Update choice display in battle section
function updateChoiceDisplay(playerChoice, computerChoice) {
    // Player choice with animation
    setTimeout(() => {
        playerChoiceIcon.textContent = choices[playerChoice].icon;
        playerChoiceText.textContent = choices[playerChoice].name;
        playerChoiceIcon.style.animation = 'battleFloat 2s ease-in-out infinite';
    }, 200);

    // Computer choice with delay for suspense
    setTimeout(() => {
        computerChoiceIcon.textContent = choices[computerChoice].icon;
        computerChoiceText.textContent = choices[computerChoice].name;
        computerChoiceIcon.style.animation = 'battleFloat 2s ease-in-out infinite 1s';
    }, 800);
}

// Show round result
function showRoundResult(result) {
    // Trigger explosion effect
    if (resultExplosion) {
        resultExplosion.classList.add('result-explosion-active');
        setTimeout(() => {
            resultExplosion.classList.remove('result-explosion-active');
        }, 800);
    }

    // Remove previous result classes
    resultMessage.classList.remove('win', 'lose', 'tie');

    // Add streak information
    let streakText = '';
    if (gameState.playerStreak > 1) {
        streakText = ` (${gameState.playerStreak} Win Streak!)`;
    } else if (gameState.computerStreak > 1) {
        streakText = ` (Computer ${gameState.computerStreak} Win Streak!)`;
    }

    switch (result) {
        case 'player':
            resultMessage.textContent = `🎉 VICTORY!${streakText}`;
            resultMessage.classList.add('win');
            break;
        case 'computer':
            resultMessage.textContent = `💻 DEFEAT!${streakText}`;
            resultMessage.classList.add('lose');
            break;
        case 'tie':
            resultMessage.textContent = '🤝 DRAW!';
            resultMessage.classList.add('tie');
            break;
    }

    // Add pulse animation
    resultMessage.style.animation = 'pulse 0.6s ease-in-out';
    setTimeout(() => {
        resultMessage.style.animation = '';
    }, 600);
}

// Update display elements
function updateDisplay() {
    currentRoundElement.textContent = gameState.currentRound;
    playerScoreElement.textContent = gameState.playerScore;
    computerScoreElement.textContent = gameState.computerScore;

    // Update streak displays
    updateStreakDisplay();
}

// Update progress bar
function updateProgressBar() {
    if (progressFill) {
        const progress = (gameState.currentRound / gameState.maxRounds) * 100;
        progressFill.style.width = `${progress}%`;
    }
}

// Update health bars
function updateHealthBars() {
    if (playerHealth && computerHealth) {
        const playerHealthPercent = (gameState.playerScore / gameState.maxRounds) * 100;
        const computerHealthPercent = (gameState.computerScore / gameState.maxRounds) * 100;

        playerHealth.style.width = `${Math.min(playerHealthPercent, 100)}%`;
        computerHealth.style.width = `${Math.min(computerHealthPercent, 100)}%`;
    }
}

// Update streak display
function updateStreakDisplay() {
    if (playerStreak) {
        if (gameState.playerStreak > 1) {
            playerStreak.textContent = `🔥 ${gameState.playerStreak}`;
            playerStreak.style.display = 'block';
        } else {
            playerStreak.style.display = 'none';
        }
    }

    if (computerStreak) {
        if (gameState.computerStreak > 1) {
            computerStreak.textContent = `🔥 ${gameState.computerStreak}`;
            computerStreak.style.display = 'block';
        } else {
            computerStreak.style.display = 'none';
        }
    }
}

// End the game
function endGame() {
    gameState.gameOver = true;
    battleSection.style.display = 'none';
    gameOverSection.style.display = 'block';
    gameOverSection.classList.add('fade-in');

    // Update final scores
    finalPlayerScore.textContent = gameState.playerScore;
    finalComputerScore.textContent = gameState.computerScore;

    // Determine final winner and show message
    finalMessage.classList.remove('win', 'lose', 'tie');

    let trophyIcon = '';
    let victoryClass = '';

    if (gameState.playerScore > gameState.computerScore) {
        finalMessage.textContent = '🏆 CHAMPION! YOU WON THE GAME!';
        finalMessage.classList.add('win');
        trophyIcon = '🏆';
        victoryClass = 'victory-active';
        playSound('win');
    } else if (gameState.computerScore > gameState.playerScore) {
        finalMessage.textContent = '💻 GAME OVER! COMPUTER WINS!';
        finalMessage.classList.add('lose');
        trophyIcon = '💻';
        playSound('lose');
    } else {
        finalMessage.textContent = '🤝 EPIC TIE! PERFECTLY MATCHED!';
        finalMessage.classList.add('tie');
        trophyIcon = '🤝';
        playSound('tie');
    }

    // Update trophy
    if (trophy) {
        trophy.textContent = trophyIcon;
    }

    // Add victory effects for player win
    if (victoryClass) {
        gameOverSection.classList.add(victoryClass);
    }

    // Re-enable choice buttons
    choiceButtons.forEach(btn => btn.style.pointerEvents = 'auto');
}

// Reset game
function resetGame() {
    playSound('click');

    // Reset game state
    gameState = {
        playerScore: 0,
        computerScore: 0,
        currentRound: 1,
        maxRounds: 5,
        gameOver: false,
        playerStreak: 0,
        computerStreak: 0,
        soundEnabled: gameState.soundEnabled // Preserve sound setting
    };

    // Hide sections
    battleSection.style.display = 'none';
    gameOverSection.style.display = 'none';

    // Remove animation classes
    battleSection.classList.remove('fade-in');
    gameOverSection.classList.remove('fade-in', 'victory-active');

    // Reset animations
    if (playerChoiceIcon) playerChoiceIcon.style.animation = '';
    if (computerChoiceIcon) computerChoiceIcon.style.animation = '';
    if (resultMessage) resultMessage.style.animation = '';

    // Re-enable choice buttons
    choiceButtons.forEach(btn => btn.style.pointerEvents = 'auto');

    // Update display
    updateDisplay();
    updateProgressBar();
    updateHealthBars();
    updateSoundButton();
}

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', initGame);