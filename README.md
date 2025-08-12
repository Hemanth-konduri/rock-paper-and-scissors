# 🎮 Rock Paper Scissors Game

A fun and interactive 5-round Rock Paper Scissors game built with vanilla HTML, CSS, and JavaScript.

## 🎯 Features

- **5-Round Gameplay**: Complete game consists of exactly 5 rounds
- **Real-time Scoring**: Live score tracking for both player and computer
- **Round Counter**: Shows current round progress (e.g., "Round: 3/5")
- **Visual Feedback**: Animated results and smooth transitions
- **Responsive Design**: Works on desktop and mobile devices
- **Play Again Option**: Reset button to start a new game
- **No External Dependencies**: Built with pure HTML, CSS, and JavaScript

## 🎮 How to Play

1. **Choose Your Move**: Click on Rock (🪨), Paper (📄), or Scissors (✂️)
2. **Computer's Turn**: The computer will randomly select its move
3. **Round Result**: See who wins the round with visual feedback
4. **Score Tracking**: Watch your score update in real-time
5. **Game Completion**: After 5 rounds, see the final winner
6. **Play Again**: Click "Play Again" to start a new game

## 🏆 Game Rules

- **Rock** beats **Scissors**
- **Scissors** beats **Paper**
- **Paper** beats **Rock**
- Same choices result in a **Tie**

## 🎨 Game States

### During Gameplay
- Round counter shows current progress
- Score board displays live scores
- Battle section shows both choices and round result

### Game Over Messages
- **"🏆 Congratulations! You Won The Game!"** - When player wins more rounds
- **"💻 Game Over! Computer Wins The Game!"** - When computer wins more rounds
- **"🤝 It's a Tie Game! Try Again!"** - When both have equal wins

## 🚀 Getting Started

1. Open `index.html` in your web browser
2. Start playing immediately - no setup required!

## 📁 File Structure

```
rock-paper-and-scissors/
├── index.html      # Main HTML structure
├── style.css       # Styling and animations
├── script.js       # Game logic and interactions
└── README.md       # This file
```

## 🎯 Technical Implementation

- **Pure JavaScript**: No external frameworks or libraries
- **Event Listeners**: All interactions handled with addEventListener
- **DOM Manipulation**: Dynamic updates using vanilla JavaScript
- **CSS Animations**: Smooth transitions and visual feedback
- **Responsive Design**: Mobile-friendly layout

## 🎮 Game Flow

1. Player selects a choice (Rock, Paper, or Scissors)
2. Computer randomly generates its choice
3. Round winner is determined based on game rules
4. Scores are updated and displayed
5. Round counter advances
6. After 5 rounds, final winner is declared
7. Option to play again resets the entire game

Enjoy playing! 🎉