import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Trophy } from 'lucide-react';
import Button from '../ui/Button';
import { arcadeLogic } from '../../utils/gameLogic';

const ArcadeGameLevel = ({ level, onComplete }) => {
  const gameAreaRef = useRef(null);
  const animationRef = useRef(null);
  const [gameState, setGameState] = useState('ready'); // ready, playing, paused, finished
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(level.content.timeLimit || 60);
  const [player, setPlayer] = useState({ x: 200, y: 400, width: 60, height: 40 });
  const [fallingObjects, setFallingObjects] = useState([]);
  const [gameArea, setGameArea] = useState({ width: 500, height: 500 });
  const [combo, setCombo] = useState(0);
  const [showCombo, setShowCombo] = useState(false);

  const targetScore = level.content.targetScore || 100;

  // Initialize game area dimensions
  useEffect(() => {
    if (gameAreaRef.current) {
      const rect = gameAreaRef.current.getBoundingClientRect();
      setGameArea({ width: rect.width, height: rect.height });
    }
  }, []);

  // Game timer
  useEffect(() => {
    let timer;
    if (gameState === 'playing' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setGameState('finished');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  // Check win condition
  useEffect(() => {
    if (score >= targetScore && gameState !== 'finished') {
      setGameState('finished');
      setTimeout(() => {
        onComplete();
      }, 2000);
    }
  }, [score, targetScore, gameState, onComplete]);

  // Game loop
  const gameLoop = useCallback(() => {
    if (gameState !== 'playing') return;

    setFallingObjects(prev => {
      let newObjects = [...prev];

      // Add new falling objects occasionally
      if (Math.random() < 0.03) {
        const newObject = arcadeLogic.generateFallingObject(gameArea.width, gameArea.height);
        newObjects.push(newObject);
      }

      // Update positions and remove off-screen objects
      newObjects = arcadeLogic.updateObjects(newObjects, gameArea.height);

      // Check collisions with player
      const { caught, remaining } = arcadeLogic.checkCatch(player, newObjects);
      
      // Update score and combo
      if (caught.length > 0) {
        const points = caught.reduce((total, obj) => total + obj.points, 0);
        setScore(prevScore => prevScore + points + (combo * 5));
        setCombo(prev => {
          const newCombo = prev + caught.length;
          if (newCombo > 1) {
            setShowCombo(true);
            setTimeout(() => setShowCombo(false), 1000);
          }
          return newCombo;
        });
      } else if (remaining.length < newObjects.length) {
        // Reset combo if no catch but objects were removed (fell off screen)
        setCombo(0);
      }

      return remaining;
    });

    animationRef.current = requestAnimationFrame(gameLoop);
  }, [gameState, player, gameArea, combo]);

  // Start game loop
  useEffect(() => {
    if (gameState === 'playing') {
      animationRef.current = requestAnimationFrame(gameLoop);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameState, gameLoop]);

  // Player movement
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (gameState !== 'playing' || !gameAreaRef.current) return;

      const rect = gameAreaRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      
      setPlayer(prev => ({
        ...prev,
        x: Math.max(0, Math.min(mouseX - prev.width / 2, gameArea.width - prev.width))
      }));
    };

    const handleTouchMove = (e) => {
      if (gameState !== 'playing' || !gameAreaRef.current) return;
      e.preventDefault();

      const rect = gameAreaRef.current.getBoundingClientRect();
      const touch = e.touches[0];
      const touchX = touch.clientX - rect.left;
      
      setPlayer(prev => ({
        ...prev,
        x: Math.max(0, Math.min(touchX - prev.width / 2, gameArea.width - prev.width))
      }));
    };

    if (gameState === 'playing') {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [gameState, gameArea.width]);

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setTimeLeft(level.content.timeLimit || 60);
    setFallingObjects([]);
    setCombo(0);
  };

  const pauseGame = () => {
    setGameState('paused');
  };

  const resumeGame = () => {
    setGameState('playing');
  };

  const resetGame = () => {
    setGameState('ready');
    setScore(0);
    setTimeLeft(level.content.timeLimit || 60);
    setFallingObjects([]);
    setCombo(0);
    setPlayer({ x: 200, y: 400, width: 60, height: 40 });
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 10, -10, 0]
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-6xl mb-4"
        >
          💕
        </motion.div>
        <h2 className="text-3xl font-dancing text-white mb-4">
          Catch the Falling Hearts!
        </h2>
        <p className="text-white/80 text-lg">
          Move your cursor to catch all the hearts falling from above!
        </p>
      </div>

      {/* Game Stats */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
          <div className="flex items-center gap-2 text-white">
            <Trophy size={16} />
            <span>Score: {score}</span>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
          <div className="flex items-center gap-2 text-white">
            <span>⏰ {formatTime(timeLeft)}</span>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
          <div className="flex items-center gap-2 text-white">
            <span>Target: {targetScore}</span>
          </div>
        </div>

        {combo > 1 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="bg-gold/20 border border-gold/50 px-4 py-2 rounded-full"
          >
            <div className="flex items-center gap-2 text-gold">
              <span>🔥 Combo x{combo}</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-white/70 text-sm mb-2">
          <span>Progress to Target</span>
          <span>{Math.round((score / targetScore) * 100)}%</span>
        </div>
        <div className="w-full bg-white/20 rounded-full h-3">
          <motion.div 
            className="bg-gradient-to-r from-pink-400 to-purple-400 h-3 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min((score / targetScore) * 100, 100)}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Game Controls */}
      <div className="flex justify-center gap-4 mb-8">
        {gameState === 'ready' && (
          <Button
            variant="primary"
            size="lg"
            onClick={startGame}
            icon={<Play size={20} />}
          >
            Start Game
          </Button>
        )}

        {gameState === 'playing' && (
          <Button
            variant="secondary"
            size="sm"
            onClick={pauseGame}
            icon={<Pause size={16} />}
          >
            Pause
          </Button>
        )}

        {gameState === 'paused' && (
          <>
            <Button
              variant="primary"
              size="sm"
              onClick={resumeGame}
              icon={<Play size={16} />}
            >
              Resume
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={resetGame}
              icon={<RotateCcw size={16} />}
            >
              Reset
            </Button>
          </>
        )}

        {(gameState === 'finished' || gameState === 'paused') && (
          <Button
            variant="secondary"
            size="sm"
            onClick={resetGame}
            icon={<RotateCcw size={16} />}
          >
            Play Again
          </Button>
        )}
      </div>

      {/* Game Area */}
      <div className="relative">
        <div
          ref={gameAreaRef}
          className="relative bg-gradient-to-b from-blue-900/20 to-purple-900/20 border border-white/20 rounded-2xl mx-auto overflow-hidden"
          style={{ width: '100%', maxWidth: '500px', height: '500px' }}
        >
          {/* Player */}
          {gameState !== 'ready' && (
            <motion.div
              className="absolute bottom-10 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full shadow-lg flex items-center justify-center text-white text-2xl"
              style={{
                left: player.x,
                width: player.width,
                height: player.height
              }}
              whileHover={{ scale: 1.1 }}
            >
              🥺
            </motion.div>
          )}

          {/* Falling Objects */}
          <AnimatePresence>
            {fallingObjects.map(obj => (
              <motion.div
                key={obj.id}
                className="absolute text-3xl pointer-events-none"
                style={{
                  left: obj.x,
                  top: obj.y
                }}
                initial={{ scale: 0, rotate: 0 }}
                animate={{ 
                  scale: 1, 
                  rotate: 360,
                  transition: { rotate: { duration: 2, repeat: Infinity, ease: "linear" } }
                }}
                exit={{ scale: 0, opacity: 0 }}
              >
                {obj.type}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Game State Overlays */}
          <AnimatePresence>
            {gameState === 'ready' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center"
              >
                <div className="text-center text-white">
                  <div className="text-6xl mb-4">🎮</div>
                  <h3 className="text-2xl font-dancing mb-4">Ready to Play?</h3>
                  <p className="text-white/80 mb-6">
                    Move your mouse to control the catcher and catch falling hearts!
                  </p>
                  <p className="text-white/70 text-sm">
                    Goal: Catch {targetScore} points worth of hearts! 💕
                  </p>
                </div>
              </motion.div>
            )}

            {gameState === 'paused' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center"
              >
                <div className="text-center text-white">
                  <div className="text-6xl mb-4">⏸️</div>
                  <h3 className="text-2xl font-dancing mb-4">Game Paused</h3>
                  <p className="text-white/80">
                    Take a break! Click Resume when you're ready to continue.
                  </p>
                </div>
              </motion.div>
            )}

            {gameState === 'finished' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center"
              >
                <div className="text-center text-white">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="text-8xl mb-4"
                  >
                    {score >= targetScore ? '🎉' : '💔'}
                  </motion.div>
                  
                  <h3 className="text-3xl font-dancing mb-4">
                    {score >= targetScore ? 'Amazing!' : 'Good Try!'}
                  </h3>
                  
                  <p className="text-white/90 text-xl mb-4">
                    Final Score: {score}
                  </p>
                  
                  <p className="text-white/80">
                    {score >= targetScore 
                      ? "You caught all the hearts! Just like how you caught mine! 💕" 
                      : "Don't worry, practice makes perfect! Try again? 🌟"
                    }
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Combo Display */}
          <AnimatePresence>
            {showCombo && combo > 1 && (
              <motion.div
                initial={{ scale: 0, y: -20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0, y: -20, opacity: 0 }}
                className="absolute top-10 left-1/2 transform -translate-x-1/2 z-10"
              >
                <div className="bg-gold/90 text-white px-4 py-2 rounded-full font-bold text-lg">
                  COMBO x{combo}! 🔥
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Instructions */}
      {gameState === 'ready' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mt-8 bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20 max-w-2xl mx-auto"
        >
          <h3 className="text-lg font-dancing text-white mb-3">
            How to Play 🎮
          </h3>
          <div className="text-white/80 text-sm space-y-2">
            <p>• Move your mouse left and right to control the catcher</p>
            <p>• Catch falling hearts to earn points</p>
            <p>• Different hearts give different points</p>
            <p>• Catch multiple hearts in a row for combo bonuses!</p>
            <p>• Reach {targetScore} points before time runs out</p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ArcadeGameLevel;