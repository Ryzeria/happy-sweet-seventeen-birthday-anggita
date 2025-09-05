import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, RotateCcw, Star, Sparkles } from 'lucide-react';
import Button from '../ui/Button';

const BingoLevel = ({ level, onComplete }) => {
  const [bingoCard, setBingoCard] = useState([]);
  const [markedItems, setMarkedItems] = useState(new Set());
  const [isWinner, setIsWinner] = useState(false);
  const [winningPattern, setWinningPattern] = useState([]);
  const [foundItems, setFoundItems] = useState(0);
  
  const gridSize = 4; // 4x4 grid
  const totalItems = gridSize * gridSize;
  const centerIndex = Math.floor(totalItems / 2);

  // Initialize bingo card
  useEffect(() => {
    const shuffled = [...level.content.items].sort(() => Math.random() - 0.5);
    const card = shuffled.slice(0, totalItems).map((item, index) => ({
      ...item,
      id: index,
      isMarked: index === centerIndex, // Center is free
      isFree: index === centerIndex
    }));
    
    setBingoCard(card);
    setMarkedItems(new Set([centerIndex])); // Center starts marked
    setFoundItems(1); // Count the free space
  }, [level.content.items, totalItems, centerIndex]);

  // Check for winning patterns
  useEffect(() => {
    if (bingoCard.length === 0) return;
    
    const patterns = getWinningPatterns();
    
    for (const pattern of patterns) {
      if (pattern.every(index => markedItems.has(index))) {
        setIsWinner(true);
        setWinningPattern(pattern);
        setTimeout(() => onComplete(), 2000);
        break;
      }
    }
  }, [markedItems, bingoCard, onComplete]);

  const getWinningPatterns = () => {
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
  };

  const handleItemClick = (index) => {
    if (isWinner) return;
    
    const newMarkedItems = new Set(markedItems);
    
    if (newMarkedItems.has(index)) {
      newMarkedItems.delete(index);
      setFoundItems(prev => prev - 1);
    } else {
      newMarkedItems.add(index);
      setFoundItems(prev => prev + 1);
    }
    
    setMarkedItems(newMarkedItems);
  };

  const resetGame = () => {
    const shuffled = [...level.content.items].sort(() => Math.random() - 0.5);
    const card = shuffled.slice(0, totalItems).map((item, index) => ({
      ...item,
      id: index,
      isMarked: index === centerIndex,
      isFree: index === centerIndex
    }));
    
    setBingoCard(card);
    setMarkedItems(new Set([centerIndex]));
    setFoundItems(1);
    setIsWinner(false);
    setWinningPattern([]);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Game Header */}
      <div className="text-center mb-8">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="text-6xl mb-4"
        >
          🎯
        </motion.div>
        
        <h2 className="text-3xl font-dancing text-white mb-4">
          Find Your Favorite Things!
        </h2>
        
        <p className="text-white/80 text-lg mb-6">
          Mark the things that make you special. Get a line (row, column, or diagonal) to win!
        </p>
      </div>

      {/* Game Stats */}
      <div className="flex justify-center gap-6 mb-8">
        <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
          <div className="flex items-center gap-2 text-white">
            <Star size={16} />
            <span>Found: {foundItems}/{totalItems}</span>
          </div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
          <div className="flex items-center gap-2 text-white">
            <Trophy size={16} />
            <span>Progress: {Math.round((foundItems / totalItems) * 100)}%</span>
          </div>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={resetGame}
          icon={<RotateCcw size={16} />}
        >
          New Card
        </Button>
      </div>

      {/* Bingo Card */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className="bg-white/10 backdrop-blur-sm p-6 rounded-3xl border border-white/20">
          <div className={`grid grid-cols-${gridSize} gap-3`}>
            {bingoCard.map((item, index) => {
              const isMarked = markedItems.has(index);
              const isWinning = winningPattern.includes(index);
              const isFree = item.isFree;
              
              return (
                <motion.button
                  key={index}
                  onClick={() => handleItemClick(index)}
                  disabled={isWinner}
                  className={`
                    aspect-square p-3 rounded-xl border-2 text-sm font-medium transition-all duration-300
                    ${isMarked 
                      ? isWinning
                        ? 'border-gold bg-gold text-white shadow-gold'
                        : isFree
                        ? 'border-purple-400 bg-purple-400/30 text-white'
                        : 'border-pink-400 bg-pink-400/30 text-white'
                      : 'border-white/30 bg-white/5 text-white/80 hover:border-white/50 hover:bg-white/15'
                    }
                    ${isWinner ? 'cursor-not-allowed' : 'cursor-pointer'}
                  `}
                  whileHover={!isWinner ? { scale: 1.05 } : {}}
                  whileTap={!isWinner ? { scale: 0.95 } : {}}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="flex flex-col items-center justify-center h-full gap-1">
                    {/* Item Emoji */}
                    <div className="text-lg">
                      {item.emoji || '💝'}
                    </div>
                    
                    {/* Item Name */}
                    <div className="text-xs leading-tight text-center">
                      {isFree ? 'FREE ❤️' : item.name || item}
                    </div>
                    
                    {/* Mark Indicator */}
                    {isMarked && !isFree && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute inset-2 bg-pink-400/20 rounded-lg flex items-center justify-center"
                      >
                        <div className="text-pink-400 text-xl">✓</div>
                      </motion.div>
                    )}

                    {/* Winning Highlight */}
                    {isWinning && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 bg-gold/20 rounded-xl border-2 border-gold"
                      >
                        <motion.div
                          animate={{ 
                            scale: [1, 1.1, 1],
                            rotate: [0, 5, -5, 0]
                          }}
                          transition={{ 
                            duration: 0.5, 
                            repeat: Infinity,
                            ease: "easeInOut" 
                          }}
                          className="absolute inset-0 flex items-center justify-center"
                        >
                          <Sparkles className="text-gold" size={20} />
                        </motion.div>
                      </motion.div>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Instructions */}
      {!isWinner && foundItems < 5 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/20 max-w-xl mx-auto"
        >
          <h3 className="text-lg font-dancing text-white mb-2">
            How to Play 🎮
          </h3>
          <p className="text-white/80 text-sm">
            Click on the things that represent you or that you love! 
            Get 4 in a row (horizontal, vertical, or diagonal) to win!
          </p>
        </motion.div>
      )}

      {/* Progress Encouragement */}
      {foundItems >= 5 && foundItems < 12 && !isWinner && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center bg-gradient-to-r from-pink-400/20 to-purple-400/20 p-4 rounded-2xl border border-pink-300/30 max-w-xl mx-auto"
        >
          <p className="text-white text-lg mb-2">
            You're doing great! 🌟
          </p>
          <p className="text-white/80 text-sm">
            Keep marking your favorite things - you're getting close to a BINGO!
          </p>
        </motion.div>
      )}

      {/* Winner Celebration */}
      <AnimatePresence>
        {isWinner && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="text-center mt-8"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0] 
              }}
              transition={{ 
                duration: 1, 
                repeat: Infinity,
                ease: "easeInOut" 
              }}
              className="text-8xl mb-4"
            >
              🎉
            </motion.div>
            
            <h2 className="text-4xl font-dancing text-white mb-4">
              BINGO! 🏆
            </h2>
            
            <div className="bg-gradient-to-r from-gold/30 to-yellow-400/30 backdrop-blur-sm p-6 rounded-2xl border border-gold/50 max-w-2xl mx-auto">
              <p className="text-white text-xl mb-4">
                You found all your favorite things in a perfect line!
              </p>
              <p className="text-white/90 text-lg">
                Just like this BINGO, you're a perfect match of all the wonderful things that make you uniquely amazing! 💕
              </p>
            </div>
            
            {/* Confetti Effect */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-2xl"
                  initial={{
                    x: "50%",
                    y: "50%",
                    scale: 0
                  }}
                  animate={{
                    x: `${Math.random() * 100}%`,
                    y: `${Math.random() * 100}%`,
                    scale: [0, 1, 0]
                  }}
                  transition={{
                    duration: 2,
                    delay: Math.random() * 1,
                    ease: "easeOut"
                  }}
                >
                  {['🎉', '✨', '🌟', '💖', '🏆'][Math.floor(Math.random() * 5)]}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .grid-cols-4 {
          grid-template-columns: repeat(4, minmax(0, 1fr));
        }
      `}</style>
    </div>
  );
};

export default BingoLevel;