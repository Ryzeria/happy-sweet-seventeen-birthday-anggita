import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Trophy, Clock } from 'lucide-react';

const MemoryCardsLevel = ({ level, onComplete }) => {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [moves, setMoves] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  // Personalized cards dengan emoji untuk Anggita
  const personalizedCards = [
    { id: 1, emoji: "🎮", title: "Roleplay Era", description: "Shiro meets Mochizuki" },
    { id: 2, emoji: "📚", title: "Study Sessions", description: "Olimpiade IPA bareng" },
    { id: 3, emoji: "💔", title: "Lost Contact", description: "Periode terpisah" },
    { id: 4, emoji: "✨", title: "Reunion 2022", description: "Ketemu lagi!" },
    { id: 5, emoji: "💖", title: "Jadian Day", description: "10 Maret 2023" },
    { id: 6, emoji: "💻", title: "Discord Dates", description: "Virtual dating" },
    { id: 7, emoji: "🌙", title: "Musang Bulan", description: "Pet impian Gita" },
    { id: 8, emoji: "🥑", title: "Nasi Alpukat", description: "Makanan aneh favorit" }
  ];

  // Initialize cards
  useEffect(() => {
    const cardData = level?.content?.cards || personalizedCards.slice(0, 6); // Take first 6 cards
    const gameCards = [...cardData, ...cardData].map((card, index) => ({
      ...card,
      uniqueId: index,
      isFlipped: false,
      isMatched: false
    }));
    
    // Shuffle cards
    const shuffled = gameCards.sort(() => Math.random() - 0.5);
    setCards(shuffled);
  }, [level]);

  // Timer
  useEffect(() => {
    let interval;
    if (gameStarted && matchedPairs.length < (level?.content?.cards?.length || 6)) {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameStarted, matchedPairs.length, level]);

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
          setFlippedCards([]);
          setIsChecking(false);
        }, 1000);
      } else {
        // No match
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

  // Check for completion
  useEffect(() => {
    const targetPairs = level?.content?.cards?.length || 6;
    if (matchedPairs.length === targetPairs && matchedPairs.length > 0) {
      setTimeout(() => {
        onComplete();
      }, 1000);
    }
  }, [matchedPairs.length, level, onComplete]);

  const handleCardClick = (cardId) => {
    if (!gameStarted) setGameStarted(true);
    
    if (isChecking || flippedCards.length >= 2) return;
    
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
    const cardData = level?.content?.cards || personalizedCards.slice(0, 6);
    const gameCards = [...cardData, ...cardData].map((card, index) => ({
      ...card,
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
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const targetPairs = level?.content?.cards?.length || 6;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Game Stats */}
      <div className="flex justify-center gap-8 mb-8">
        <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
          <div className="flex items-center gap-2 text-white">
            <Trophy size={20} />
            <span>Moves: {moves}</span>
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
          <div className="flex items-center gap-2 text-white">
            <Clock size={20} />
            <span>Time: {formatTime(timeElapsed)}</span>
          </div>
        </div>
        <motion.button
          onClick={resetGame}
          className="btn-secondary flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <RotateCcw size={20} />
          Reset
        </motion.button>
      </div>

      {/* Progress */}
      <div className="text-center mb-8">
        <p className="text-white/70 mb-2">
          Pairs Found: {matchedPairs.length} / {targetPairs}
        </p>
        <div className="w-full bg-white/20 rounded-full h-3 max-w-md mx-auto">
          <motion.div 
            className="bg-rose-400 h-3 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(matchedPairs.length / targetPairs) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8 max-w-4xl mx-auto">
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
                rotateY: card.isFlipped || card.isMatched ? 180 : 0 
              }}
            >
              {/* Card Back */}
              <div className="absolute inset-0 backface-hidden rounded-xl bg-gradient-to-br from-pink-400 to-purple-500 border-2 border-white/30 flex items-center justify-center shadow-lg">
                <div className="text-4xl">💕</div>
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
                    <div className="text-green-600 text-2xl">✓</div>
                  </motion.div>
                )}
                
                <div className="w-full h-full bg-gradient-to-br from-rose-100 to-pink-200 flex flex-col items-center justify-center p-3">
                  {/* Emoji */}
                  <div className="text-4xl mb-2">
                    {card.emoji}
                  </div>
                  
                  {/* Title */}
                  <p className="text-gray-800 text-sm font-bold text-center leading-tight mb-1">
                    {card.title}
                  </p>
                  
                  {/* Description */}
                  <p className="text-gray-600 text-xs text-center leading-tight">
                    {card.description}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Game Instructions */}
      {!gameStarted && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20"
        >
          <h3 className="text-xl font-dancing text-white mb-3">
            How to Play 🎮
          </h3>
          <p className="text-white/80 mb-4">
            Click pada cards untuk flip them dan find matching pairs dari kenangan kita together!
          </p>
          <p className="text-white/70 text-sm">
            Try to complete the game dengan as few moves as possible! 🎯
          </p>
        </motion.div>
      )}

      {/* Completion Celebration */}
      {matchedPairs.length === targetPairs && matchedPairs.length > 0 && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center mt-8"
        >
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-3xl font-dancing text-white mb-4">
            Perfect Match! 
          </h3>
          <p className="text-white/90 text-lg mb-4">
            You completed the memory game dalam {moves} moves dan {formatTime(timeElapsed)}!
          </p>
          <p className="text-white/80 mb-4">
            Just like these cards, kita perfect match satu sama lain! 💕
          </p>
          <div className="flex justify-center gap-4">
            <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
              <span className="text-white">
                ⭐ Score: {Math.max(1000 - (moves * 10) - timeElapsed, 100)}
              </span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Hints */}
      {gameStarted && moves > 10 && matchedPairs.length < 3 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mt-6 bg-yellow-400/10 backdrop-blur-sm p-4 rounded-2xl border border-yellow-400/20"
        >
          <p className="text-yellow-200 text-sm">
            💡 Tip: Try to remember posisi cards yang udah Gita lihat before!
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

export default MemoryCardsLevel;