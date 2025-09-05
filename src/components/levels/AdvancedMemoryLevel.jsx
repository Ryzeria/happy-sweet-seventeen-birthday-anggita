import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Trophy, Clock, Zap } from 'lucide-react';
import Button from '../ui/Button';

const AdvancedMemoryLevel = ({ level, onComplete }) => {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [moves, setMoves] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [showPreview, setShowPreview] = useState(true);
  const [previewTime, setPreviewTime] = useState(5);

  const gridSize = 5; // 5x5 = 25 cards (harder than basic)
  const timeLimit = level.content.timeLimit || 120;

  // Initialize cards
  useEffect(() => {
    const cardImages = level.content.cards || [
      "roleplay-era", "study-session", "reunion-2022", "jadian-day",
      "discord-date", "birthday-celebration", "anniversary", "cute-moment",
      "special-place", "recent-photo", "first-meeting", "lost-contact",
      "future-dreams"
    ];

    // Create pairs (take only needed amount for grid)
    const pairsNeeded = Math.floor((gridSize * gridSize) / 2);
    const selectedImages = cardImages.slice(0, pairsNeeded);
    const gameCards = [...selectedImages, ...selectedImages].map((image, index) => ({
      id: Math.floor(index / 2),
      image: `/images/photos/${image}.jpg`,
      title: image.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
      uniqueId: index,
      isFlipped: false,
      isMatched: false
    }));
    
    // Add one single card if odd number of cells
    if ((gridSize * gridSize) % 2 === 1) {
      gameCards.push({
        id: pairsNeeded,
        image: `/images/photos/bonus-memory.jpg`,
        title: "Bonus Memory",
        uniqueId: gameCards.length,
        isFlipped: false,
        isMatched: false,
        isSingle: true
      });
    }
    
    // Shuffle cards
    const shuffled = gameCards.sort(() => Math.random() - 0.5);
    setCards(shuffled);
  }, [gridSize]);

  // Timer
  useEffect(() => {
    let interval;
    if (gameStarted && timeElapsed < timeLimit && matchedPairs.length < Math.floor((gridSize * gridSize) / 2)) {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameStarted, timeElapsed, timeLimit, matchedPairs.length, gridSize]);

  // Preview countdown
  useEffect(() => {
    if (showPreview && previewTime > 0) {
      const timer = setTimeout(() => {
        setPreviewTime(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (showPreview && previewTime === 0) {
      setShowPreview(false);
      setGameStarted(true);
    }
  }, [showPreview, previewTime]);

  // Check for matches
  useEffect(() => {
    if (flippedCards.length === 2) {
      setIsChecking(true);
      setMoves(prev => prev + 1);
      
      const [first, second] = flippedCards;
      const firstCard = cards.find(card => card.uniqueId === first);
      const secondCard = cards.find(card => card.uniqueId === second);
      
      if (firstCard.id === secondCard.id) {
        // Match found
        setTimeout(() => {
          setMatchedPairs(prev => [...prev, firstCard.id]);
          setCards(prev => prev.map(card => 
            card.id === firstCard.id 
              ? { ...card, isMatched: true }
              : card
          ));
          setStreak(prev => {
            const newStreak = prev + 1;
            setBestStreak(current => Math.max(current, newStreak));
            return newStreak;
          });
          setFlippedCards([]);
          setIsChecking(false);
        }, 1000);
      } else {
        // No match
        setStreak(0);
        setTimeout(() => {
          setCards(prev => prev.map(card => 
            flippedCards.includes(card.uniqueId)
              ? { ...card, isFlipped: false }
              : card
          ));
          setFlippedCards([]);
          setIsChecking(false);
        }, 1500);
      }
    }
  }, [flippedCards, cards]);

  // Check completion
  useEffect(() => {
    const totalPairs = Math.floor((gridSize * gridSize) / 2);
    if (matchedPairs.length === totalPairs && matchedPairs.length > 0) {
      setTimeout(() => {
        onComplete();
      }, 1000);
    } else if (timeElapsed >= timeLimit && gameStarted) {
      // Time's up
      setGameStarted(false);
    }
  }, [matchedPairs.length, gridSize, timeElapsed, timeLimit, gameStarted, onComplete]);

  const handleCardClick = (cardId) => {
    if (isChecking || flippedCards.length >= 2 || showPreview) return;
    
    const card = cards.find(c => c.uniqueId === cardId);
    if (card.isFlipped || card.isMatched) return;

    setCards(prev => prev.map(c => 
      c.uniqueId === cardId 
        ? { ...c, isFlipped: true }
        : c
    ));
    
    setFlippedCards(prev => [...prev, cardId]);
  };

  const resetGame = () => {
    const cardImages = level.content.cards || [
      "roleplay-era", "study-session", "reunion-2022", "jadian-day",
      "discord-date", "birthday-celebration"
    ];

    const pairsNeeded = Math.floor((gridSize * gridSize) / 2);
    const selectedImages = cardImages.slice(0, pairsNeeded);
    const gameCards = [...selectedImages, ...selectedImages].map((image, index) => ({
      id: Math.floor(index / 2),
      image: `/images/photos/${image}.jpg`,
      title: image.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
      uniqueId: index,
      isFlipped: false,
      isMatched: false
    }));
    
    const shuffled = gameCards.sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setFlippedCards([]);
    setMatchedPairs([]);
    setMoves(0);
    setTimeElapsed(0);
    setGameStarted(false);
    setIsChecking(false);
    setStreak(0);
    setShowPreview(true);
    setPreviewTime(5);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const timeRemaining = Math.max(0, timeLimit - timeElapsed);
  const totalPairs = Math.floor((gridSize * gridSize) / 2);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Game Stats */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
          <div className="flex items-center gap-2 text-white">
            <Trophy size={16} />
            <span>Pairs: {matchedPairs.length}/{totalPairs}</span>
          </div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
          <div className="flex items-center gap-2 text-white">
            <Clock size={16} />
            <span>Time: {formatTime(timeRemaining)}</span>
          </div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
          <div className="flex items-center gap-2 text-white">
            <span>Moves: {moves}</span>
          </div>
        </div>

        {streak > 1 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="bg-gold/20 border border-gold/50 px-4 py-2 rounded-full"
          >
            <div className="flex items-center gap-2 text-gold">
              <Zap size={16} />
              <span>Streak: {streak}</span>
            </div>
          </motion.div>
        )}

        <Button
          variant="secondary"
          size="sm"
          onClick={resetGame}
          icon={<RotateCcw size={16} />}
        >
          Reset
        </Button>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-white/70 text-sm mb-2">
          <span>Progress</span>
          <span>{Math.round((matchedPairs.length / totalPairs) * 100)}%</span>
        </div>
        <div className="w-full bg-white/20 rounded-full h-3">
          <motion.div 
            className="bg-gradient-to-r from-purple-400 to-pink-400 h-3 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(matchedPairs.length / totalPairs) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Preview Overlay */}
      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 text-center">
              <div className="text-6xl mb-4">👁️</div>
              <h3 className="text-2xl font-dancing text-white mb-4">
                Study Time!
              </h3>
              <p className="text-white/80 mb-6">
                Memorize the card positions before they flip over
              </p>
              <div className="text-4xl font-bold text-gold">
                {previewTime}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cards Grid */}
      <div 
        className="grid gap-3 mx-auto max-w-4xl mb-8"
        style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
      >
        {cards.map((card) => (
          <motion.div
            key={card.uniqueId}
            className="aspect-square cursor-pointer perspective-1000"
            whileHover={{ scale: card.isMatched ? 1 : 1.05 }}
            whileTap={{ scale: card.isMatched ? 1 : 0.95 }}
            onClick={() => handleCardClick(card.uniqueId)}
          >
            <motion.div
              className="relative w-full h-full transform-style-preserve-3d transition-transform duration-500"
              animate={{ 
                rotateY: (card.isFlipped || card.isMatched || showPreview) ? 180 : 0 
              }}
            >
              {/* Card Back */}
              <div className="absolute inset-0 backface-hidden rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 border-2 border-white/30 flex items-center justify-center shadow-lg">
                <div className="text-2xl">💜</div>
              </div>
              
              {/* Card Front */}
              <div 
                className="absolute inset-0 backface-hidden rotate-y-180 rounded-xl border-2 border-white/30 overflow-hidden shadow-lg bg-white"
                style={{
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)'
                }}
              >
                {card.isMatched && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute inset-0 bg-green-400/30 flex items-center justify-center z-10"
                  >
                    <div className="text-green-600 text-xl font-bold">✓</div>
                  </motion.div>
                )}
                
                <div className="w-full h-full flex flex-col">
                  {/* Image Container */}
                  <div className="flex-1 relative bg-gradient-to-br from-purple-200 to-pink-300">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center text-purple-700">
                        <div className="text-3xl mb-2">📸</div>
                        <div className="text-xs px-2 leading-tight font-medium">
                          {card.title}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Game Status */}
      <AnimatePresence>
        {timeRemaining <= 10 && gameStarted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="text-center mb-8 bg-red-500/20 border border-red-500/50 p-4 rounded-2xl"
          >
            <p className="text-red-200 font-bold">
              ⚠️ Time running out: {formatTime(timeRemaining)}!
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Display */}
      <div className="text-center bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
        <h3 className="text-lg font-dancing text-white mb-4">
          Advanced Stats 📊
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="text-white/70">Best Streak</div>
            <div className="text-white text-xl font-bold">{bestStreak}</div>
          </div>
          <div>
            <div className="text-white/70">Accuracy</div>
            <div className="text-white text-xl font-bold">
              {moves > 0 ? Math.round((matchedPairs.length / moves) * 100) : 0}%
            </div>
          </div>
          <div>
            <div className="text-white/70">Speed</div>
            <div className="text-white text-xl font-bold">
              {matchedPairs.length > 0 ? Math.round(timeElapsed / matchedPairs.length) : 0}s/pair
            </div>
          </div>
          <div>
            <div className="text-white/70">Difficulty</div>
            <div className="text-white text-xl font-bold">Expert</div>
          </div>
        </div>
      </div>

      {/* Completion */}
      {matchedPairs.length === totalPairs && matchedPairs.length > 0 && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center mt-8"
        >
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-3xl font-dancing text-white mb-4">
            Memory Master!
          </h3>
          <p className="text-white/90 text-lg">
            Advanced level completed! Your memory skills are incredible, 
            just like how you remember every little detail about us! 🧠💕
          </p>
        </motion.div>
      )}

      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
};

export default AdvancedMemoryLevel;