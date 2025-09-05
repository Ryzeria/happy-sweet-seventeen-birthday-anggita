import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, RotateCcw, Trophy, Eye } from 'lucide-react';
import Button from '../ui/Button';
import { wordSearchLogic } from '../../utils/gameLogic';

const WordSearchLevel = ({ level, onComplete }) => {
  const [grid, setGrid] = useState([]);
  const [words, setWords] = useState([]);
  const [foundWords, setFoundWords] = useState([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedCells, setSelectedCells] = useState([]);
  const [startCell, setStartCell] = useState(null);
  const [showHints, setShowHints] = useState(false);

  const gridSize = 12;
  const wordsToFind = level.content.words;

  // Generate word search grid
  useEffect(() => {
    const { grid: newGrid, placedWords } = wordSearchLogic.generateGrid(gridSize, wordsToFind);
    setGrid(newGrid);
    setWords(placedWords);
  }, [gridSize, wordsToFind]);

  // Check completion
  useEffect(() => {
    if (foundWords.length === wordsToFind.length && foundWords.length > 0) {
      setTimeout(() => {
        onComplete();
      }, 2000);
    }
  }, [foundWords, wordsToFind.length, onComplete]);

  const handleCellMouseDown = (row, col) => {
    setIsSelecting(true);
    setStartCell({ row, col });
    setSelectedCells([{ row, col }]);
  };

  const handleCellMouseOver = (row, col) => {
    if (!isSelecting || !startCell) return;

    // Calculate selection line from start to current cell
    const cells = getLineCells(startCell.row, startCell.col, row, col);
    setSelectedCells(cells);
  };

  const handleCellMouseUp = () => {
    if (!isSelecting || selectedCells.length < 2) {
      setIsSelecting(false);
      setSelectedCells([]);
      setStartCell(null);
      return;
    }

    // Check if selection matches any word
    const selection = {
      startRow: selectedCells[0].row,
      startCol: selectedCells[0].col,
      endRow: selectedCells[selectedCells.length - 1].row,
      endCol: selectedCells[selectedCells.length - 1].col
    };

    const matchedWord = wordSearchLogic.checkSelection(grid, selection, words);
    
    if (matchedWord && !foundWords.includes(matchedWord.word)) {
      setFoundWords(prev => [...prev, matchedWord.word]);
    }

    setIsSelecting(false);
    setSelectedCells([]);
    setStartCell(null);
  };

  const getLineCells = (startRow, startCol, endRow, endCol) => {
    const cells = [];
    const deltaRow = endRow > startRow ? 1 : endRow < startRow ? -1 : 0;
    const deltaCol = endCol > startCol ? 1 : endCol < startCol ? -1 : 0;
    
    // Only allow straight lines (horizontal, vertical, diagonal)
    if (deltaRow !== 0 && deltaCol !== 0) {
      // Diagonal - must be equal distance
      if (Math.abs(endRow - startRow) !== Math.abs(endCol - startCol)) {
        return [{ row: startRow, col: startCol }];
      }
    }

    let currentRow = startRow;
    let currentCol = startCol;
    
    while (true) {
      cells.push({ row: currentRow, col: currentCol });
      
      if (currentRow === endRow && currentCol === endCol) break;
      
      if (currentRow !== endRow) currentRow += deltaRow;
      if (currentCol !== endCol) currentCol += deltaCol;
      
      // Safety check
      if (cells.length > gridSize * 2) break;
    }
    
    return cells;
  };

  const isCellSelected = (row, col) => {
    return selectedCells.some(cell => cell.row === row && cell.col === col);
  };

  const isCellInFoundWord = (row, col) => {
    return words.some(wordData => {
      if (!foundWords.includes(wordData.word)) return false;
      
      const wordCells = getWordCells(wordData);
      return wordCells.some(cell => cell.row === row && cell.col === col);
    });
  };

  const getWordCells = (wordData) => {
    const cells = [];
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],           [0, 1],
      [1, -1],  [1, 0],  [1, 1]
    ];

    const [deltaRow, deltaCol] = directions[wordData.direction];

    for (let i = 0; i < wordData.word.length; i++) {
      cells.push({
        row: wordData.startRow + i * deltaRow,
        col: wordData.startCol + i * deltaCol
      });
    }

    return cells;
  };

  const resetGame = () => {
    const { grid: newGrid, placedWords } = wordSearchLogic.generateGrid(gridSize, wordsToFind);
    setGrid(newGrid);
    setWords(placedWords);
    setFoundWords([]);
    setSelectedCells([]);
    setStartCell(null);
    setIsSelecting(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="text-6xl mb-4"
        >
          🔍
        </motion.div>
        <h2 className="text-3xl font-dancing text-white mb-4">
          Find the Beautiful Words
        </h2>
        <p className="text-white/80 text-lg">
          All these words describe you perfectly! Find them hidden in the grid.
        </p>
      </div>

      {/* Game Controls */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
          <div className="flex items-center gap-2 text-white">
            <Trophy size={16} />
            <span>Found: {foundWords.length}/{wordsToFind.length}</span>
          </div>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={() => setShowHints(!showHints)}
          icon={<Eye size={16} />}
        >
          {showHints ? 'Hide' : 'Show'} Hints
        </Button>

        <Button
          variant="secondary"
          size="sm"
          onClick={resetGame}
          icon={<RotateCcw size={16} />}
        >
          New Grid
        </Button>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="w-full bg-white/20 rounded-full h-3">
          <motion.div 
            className="bg-gradient-to-r from-green-400 to-emerald-500 h-3 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(foundWords.length / wordsToFind.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Word Search Grid */}
        <div className="lg:col-span-2">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4">
            <div 
              className="grid gap-1 select-none"
              style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
              onMouseLeave={() => {
                if (isSelecting) {
                  setIsSelecting(false);
                  setSelectedCells([]);
                  setStartCell(null);
                }
              }}
            >
              {grid.map((row, rowIndex) =>
                row.map((letter, colIndex) => (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className={`
                      w-8 h-8 flex items-center justify-center text-sm font-bold cursor-pointer
                      border border-white/20 rounded transition-all duration-200
                      ${isCellInFoundWord(rowIndex, colIndex)
                        ? 'bg-green-400 text-white border-green-400'
                        : isCellSelected(rowIndex, colIndex)
                        ? 'bg-pink-400 text-white border-pink-400'
                        : 'bg-white/5 text-white/80 hover:bg-white/20'
                      }
                    `}
                    onMouseDown={() => handleCellMouseDown(rowIndex, colIndex)}
                    onMouseOver={() => handleCellMouseOver(rowIndex, colIndex)}
                    onMouseUp={handleCellMouseUp}
                  >
                    {letter}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Words List */}
        <div className="space-y-6">
          {/* Words to Find */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
            <h3 className="text-xl font-dancing text-white mb-4 flex items-center gap-2">
              <Search size={20} />
              Words to Find
            </h3>
            <div className="space-y-2">
              {wordsToFind.map((word, index) => (
                <motion.div
                  key={word}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`
                    p-2 rounded-lg transition-all duration-300
                    ${foundWords.includes(word)
                      ? 'bg-green-400/20 text-green-300 line-through'
                      : 'bg-white/5 text-white/80'
                    }
                  `}
                >
                  {foundWords.includes(word) && <span className="mr-2">✓</span>}
                  {word}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Hints */}
          {showHints && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-yellow-400/20 border border-yellow-400/30 rounded-2xl p-6"
            >
              <h3 className="text-lg font-dancing text-yellow-200 mb-3">
                💡 Hints
              </h3>
              <div className="space-y-2 text-yellow-200/80 text-sm">
                <p>• Words can be horizontal, vertical, or diagonal</p>
                <p>• Words can be forwards or backwards</p>
                <p>• Click and drag to select a word</p>
                <p>• All words describe your amazing qualities!</p>
              </div>
            </motion.div>
          )}

          {/* Encouragement */}
          {foundWords.length > 0 && foundWords.length < wordsToFind.length && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-pink-400/20 border border-pink-400/30 rounded-2xl p-4 text-center"
            >
              <p className="text-pink-200 text-sm">
                Great job! You've found {foundWords.length} beautiful words that describe you! 🌟
              </p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Instructions */}
      {foundWords.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mt-8 bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20"
        >
          <h3 className="text-lg font-dancing text-white mb-3">
            How to Play 🎮
          </h3>
          <p className="text-white/80 mb-4">
            Click and drag across letters to select words. Look for words hidden horizontally, vertically, and diagonally!
          </p>
          <p className="text-white/70 text-sm">
            Every word in this puzzle is a perfect description of you! 💕
          </p>
        </motion.div>
      )}

      {/* Completion Celebration */}
      {foundWords.length === wordsToFind.length && foundWords.length > 0 && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center mt-8"
        >
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-3xl font-dancing text-white mb-4">
            All Words Found!
          </h3>
          <p className="text-white/90 text-lg max-w-2xl mx-auto">
            You found all the beautiful words that describe you! 
            Just like finding these words, discovering your amazing qualities is always a joy! ✨💕
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default WordSearchLevel;