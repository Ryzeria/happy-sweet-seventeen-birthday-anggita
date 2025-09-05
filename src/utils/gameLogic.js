// Game logic utilities and helper functions

// Shuffle array using Fisher-Yates algorithm
export const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Generate random number between min and max (inclusive)
export const randomBetween = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Generate random position within bounds
export const randomPosition = (width, height, margin = 0) => ({
  x: randomBetween(margin, width - margin),
  y: randomBetween(margin, height - margin)
});

// Calculate distance between two points
export const calculateDistance = (point1, point2) => {
  const dx = point2.x - point1.x;
  const dy = point2.y - point1.y;
  return Math.sqrt(dx * dx + dy * dy);
};

// Check if two rectangles intersect
export const checkCollision = (rect1, rect2) => {
  return (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y
  );
};

// Memory Game Logic
export const memoryGameLogic = {
  // Create card pairs from data
  createCardPairs: (cardData) => {
    const pairs = [...cardData, ...cardData].map((card, index) => ({
      ...card,
      uniqueId: index,
      isFlipped: false,
      isMatched: false,
      pairId: card.id
    }));
    return shuffleArray(pairs);
  },

  // Check if two cards match
  checkMatch: (card1, card2) => {
    return card1.pairId === card2.pairId && card1.uniqueId !== card2.uniqueId;
  },

  // Calculate score based on moves and time
  calculateScore: (matches, moves, timeElapsed, maxScore = 1000) => {
    const matchBonus = matches * 100;
    const movePenalty = Math.max(0, moves - matches * 2) * 10;
    const timePenalty = Math.floor(timeElapsed / 10) * 5;
    
    return Math.max(100, maxScore + matchBonus - movePenalty - timePenalty);
  }
};

// Jigsaw Puzzle Logic
export const jigsawLogic = {
  // Generate puzzle pieces
  generatePieces: (rows, cols, imageWidth, imageHeight) => {
    const pieces = [];
    const pieceWidth = imageWidth / cols;
    const pieceHeight = imageHeight / rows;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        pieces.push({
          id: row * cols + col,
          row,
          col,
          correctX: col * pieceWidth,
          correctY: row * pieceHeight,
          currentX: randomBetween(0, imageWidth - pieceWidth),
          currentY: randomBetween(0, imageHeight - pieceHeight),
          width: pieceWidth,
          height: pieceHeight,
          isPlaced: false
        });
      }
    }
    
    return shuffleArray(pieces);
  },

  // Check if piece is in correct position
  isInCorrectPosition: (piece, tolerance = 20) => {
    const dx = Math.abs(piece.currentX - piece.correctX);
    const dy = Math.abs(piece.currentY - piece.correctY);
    return dx <= tolerance && dy <= tolerance;
  },

  // Snap piece to correct position
  snapToPosition: (piece, tolerance = 30) => {
    if (jigsawLogic.isInCorrectPosition(piece, tolerance)) {
      return {
        ...piece,
        currentX: piece.correctX,
        currentY: piece.correctY,
        isPlaced: true
      };
    }
    return piece;
  }
};

