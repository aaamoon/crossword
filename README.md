# Crossword Generator

An elegant online crossword puzzle generator that automatically arranges input words into crossword patterns.

## Features

- 🎯 Automatic crossword layout generation
- 🎲 Random word generation
- 💫 Elegant animations
- 🎮 Keyboard shortcuts support
- 📱 Responsive design
- 💎 Special highlighting for intersections
- 🎯 Scrabble-style letter scoring

## Online Demo

[Live Demo](https://aaamoon.github.io/crossword)

## Usage

1. Enter English words separated by commas in the input box
2. Click "Generate" button or press "G" key to generate crossword puzzles
3. Use "Reset" button or "R" key to clear the current content
4. Click "Random Words" or press "N" key to generate random word combinations

### Keyboard Shortcuts

- `G`: Generate crossword puzzles
- `R`: Reset
- `N`: Generate random word combinations


## Core Algorithm

The project uses the following algorithm to generate crossword puzzles:

1. The first word is placed horizontally
2. Traverse subsequent words, searching for possible intersections
3. Check the validity of word placement
4. Ensure all words have at least one intersection

## Letter Scoring System

Uses a letter scoring system similar to Scrabble:

- 1 point: A, E, I, L, N, O, R, S, T, U
- 2 points: D, G
- 3 points: B, C, M, P
- 4 points: F, H, V, W, Y
- 5 points: K
- 8 points: J, X
- 10 points: Q, Z

## License

MIT License

[MIT License](LICENSE)
