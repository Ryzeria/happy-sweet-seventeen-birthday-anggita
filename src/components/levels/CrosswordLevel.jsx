import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Lightbulb, CheckCircle } from 'lucide-react';
import Button from '../ui/Button';

const CrosswordLevel = ({ level, onComplete }) => {
  const [answers, setAnswers] = useState({});
  const [selectedCell, setSelectedCell] = useState(null);
  const [currentWord, setCurrentWord] = useState(null);
  const [direction, setDirection] = useState('across');
  const [completedWords, setCompletedWords] = useState(new Set());
  const [showHints, setShowHints] = useState({});

  // Simple crossword data - you can expand this
  const crosswordData = {
    grid: 7, // 7x7 grid
    words: {
      across: [
        { id: 1, row: 1, col: 1, answer: 'LOVE', clue: 'What I feel for you (4)' },
        { id: 3, row: 3, col: 0, answer: 'KISS', clue: 'Sweet gesture of affection (4)' },
        { id: 5, row: 5, col: 2, answer: 'HEART', clue: 'What you stole from me (5)' }
      ],
      down: [
        { id: 2, row: 0, col: 2, answer: 'CUTE', clue: 'What you are every day (4)' },
        { id: 4, row: 2, col: 4, answer: 'SMILE', clue: 'Your most beautiful feature (5)' }
      ]
    }
  };

  const allWords = [...crosswordData.words.across, ...crosswordData.words.down];

  useEffect(() => {
    // Check if all words are completed
    const totalWords = allWords.length;
    if (completedWords.size === totalWords) {
      setTimeout(() => {
        onComplete();
      }, 2000);
    }
  }, [completedWords, allWords.length, onComplete]);

  useEffect(() => {
    // Check completed words whenever answers change
    allWords.forEach(word => {
      const wordAnswer = getWordFromGrid(word);
      if (wordAnswer === word.answer) {
        setCompletedWords(prev => new Set([...prev, word.id]));
      }
    });
  }, [answers]);

  const getWordFromGrid = (word) => {
    let result = '';
    const isAcross = crosswordData.words.across.includes(word);
    
    for (let i = 0; i < word.answer.length; i++) {
      const row = isAcross ? word.row : word.row + i;
      const col = isAcross ? word.col + i : word.col;
      const cellKey = `${row}-${col}`;
      result += answers[cellKey] || '';
    }
    
    return result;
  };

  const handleCellClick = (row, col) => {
    const cellKey = `${row}-${col}`;
    setSelectedCell(cellKey);
    
    // Find word that contains this cell
    const word = allWords.find(w => {
      const isAcross = crosswordData.words.across.includes(w);
      if (isAcross) {
        return w.row === row && col >= w.col && col < w.col + w.answer.length;
      } else {
        return w.col === col && row >= w.row && row < w.row + w.answer.length;
      }
    });
    
    setCurrentWord(word);
    setDirection(crosswordData.words.across.includes(word) ? 'across' : 'down');
  };

  const handleInputChange = (value, row, col) => {
    const cellKey = `${row}-${col}`;
    setAnswers(prev => ({
      ...prev,
      [cellKey]: value.toUpperCase()
    }));
  };

  const isCellInWord = (row, col, word) => {
    const isAcross = crosswordData.words.across.includes(word);
    if (isAcross) {
      return word.row === row && col >= word.col && col < word.col + word.answer.length;
    } else {
      return word.col === col && row >= word.row && row < word.row + word.answer.length;
    }
  };

  const getCellType = (row, col) => {
    return allWords.some(word => isCellInWord(row, col, word));
  };

  const resetCrossword = () => {
    setAnswers({});
    setCompletedWords(new Set());
    setSelectedCell(null);
    setCurrentWord(null);
    setShowHints({});
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-6xl mb-4"
        >
          📝
        </motion.div>
        
        <h2 className="text-3xl font-dancing text-white mb-4">
          Crossword of Love
        </h2>
        
        <p className="text-white/80 text-lg">
          Solve the crossword filled with our inside jokes and sweet memories!
        </p>
      </div>

      {/* Progress */}
      <div className="flex justify-center gap-4 mb-8">
        <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
          <div className="flex items-center gap-2 text-white">
            <CheckCircle size={16} />
            <span>Completed: {completedWords.size}/{allWords.length}</span>
          </div>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={resetCrossword}
          icon={<RotateCcw size={16} />}
        >
          Reset
        </Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Crossword Grid */}
        <div className="flex justify-center">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
            <div className="grid grid-cols-7 gap-1" style={{ width: 'fit-content' }}>
              {Array.from({ length: crosswordData.grid * crosswordData.grid }).map((_, index) => {
                const row = Math.floor(index / crosswordData.grid);
                const col = index % crosswordData.grid;
                const cellKey = `${row}-${col}`;
                const isWordCell = getCellType(row, col);
                const isSelected = selectedCell === cellKey;
                const isInCurrentWord = currentWord && isCellInWord(row, col, currentWord);

                // Check if cell is in a completed word
                const isInCompletedWord = allWords.some(word => 
                  completedWords.has(word.id) && isCellInWord(row, col, word)
                );

                // Find the word number for this cell
                const wordNumber = allWords.find(word => 
                  word.row === row && word.col === col
                )?.id;

                return (
                  <div key={cellKey} className="relative">
                    {isWordCell ? (
                      <div className="relative">
                        <input
                          type="text"
                          maxLength={1}
                          value={answers[cellKey] || ''}
                          onChange={(e) => handleInputChange(e.target.value, row, col)}
                          onClick={() => handleCellClick(row, col)}
                          className={`w-8 h-8 text-center text-sm font-bold border rounded transition-all duration-200 ${
                            isInCompletedWord
                              ? 'bg-green-400 text-white border-green-300'
                              : isSelected
                              ? 'bg-pink-400 text-white border-pink-300'
                              : isInCurrentWord
                              ? 'bg-pink-200 text-gray-800 border-pink-300'
                              : 'bg-white text-gray-800 border-gray-300'
                          } focus:outline-none focus:ring-2 focus:ring-pink-400`}
                        />
                        
                        {/* Word number */}
                        {wordNumber && (
                          <div className="absolute -top-1 -left-1 bg-pink-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">
                            {wordNumber}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="w-8 h-8 bg-gray-800"></div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Clues */}
        <div className="space-y-6">
          {/* Across Clues */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
            <h3 className="text-xl font-dancing text-white mb-4">Across</h3>
            <div className="space-y-3">
              {crosswordData.words.across.map((word) => (
                <div
                  key={word.id}
                  className={`p-3 rounded-lg transition-all duration-300 cursor-pointer ${
                    completedWords.has(word.id)
                      ? 'bg-green-400/20 border border-green-400/30'
                      : currentWord?.id === word.id
                      ? 'bg-pink-400/20 border border-pink-400/30'
                      : 'bg-white/5 hover:bg-white/10'
                  }`}
                  onClick={() => {
                    setCurrentWord(word);
                    setDirection('across');
                    setSelectedCell(`${word.row}-${word.col}`);
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-white font-bold text-lg">{word.id}.</span>
                      <span className="text-white/90">{word.clue}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {completedWords.has(word.id) && (
                        <CheckCircle className="text-green-400" size={16} />
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowHints(prev => ({
                            ...prev,
                            [word.id]: !prev[word.id]
                          }));
                        }}
                        icon={<Lightbulb size={14} />}
                      />
                    </div>
                  </div>
                  
                  {/* Hint */}
                  {showHints[word.id] && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-2 pt-2 border-t border-white/20"
                    >
                      <p className="text-yellow-200 text-sm">
                        Hint: {word.answer.length} letters - "{word.answer[0]}..."
                      </p>
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Down Clues */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
            <h3 className="text-xl font-dancing text-white mb-4">Down</h3>
            <div className="space-y-3">
              {crosswordData.words.down.map((word) => (
                <div
                  key={word.id}
                  className={`p-3 rounded-lg transition-all duration-300 cursor-pointer ${
                    completedWords.has(word.id)
                      ? 'bg-green-400/20 border border-green-400/30'
                      : currentWord?.id === word.id
                      ? 'bg-pink-400/20 border border-pink-400/30'
                      : 'bg-white/5 hover:bg-white/10'
                  }`}
                  onClick={() => {
                    setCurrentWord(word);
                    setDirection('down');
                    setSelectedCell(`${word.row}-${word.col}`);
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-white font-bold text-lg">{word.id}.</span>
                      <span className="text-white/90">{word.clue}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {completedWords.has(word.id) && (
                        <CheckCircle className="text-green-400" size={16} />
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowHints(prev => ({
                            ...prev,
                            [word.id]: !prev[word.id]
                          }));
                        }}
                        icon={<Lightbulb size={14} />}
                      />
                    </div>
                  </div>
                  
                  {/* Hint */}
                  {showHints[word.id] && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-2 pt-2 border-t border-white/20"
                    >
                      <p className="text-yellow-200 text-sm">
                        Hint: {word.answer.length} letters - "{word.answer[0]}..."
                      </p>
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      {completedWords.size === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mt-8 bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20"
        >
          <h3 className="text-lg font-dancing text-white mb-3">
            How to Play
          </h3>
          <p className="text-white/80 mb-4">
            Click on a cell and start typing to fill in the crossword. 
            Click on clues to highlight the corresponding word in the grid.
          </p>
          <p className="text-white/70 text-sm">
            Need help? Click the lightbulb icon next to each clue for a hint!
          </p>
        </motion.div>
      )}

      {/* Completion Celebration */}
      {completedWords.size === allWords.length && allWords.length > 0 && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center mt-8"
        >
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-3xl font-dancing text-white mb-4">
            Crossword Master!
          </h3>
          <p className="text-white/90 text-lg max-w-2xl mx-auto">
            You solved all the clues! Just like this crossword, our love story 
            has all the right pieces that fit together perfectly.
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default CrosswordLevel;