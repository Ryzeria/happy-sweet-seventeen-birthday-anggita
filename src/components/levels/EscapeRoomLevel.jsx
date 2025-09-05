import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Key, Heart, Star, CheckCircle } from 'lucide-react';
import Button from '../ui/Button';

const EscapeRoomLevel = ({ level, onComplete }) => {
  const [currentPuzzle, setCurrentPuzzle] = useState(0);
  const [solvedPuzzles, setSolvedPuzzles] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [showHint, setShowHint] = useState(false);
  const [attempts, setAttempts] = useState({});
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  const puzzles = [
    {
      id: 1,
      type: "photo-sequence",
      title: "Timeline of Love",
      instruction: "Arrange these moments in chronological order",
      question: "Put our precious memories in the right order:",
      photos: [
        { 
          id: "recent", 
          name: "Osis", 
          image: "/images/photos/osis.jpg", 
          order: 3 
        },
        { 
          id: "first", 
          name: "IIS", 
          image: "/images/photos/rangking-1.jpg", 
          order: 1 
        },
        { 
          id: "anniversary", 
          name: "Mahardika", 
          image: "/images/photos/mahardika.jpg", 
          order: 2 
        },
        { 
          id: "together", 
          name: "MPR", 
          image: "/images/photos/mpr.jpg", 
          order: 4 
        }
      ],
      correctOrder: ["first", "anniversary", "recent", "together"],
      hint: "Think about when each moment happened in our relationship journey",
      successMessage: "Perfect! You remember our timeline perfectly 💕"
    },
    {
      id: 2,
      type: "love-equation",
      title: "Math of Love",
      instruction: "Solve this love equation",
      question: "First Meeting + First Kiss - Days Apart = ?",
      options: [
        "Forever Together",
        "True Love", 
        "Happy Ending",
        "My Heart"
      ],
      correctAnswer: 1,
      hint: "The answer isn't mathematical - it's emotional. What do all our moments add up to?",
      successMessage: "Yes! Our love equation always equals True Love ∞"
    },
    {
      id: 3,
      type: "heart-pattern",
      title: "Pattern of Hearts",
      instruction: "Complete the heart pattern",
      question: "What comes next in this pattern?",
      pattern: ["❤️", "💕", "💖", "💗", "?"],
      options: ["💘", "💝", "💙", "❤️"],
      correctAnswer: 0,
      hint: "The pattern follows the intensity of love - from simple to more elaborate",
      successMessage: "You understand the pattern of our growing love! 💘"
    },
    {
      id: 4,
      type: "memory-lock",
      title: "Memory Lock",
      instruction: "Enter the special date",
      question: "When did we officially become a couple? (DD/MM format)",
      correctAnswer: "10/03",
      hint: "Think about our anniversary month and day",
      placeholder: "DD/MM",
      successMessage: "Our special day! How could I forget such a perfect moment? 💖"
    }
  ];

  const currentPuzzleData = puzzles[currentPuzzle];
  const totalPuzzles = puzzles.length;

  // Timer
  useEffect(() => {
    let interval;
    if (gameStarted && solvedPuzzles.length < totalPuzzles) {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameStarted, solvedPuzzles.length, totalPuzzles]);

  // Check completion
  useEffect(() => {
    if (solvedPuzzles.length === totalPuzzles && solvedPuzzles.length > 0) {
      setTimeout(() => {
        onComplete();
      }, 3000);
    }
  }, [solvedPuzzles.length, totalPuzzles, onComplete]);

  // Manual complete for testing
  const handleManualComplete = () => {
    onComplete();
  };

  const startGame = () => {
    setGameStarted(true);
  };

  // Answer validation
  const hasValidAnswer = () => {
    const userAnswer = userAnswers[currentPuzzleData.id];
    
    switch (currentPuzzleData.type) {
      case "photo-sequence":
        return Array.isArray(userAnswer) && userAnswer.length === currentPuzzleData.photos.length;
      case "love-equation":
      case "heart-pattern":
        return typeof userAnswer === 'number' && userAnswer >= 0;
      case "memory-lock":
        return typeof userAnswer === 'string' && userAnswer.trim().length > 0;
      default:
        return false;
    }
  };

  const checkAnswer = () => {
    if (!gameStarted) startGame();

    const puzzleId = currentPuzzleData.id;
    const userAnswer = userAnswers[puzzleId];
    
    if (!hasValidAnswer()) {
      alert("Please provide a valid answer first!");
      return false;
    }

    setAttempts(prev => ({
      ...prev,
      [puzzleId]: (prev[puzzleId] || 0) + 1
    }));

    let isCorrect = false;

    switch (currentPuzzleData.type) {
      case "photo-sequence":
        const userOrder = userAnswer || [];
        isCorrect = JSON.stringify(userOrder) === JSON.stringify(currentPuzzleData.correctOrder);
        break;
        
      case "love-equation":
      case "heart-pattern":
        isCorrect = userAnswer === currentPuzzleData.correctAnswer;
        break;
        
      case "memory-lock":
        const userDate = userAnswer || "";
        isCorrect = userDate.toLowerCase().trim() === currentPuzzleData.correctAnswer.toLowerCase().trim();
        break;
        
      default:
        isCorrect = false;
    }

    if (isCorrect) {
      setSolvedPuzzles(prev => [...prev, puzzleId]);
      setTimeout(() => {
        if (currentPuzzle < totalPuzzles - 1) {
          setCurrentPuzzle(prev => prev + 1);
          setShowHint(false);
        }
      }, 2000);
    } else {
      alert("That's not quite right. Try again! 💕");
    }

    return isCorrect;
  };

  const updateAnswer = (value) => {
    setUserAnswers(prev => ({
      ...prev,
      [currentPuzzleData.id]: value
    }));
  };

  const renderPuzzle = () => {
    const puzzle = currentPuzzleData;
    const userAnswer = userAnswers[puzzle.id];
    const isSolved = solvedPuzzles.includes(puzzle.id);

    switch (puzzle.type) {
      case "photo-sequence":
        return (
          <div className="space-y-6">
            <p className="text-white/80 text-center">{puzzle.question}</p>
            <div className="grid grid-cols-2 gap-4">
              {puzzle.photos.map((photo, index) => (
                <motion.div
                  key={photo.id}
                  className={`bg-white/10 p-4 rounded-xl cursor-pointer transition-all border-2 ${
                    userAnswer && userAnswer.includes(photo.id) 
                      ? 'border-pink-400 bg-pink-400/20' 
                      : 'border-white/30 hover:bg-white/20'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => {
                    if (isSolved) return;
                    const currentOrder = userAnswer || [];
                    const newOrder = [...currentOrder];
                    if (newOrder.includes(photo.id)) {
                      newOrder.splice(newOrder.indexOf(photo.id), 1);
                    } else {
                      newOrder.push(photo.id);
                    }
                    updateAnswer(newOrder);
                  }}
                >
                  <div className="aspect-square bg-white/5 rounded-lg mb-2 overflow-hidden">
                    <img 
                      src={photo.image} 
                      alt={photo.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback if image fails to load
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="w-full h-full bg-gradient-to-br from-pink-300 to-purple-300 rounded-lg hidden items-center justify-center text-white text-4xl">
                      📸
                    </div>
                  </div>
                  <p className="text-white text-sm text-center">{photo.name}</p>
                  {userAnswer && userAnswer.includes(photo.id) && (
                    <div className="text-center mt-2 text-gold font-bold">
                      #{userAnswer.indexOf(photo.id) + 1}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
            <div className="text-center text-white/70 text-sm">
              Selected: {userAnswer ? userAnswer.length : 0}/{puzzle.photos.length}
            </div>
          </div>
        );

      case "love-equation":
      case "heart-pattern":
        return (
          <div className="space-y-6">
            <p className="text-white/80 text-center text-lg">{puzzle.question}</p>
            {puzzle.pattern && (
              <div className="text-center text-4xl space-x-2 mb-6">
                {puzzle.pattern.map((item, index) => (
                  <span key={index} className="inline-block mx-1">{item}</span>
                ))}
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              {puzzle.options.map((option, index) => (
                <motion.button
                  key={index}
                  onClick={() => {
                    if (!isSolved) {
                      updateAnswer(index);
                    }
                  }}
                  disabled={isSolved}
                  className={`p-4 rounded-xl border-2 transition-all text-center ${
                    userAnswer === index
                      ? 'border-pink-400 bg-pink-400/20 text-white'
                      : isSolved
                      ? 'border-white/20 bg-white/5 text-white/50 cursor-not-allowed'
                      : 'border-white/30 bg-white/10 text-white/80 hover:border-white/50 hover:bg-white/20'
                  }`}
                  whileHover={!isSolved ? { scale: 1.02 } : {}}
                  whileTap={!isSolved ? { scale: 0.98 } : {}}
                >
                  {option}
                </motion.button>
              ))}
            </div>
            <div className="text-center text-white/70 text-sm">
              {typeof userAnswer === 'number' && userAnswer >= 0
                ? `Selected: ${puzzle.options[userAnswer]}` 
                : "Choose an answer above"
              }
            </div>
          </div>
        );

      case "memory-lock":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-6xl mb-4">🔒</div>
              <p className="text-white/80 text-lg">{puzzle.question}</p>
            </div>
            <div className="max-w-xs mx-auto">
              <input
                type="text"
                value={userAnswer || ""}
                onChange={(e) => updateAnswer(e.target.value)}
                placeholder={puzzle.placeholder}
                disabled={isSolved}
                className={`w-full border rounded-xl p-4 text-center text-xl font-mono focus:outline-none transition-all ${
                  isSolved 
                    ? 'bg-green-400/20 border-green-400 text-green-200'
                    : 'bg-white/10 border-white/30 text-white placeholder-white/50 focus:border-pink-400'
                }`}
              />
            </div>
          </div>
        );

      default:
        return <div className="text-white">Unknown puzzle type</div>;
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Testing Button */}
      <div className="fixed top-20 right-4 z-50">
        <Button
          variant="success"
          size="sm"
          onClick={handleManualComplete}
          className="bg-green-500 hover:bg-green-600 text-white"
        >
          ✅ Complete Level
        </Button>
      </div>

      {/* Header */}
      <div className="text-center mb-8">
        <motion.div
          animate={{ 
            rotate: [0, 5, -5, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 3, repeat: Infinity }}
          className="text-6xl mb-4"
        >
          🚪
        </motion.div>
        <h2 className="text-3xl font-dancing text-white mb-4">
          Escape to Love
        </h2>
        <p className="text-white/80 text-lg">
          Solve the puzzles to unlock the door to my heart!
        </p>
      </div>

      {/* Progress & Stats */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
          <div className="flex items-center gap-2 text-white">
            <Key size={16} />
            <span>Puzzle: {currentPuzzle + 1}/{totalPuzzles}</span>
          </div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
          <div className="flex items-center gap-2 text-white">
            <CheckCircle size={16} />
            <span>Solved: {solvedPuzzles.length}</span>
          </div>
        </div>

        {gameStarted && (
          <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
            <div className="flex items-center gap-2 text-white">
              <span>Time: {formatTime(timeElapsed)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="w-full bg-white/20 rounded-full h-3">
          <motion.div 
            className="bg-gradient-to-r from-rose-400 to-pink-400 h-3 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(solvedPuzzles.length / totalPuzzles) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Current Puzzle */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPuzzle}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 mb-8"
        >
          {/* Puzzle Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Lock className="text-rose-400" size={24} />
              <h3 className="text-2xl font-dancing text-white">
                {currentPuzzleData.title}
              </h3>
            </div>
            <p className="text-white/70">
              {currentPuzzleData.instruction}
            </p>
          </div>

          {/* Puzzle Content */}
          {renderPuzzle()}

          {/* Action Buttons */}
          <div className="flex gap-4 mt-8">
            <Button
              variant="primary"
              onClick={checkAnswer}
              disabled={!hasValidAnswer() || solvedPuzzles.includes(currentPuzzleData.id)}
              className="flex-1"
            >
              {solvedPuzzles.includes(currentPuzzleData.id) ? 'Solved! ✅' : 'Submit Answer'}
            </Button>

            <Button
              variant="secondary"
              onClick={() => setShowHint(!showHint)}
              icon={showHint ? '🙈' : '💡'}
            >
              {showHint ? 'Hide' : 'Hint'}
            </Button>
          </div>

          {/* Result Display */}
          <AnimatePresence>
            {solvedPuzzles.includes(currentPuzzleData.id) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center mt-6 bg-green-500/20 border border-green-400/30 p-4 rounded-xl"
              >
                <div className="text-4xl mb-2">✅</div>
                <p className="text-green-200">
                  {currentPuzzleData.successMessage}
                </p>
                {currentPuzzle < totalPuzzles - 1 && (
                  <p className="text-green-200/80 text-sm mt-2">
                    Moving to next puzzle...
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Hint */}
          <AnimatePresence>
            {showHint && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 bg-yellow-400/20 border border-yellow-400/30 p-4 rounded-xl"
              >
                <p className="text-yellow-200">
                  💡 {currentPuzzleData.hint}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>

      {/* Completion */}
      {solvedPuzzles.length === totalPuzzles && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <div className="text-8xl mb-4">🎉</div>
          <h3 className="text-4xl font-dancing text-white mb-6">
            You Escaped!
          </h3>
          <div className="bg-gradient-to-r from-rose-500/20 to-pink-500/20 backdrop-blur-sm p-8 rounded-2xl border border-rose-300/30 max-w-2xl mx-auto">
            <p className="text-white text-xl leading-relaxed mb-6">
              Congratulations! You solved all the puzzles and found your way to my heart. 
              Just like in this escape room, love isn't about escaping from each other - 
              it's about finding our way TO each other! 💕
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-white/70">Time Taken</div>
                <div className="text-white text-xl font-bold">{formatTime(timeElapsed)}</div>
              </div>
              <div>
                <div className="text-white/70">Total Attempts</div>
                <div className="text-white text-xl font-bold">
                  {Object.values(attempts).reduce((a, b) => a + b, 0)}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default EscapeRoomLevel;