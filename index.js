const LETTER_SCORES = {
	A: 1,
	B: 3,
	C: 3,
	D: 2,
	E: 1,
	F: 4,
	G: 2,
	H: 4,
	I: 1,
	J: 8,
	K: 5,
	L: 1,
	M: 3,
	N: 1,
	O: 1,
	P: 3,
	Q: 10,
	R: 1,
	S: 1,
	T: 1,
	U: 1,
	V: 4,
	W: 4,
	X: 8,
	Y: 4,
	Z: 10,
};

class WordPlacement {
	constructor(word, x, y, isHorizontal) {
		this.word = word.toUpperCase();
		this.x = x;
		this.y = y;
		this.isHorizontal = isHorizontal;
	}
}

function findAllIntersections(words) {
	let placements = [];
	let grid = new Map();
	let hasIntersection = new Set();

	// Place the first word horizontally in the center
	let firstWord = words[0].toUpperCase();
	let startX = 0;
	let startY = 0;
	placements.push(new WordPlacement(firstWord, startX, startY, true));

	// Record the letter positions of the first word
	for (let i = 0; i < firstWord.length; i++) {
		grid.set(`${startX + i},${startY}`, firstWord[i]);
	}

	// Try to place remaining words
	for (let i = 1; i < words.length; i++) {
		let currentWord = words[i].toUpperCase();
		let placed = false;

		// Iterate through each placed position
		for (let [pos, letter] of grid) {
			let [gx, gy] = pos.split(',').map(Number);

			// Try both horizontal and vertical directions
			for (let isHorizontal of [true, false]) {
				// Check if current word contains this letter
				let letterIndex = currentWord.indexOf(letter);
				while (letterIndex !== -1) {
					let canPlace = true;
					let newX = isHorizontal ? gx - letterIndex : gx;
					let newY = isHorizontal ? gy : gy - letterIndex;

					// Check if it conflicts with other words
					const usedWords = new Set();
					for (let j = 0; j < currentWord.length; j++) {
						const checkX = isHorizontal ? newX + j : newX;
						const checkY = isHorizontal ? newY : newY + j;
						const gridKey = `${checkX},${checkY}`;
						const existingLetter = grid.get(gridKey);

						if (existingLetter && existingLetter !== currentWord[j]) {
							canPlace = false;
							usedWords.add(existingLetter);
							break;
						}
					}

					if (canPlace) {
						placements.push(
							new WordPlacement(currentWord, newX, newY, isHorizontal)
						);

						// Update the grid
						for (let j = 0; j < currentWord.length; j++) {
							let updateX = isHorizontal ? newX + j : newX;
							let updateY = isHorizontal ? newY : newY + j;
							grid.set(`${updateX},${updateY}`, currentWord[j]);
						}

						placed = true;
						hasIntersection.add(currentWord);
						hasIntersection.add(firstWord);
						break;
					}

					// Find the next matching position
					letterIndex = currentWord.indexOf(letter, letterIndex + 1);
				}

				if (placed) break;
			}

			if (placed) break;
		}

		if (!placed) {
			alert(`Unable to place word: ${currentWord}`);
			return null;
		}
	}

	const nonIntersectingWords = words.filter(
		(word) => !hasIntersection.has(word.toUpperCase())
	);

	if (nonIntersectingWords.length > 0) {
		alert(
			`The following words cannot intersect with others: ${nonIntersectingWords.join(
				', '
			)}`
		);
		return null;
	}

	return placements;
}