// Word Search Logic
export const wordSearchLogic = {
  // Generate word search grid
  generateGrid: (size, words) => {
    const grid = Array(size).fill().map(() => Array(size).fill(''));
    const placedWords = [];

    // Place words in grid
    words.forEach(word => {
      let placed = false;
      let attempts = 0;
      const maxAttempts = 100;

      while (!placed && attempts < maxAttempts) {
        const direction = randomBetween(0, 7); // 8 directions
        const startRow = randomBetween(0, size - 1);
        const startCol = randomBetween(0, size - 1);

        if (wordSearchLogic.canPlaceWord(grid, word, startRow, startCol, direction, size)) {
          wordSearchLogic.placeWord(grid, word, startRow, startCol, direction);
          placedWords.push({
            word,
            startRow,
            startCol,
            direction,
            found: false
          });
          placed = true;
        }
        attempts++;
      }
    });

    // Fill empty cells with random letters
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        if (!grid[row][col]) {
          grid[row][col] = String.fromCharCode(65 + randomBetween(0, 25));
        }
      }
    }

    return { grid, placedWords };
  },

  // Check if word can be placed
  canPlaceWord: (grid, word, startRow, startCol, direction, size) => {
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],           [0, 1],
      [1, -1],  [1, 0],  [1, 1]
    ];

    const [deltaRow, deltaCol] = directions[direction];

    for (let i = 0; i < word.length; i++) {
      const row = startRow + i * deltaRow;
      const col = startCol + i * deltaCol;

      if (row < 0 || row >= size || col < 0 || col >= size) {
        return false;
      }

      if (grid[row][col] && grid[row][col] !== word[i]) {
        return false;
      }
    }

    return true;
  },

  // Place word in grid
  placeWord: (grid, word, startRow, startCol, direction) => {
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],           [0, 1],
      [1, -1],  [1, 0],  [1, 1]
    ];

    const [deltaRow, deltaCol] = directions[direction];

    for (let i = 0; i < word.length; i++) {
      const row = startRow + i * deltaRow;
      const col = startCol + i * deltaCol;
      grid[row][col] = word[i];
    }
  },

  // Check if selection matches a word
  checkSelection: (grid, selection, placedWords) => {
    const { startRow, startCol, endRow, endCol } = selection;
    const selectedText = wordSearchLogic.getSelectedText(grid, startRow, startCol, endRow, endCol);
    
    return placedWords.find(wordData => 
      wordData.word === selectedText || wordData.word === selectedText.split('').reverse().join('')
    );
  },

  // Get text from selection
  getSelectedText: (grid, startRow, startCol, endRow, endCol) => {
    const deltaRow = endRow > startRow ? 1 : endRow < startRow ? -1 : 0;
    const deltaCol = endCol > startCol ? 1 : endCol < startCol ? -1 : 0;
    
    let text = '';
    let currentRow = startRow;
    let currentCol = startCol;

    while (true) {
      text += grid[currentRow][currentCol];
      
      if (currentRow === endRow && currentCol === endCol) break;
      
      currentRow += deltaRow;
      currentCol += deltaCol;
    }

    return text;
  }
};

// Crossword Logic
export const crosswordLogic = {
  // Generate crossword grid from clues
  generateGrid: (size, clues) => {
    const grid = Array(size).fill().map(() => Array(size).fill({ letter: '', number: 0, isBlack: false }));
    
    // This is a simplified version - real crossword generation is quite complex
    // For demo purposes, we'll create a basic layout
    return grid;
  },

  // Check if word fits at position
  checkWordFit: (grid, word, row, col, direction) => {
    const size = grid.length;
    const isHorizontal = direction === 'across';
    
    for (let i = 0; i < word.length; i++) {
      const currentRow = isHorizontal ? row : row + i;
      const currentCol = isHorizontal ? col + i : col;
      
      if (currentRow >= size || currentCol >= size) return false;
      
      const cell = grid[currentRow][currentCol];
      if (cell.isBlack) return false;
      if (cell.letter && cell.letter !== word[i]) return false;
    }
    
    return true;
  }
};

// Bingo Logic
export const bingoLogic = {
  // Generate bingo card
  generateCard: (items, gridSize = 4) => {
    const shuffledItems = shuffleArray(items);
    const totalCells = gridSize * gridSize;
    const centerIndex = Math.floor(totalCells / 2);
    
    const card = shuffledItems.slice(0, totalCells).map((item, index) => ({
      ...item,
      id: index,
      isMarked: index === centerIndex, // Center is free space
      isFree: index === centerIndex
    }));
    
    return card;
  },

  // Check for winning patterns
  checkWin: (card, gridSize = 4) => {
    const patterns = bingoLogic.getWinningPatterns(gridSize);
    
    return patterns.some(pattern => 
      pattern.every(index => card[index] && card[index].isMarked)
    );
  },

  // Get all possible winning patterns
  getWinningPatterns: (gridSize) => {
    const patterns = [];
    
    // Rows
    for (let row = 0; row < gridSize; row++) {
      const pattern = [];
      for (let col = 0; col < gridSize; col++) {
        pattern.push(row * gridSize + col);
      }
      patterns.push(pattern);
    }
    
    // Columns
    for (let col = 0; col < gridSize; col++) {
      const pattern = [];
      for (let row = 0; row < gridSize; row++) {
        pattern.push(row * gridSize + col);
      }
      patterns.push(pattern);
    }
    
    // Diagonals
    const diagonal1 = [];
    const diagonal2 = [];
    for (let i = 0; i < gridSize; i++) {
      diagonal1.push(i * gridSize + i);
      diagonal2.push(i * gridSize + (gridSize - 1 - i));
    }
    patterns.push(diagonal1, diagonal2);
    
    return patterns;
  }
};

// Arcade Game Logic (Catch the Hearts)
export const arcadeLogic = {
  // Generate falling objects
  generateFallingObject: (containerWidth, containerHeight) => ({
    id: Date.now() + Math.random(),
    x: randomBetween(0, containerWidth - 40),
    y: -40,
    speed: randomBetween(2, 6),
    type: ['💕', '💖', '💝', '❤️', '🩷'][randomBetween(0, 4)],
    points: randomBetween(10, 50)
  }),

  // Update object positions
  updateObjects: (objects, containerHeight) => {
    return objects
      .map(obj => ({ ...obj, y: obj.y + obj.speed }))
      .filter(obj => obj.y < containerHeight + 40);
  },

  // Check collision with player
  checkCatch: (player, objects, catchRadius = 30) => {
    const caught = [];
    const remaining = [];

    objects.forEach(obj => {
      const distance = calculateDistance(
        { x: player.x + player.width / 2, y: player.y + player.height / 2 },
        { x: obj.x + 20, y: obj.y + 20 }
      );

      if (distance < catchRadius) {
        caught.push(obj);
      } else {
        remaining.push(obj);
      }
    });

    return { caught, remaining };
  }
};

// Quiz Logic
export const quizLogic = {
  // Shuffle quiz options
  shuffleOptions: (question) => ({
    ...question,
    options: shuffleArray(question.options.map((option, index) => ({
      text: option,
      originalIndex: index,
      id: index
    })))
  }),

  // Calculate quiz score
  calculateQuizScore: (answers, questions) => {
    let correct = 0;
    answers.forEach((answer, index) => {
      if (answer === questions[index].correctAnswer) {
        correct++;
      }
    });
    
    return {
      correct,
      total: questions.length,
      percentage: Math.round((correct / questions.length) * 100),
      score: correct * 100
    };
  }
};

// General game utilities
export const gameUtils = {
  // Format time in mm:ss format
  formatTime: (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  },

  // Calculate grade based on score
  calculateGrade: (score, maxScore) => {
    const percentage = (score / maxScore) * 100;
    
    if (percentage >= 90) return { grade: 'A', emoji: '🌟', message: 'Outstanding!' };
    if (percentage >= 80) return { grade: 'B', emoji: '⭐', message: 'Great job!' };
    if (percentage >= 70) return { grade: 'C', emoji: '👍', message: 'Good work!' };
    if (percentage >= 60) return { grade: 'D', emoji: '👌', message: 'Keep trying!' };
    return { grade: 'F', emoji: '💪', message: 'Don\'t give up!' };
  },

  // Generate encouragement message
  getEncouragementMessage: (attempts, score) => {
    const messages = [
      "You're doing amazing! 💕",
      "Keep going, you've got this! 🌟",
      "Every attempt makes you better! ✨",
      "I believe in you! 💖",
      "You're getting closer! 🎯",
      "Practice makes perfect! 💪",
      "You're so smart! 🧠",
      "I'm proud of your effort! 🏆"
    ];

    if (score > 80) {
      return "Wow! You're incredible! 🎉";
    } else if (attempts > 3) {
      return "Your persistence is inspiring! 💝";
    } else {
      return messages[randomBetween(0, messages.length - 1)];
    }
  }
};

export default {
  shuffleArray,
  randomBetween,
  randomPosition,
  calculateDistance,
  checkCollision,
  memoryGameLogic,
  jigsawLogic,
  wordSearchLogic,
  crosswordLogic,
  bingoLogic,
  arcadeLogic,
  quizLogic,
  gameUtils
};