async function generate() {
	const generateBtn = document.getElementById('generateBtn');
	generateBtn.classList.add('loading');

	try {
		const wordsInput = document.getElementById('words').value;
		const words = wordsInput.split(',').map((w) => w.trim());

		const nonEnglishWords = words.filter((word) => !/^[A-Za-z]+$/.test(word));
		if (nonEnglishWords.length > 0) {
			alert(
				`The following words contain non-English characters and cannot be generated: ${nonEnglishWords.join(
					', '
				)}`
			);
			return;
		}

		if (words.length < 2) {
			alert('Please enter at least two words, separated by commas');
			return;
		}

		const board = document.getElementById('board');
		board.innerHTML = '';

		const placements = findAllIntersections(words);
		if (!placements) return;

		// Calculate boundaries
		let minX = 0,
			maxX = 0,
			minY = 0,
			maxY = 0;
		placements.forEach((p) => {
			if (p.isHorizontal) {
				maxX = Math.max(maxX, p.x + p.word.length);
				minX = Math.min(minX, p.x);
				maxY = Math.max(maxY, p.y + 1);
				minY = Math.min(minY, p.y);
			} else {
				maxX = Math.max(maxX, p.x + 1);
				minX = Math.min(minX, p.x);
				maxY = Math.max(maxY, p.y + p.word.length);
				minY = Math.min(minY, p.y);
			}
		});

		// Set grid dimensions
		const gridWidth = maxX - minX;
		const gridHeight = maxY - minY;
		board.style.gridTemplateColumns = `repeat(${gridWidth}, 65px)`;

		// Create a Set to store intersection positions
		const intersections = new Set();

		// Find all intersection points
		for (let i = 0; i < placements.length; i++) {
			for (let j = i + 1; j < placements.length; j++) {
				const p1 = placements[i];
				const p2 = placements[j];

				// Check if two words intersect
				for (let x = 0; x < p1.word.length; x++) {
					for (let y = 0; y < p2.word.length; y++) {
						let p1X = p1.isHorizontal ? p1.x + x : p1.x;
						let p1Y = p1.isHorizontal ? p1.y : p1.y + x;
						let p2X = p2.isHorizontal ? p2.x + y : p2.x;
						let p2Y = p2.isHorizontal ? p2.y : p2.y + y;

						if (p1X === p2X && p1Y === p2Y) {
							intersections.add(`${p1X},${p1Y}`);
						}
					}
				}
			}
		}

		// Add intersection style when creating tiles
		placements.forEach((placement) => {
			const word = placement.word;
			for (let i = 0; i < word.length; i++) {
				const tile = document.createElement('div');
				tile.className = 'tile';

				// Check if it's an intersection point
				const x = placement.isHorizontal ? placement.x + i : placement.x;
				const y = placement.isHorizontal ? placement.y : placement.y + i;
				if (intersections.has(`${x},${y}`)) {
					tile.classList.add('intersection');
				}

				tile.innerHTML = `
          ${word[i]}
          <span class="score">${LETTER_SCORES[word[i]]}</span>
        `;

				if (placement.isHorizontal) {
					tile.style.gridColumn = placement.x - minX + i + 1;
					tile.style.gridRow = placement.y - minY + 1;
				} else {
					tile.style.gridColumn = placement.x - minX + 1;
					tile.style.gridRow = placement.y - minY + i + 1;
				}

				board.appendChild(tile);

				// Add delayed display animation
				setTimeout(() => {
					tile.classList.add('show');
				}, (placement.isHorizontal ? i : i) * 100); // 100ms delay for each letter
			}
		});
	} catch (error) {
		alert('An error occurred while generating the crossword');
		console.error(error);
	} finally {
		generateBtn.classList.remove('loading');
	}
}

function reset() {
	document.getElementById('words').value = '';
	document.getElementById('board').innerHTML = '';
}

const sampleWords = [
	'CAT',
	'DOG',
	'BIRD',
	'FISH',
	'LION',
	'TIGER',
	'BEAR',
	'WOLF',
	'PANDA',
	'MOUSE',
	'SNAKE',
	'EAGLE',
	'SHARK',
	'WHALE',
	'SEAL',
];

function generateRandom(attempts = 0) {
	const MAX_ATTEMPTS = 10;
	if (attempts >= MAX_ATTEMPTS) {
		alert(
			'Unable to generate a suitable random word combination, please try again'
		);
		return;
	}

	const randomWords = new Set();
	// Choose a longer word as the first word to increase the intersection probability
	const longerWords = sampleWords.filter((word) => word.length >= 4);
	const firstWord = longerWords[Math.floor(Math.random() * longerWords.length)];
	randomWords.add(firstWord);

	// Select words for the remaining positions
	for (let i = 0; i < 2; i++) {
		// Find words that have common letters with the selected words
		const compatibleWords = sampleWords.filter((word) => {
			if (randomWords.has(word)) return false;

			// Check if there are at least two common letters
			return Array.from(randomWords).some((selectedWord) => {
				const commonLetters = word
					.split('')
					.filter((letter) => selectedWord.includes(letter));
				return commonLetters.length >= 2;
			});
		});

		if (compatibleWords.length === 0) {
			// If no compatible words found, start over
			return generateRandom(attempts + 1);
		}

		const nextWord =
			compatibleWords[Math.floor(Math.random() * compatibleWords.length)];
		randomWords.add(nextWord);
	}

	document.getElementById('words').value = Array.from(randomWords).join(',');
	generate();
}

document.addEventListener('keydown', function (event) {
	if (event.target.tagName === 'INPUT') return;

	switch (event.key.toLowerCase()) {
		case 'g':
			generate();
			break;
		case 'r':
			reset();
			break;
		case 'n':
			generateRandom();
			break;
	}
});

generate();
