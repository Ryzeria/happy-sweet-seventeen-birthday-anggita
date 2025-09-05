import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Heart, Sparkles } from 'lucide-react';
import Button from '../ui/Button';

const RouletteLevel = ({ level, onComplete }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [rotation, setRotation] = useState(0);
  const [spinCount, setSpinCount] = useState(0);
  const spinTimeoutRef = useRef(null);

  const dateIdeas = level.content.dateIdeas;
  const segmentAngle = 360 / dateIdeas.length;

  const spinRoulette = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setSelectedIdea(null);

    // Calculate random rotation (at least 3 full rotations plus random amount)
    const minSpins = 3;
    const randomSpin = Math.random() * 360;
    const totalRotation = rotation + (minSpins * 360) + randomSpin;
    
    setRotation(totalRotation);

    // Determine which segment we land on
    const normalizedRotation = totalRotation % 360;
    const selectedIndex = Math.floor((360 - normalizedRotation) / segmentAngle) % dateIdeas.length;

    // Stop spinning after animation
    spinTimeoutRef.current = setTimeout(() => {
      setIsSpinning(false);
      setSelectedIdea(dateIdeas[selectedIndex]);
      setSpinCount(prev => prev + 1);

      // Complete level after 3 spins
      if (spinCount >= 2) {
        setTimeout(() => {
          onComplete();
        }, 3000);
      }
    }, 3000);
  };

  const resetRoulette = () => {
    if (spinTimeoutRef.current) {
      clearTimeout(spinTimeoutRef.current);
    }
    setIsSpinning(false);
    setSelectedIdea(null);
    setRotation(0);
    setSpinCount(0);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="text-6xl mb-4"
        >
          🎡
        </motion.div>
        
        <h2 className="text-3xl font-dancing text-white mb-4">
          Date Ideas Roulette
        </h2>
        
        <p className="text-white/80 text-lg">
          Spin the wheel to discover our next romantic adventure!
        </p>
      </div>

      {/* Spin Counter */}
      <div className="text-center mb-8">
        <div className="bg-white/10 backdrop-blur-sm px-6 py-2 rounded-full border border-white/20 inline-block">
          <span className="text-white">
            Spins: {spinCount}/3 {spinCount >= 3 && "🎉"}
          </span>
        </div>
      </div>

      {/* Roulette Wheel */}
      <div className="relative mb-8 flex justify-center">
        <div className="relative w-80 h-80">
          {/* Wheel Container */}
          <motion.div
            className="w-full h-full rounded-full border-4 border-white/30 overflow-hidden relative bg-white/10 backdrop-blur-sm"
            animate={{ rotate: rotation }}
            transition={{
              duration: isSpinning ? 3 : 0,
              ease: isSpinning ? "easeOut" : "linear"
            }}
          >
            {/* Wheel Segments */}
            {dateIdeas.map((idea, index) => {
              const angle = index * segmentAngle;
              const hue = (index * 360) / dateIdeas.length;
              
              return (
                <div
                  key={index}
                  className="absolute w-full h-full"
                  style={{
                    transform: `rotate(${angle}deg)`,
                    transformOrigin: '50% 50%'
                  }}
                >
                  <div
                    className="absolute w-full h-1/2 origin-bottom"
                    style={{
                      background: `hsl(${hue}, 70%, 60%)`,
                      clipPath: `polygon(50% 100%, ${50 - (50 * Math.tan((segmentAngle * Math.PI) / 360))}% 0%, ${50 + (50 * Math.tan((segmentAngle * Math.PI) / 360))}% 0%)`
                    }}
                  >
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-white text-xs font-medium text-center px-1">
                      <div className="transform" style={{ transform: `rotate(${segmentAngle/2}deg)` }}>
                        {idea.split(' ').slice(0, 2).join(' ')}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Center Circle */}
            <div className="absolute inset-1/2 w-8 h-8 -ml-4 -mt-4 bg-white rounded-full shadow-lg flex items-center justify-center">
              <Heart size={16} className="text-pink-500" />
            </div>
          </motion.div>

          {/* Pointer */}
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 z-10">
            <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-white shadow-lg"></div>
          </div>

          {/* Spinning Effect */}
          {isSpinning && (
            <motion.div
              className="absolute inset-0 rounded-full"
              animate={{
                boxShadow: [
                  "0 0 0 rgba(255,255,255,0.3)",
                  "0 0 30px rgba(255,255,255,0.6)",
                  "0 0 0 rgba(255,255,255,0.3)"
                ]
              }}
              transition={{ duration: 0.5, repeat: Infinity }}
            />
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-4 mb-8">
        <Button
          variant="primary"
          size="lg"
          onClick={spinRoulette}
          disabled={isSpinning}
          className="px-8 py-4 text-xl"
        >
          {isSpinning ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              🎡
            </motion.div>
          ) : (
            <>
              Spin the Wheel! 
              <Sparkles size={20} className="ml-2" />
            </>
          )}
        </Button>

        <Button
          variant="secondary"
          onClick={resetRoulette}
          disabled={isSpinning}
          icon={<RotateCcw size={20} />}
        >
          Reset
        </Button>
      </div>

      {/* Selected Date Idea */}
      <AnimatePresence>
        {selectedIdea && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="text-center mb-8"
          >
            <div className="bg-gradient-to-br from-pink-400/20 to-purple-400/20 backdrop-blur-sm border border-pink-300/50 rounded-3xl p-8 max-w-2xl mx-auto">
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0] 
                }}
                transition={{ duration: 0.5, repeat: 2 }}
                className="text-6xl mb-4"
              >
                🎯
              </motion.div>
              
              <h3 className="text-2xl font-dancing text-white mb-4">
                Your Next Date Adventure:
              </h3>
              
              <p className="text-xl text-white/90 leading-relaxed mb-6">
                {selectedIdea}
              </p>

              <div className="flex justify-center gap-2">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{
                      duration: 1.5,
                      delay: i * 0.2,
                      repeat: Infinity
                    }}
                    className="text-2xl"
                  >
                    ✨
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* All Date Ideas List */}
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
          <h3 className="text-xl font-dancing text-white mb-4 text-center">
            All Our Date Ideas
          </h3>
          <div className="space-y-3">
            {dateIdeas.map((idea, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-3 rounded-lg transition-all duration-300 ${
                  selectedIdea === idea
                    ? 'bg-pink-400/30 border border-pink-400/50'
                    : 'bg-white/5 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-xl">
                    {selectedIdea === idea ? '🎯' : '💝'}
                  </div>
                  <p className="text-white/90 text-sm flex-1">
                    {idea}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
          <h3 className="text-xl font-dancing text-white mb-4 text-center">
            Spin Statistics
          </h3>
          
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">
                {spinCount}
              </div>
              <div className="text-white/70 text-sm">
                Total Spins
              </div>
            </div>

            <div className="bg-white/10 p-4 rounded-xl">
              <p className="text-white/80 text-sm text-center leading-relaxed">
                {spinCount === 0 && "Ready to discover your perfect date? Give it a spin!"}
                {spinCount === 1 && "Great choice! Want to explore more options?"}
                {spinCount === 2 && "Two amazing dates planned! One more spin?"}
                {spinCount >= 3 && "Perfect! Now we have multiple romantic adventures to look forward to!"}
              </p>
            </div>

            {spinCount >= 3 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center p-3 bg-gold/20 rounded-xl border border-gold/50"
              >
                <p className="text-gold font-medium">
                  Level Complete! 🎉
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Instructions */}
      {spinCount === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20"
        >
          <h3 className="text-lg font-dancing text-white mb-3">
            How It Works 🎡
          </h3>
          <p className="text-white/80 mb-4">
            Click "Spin the Wheel" to randomly select one of our romantic date ideas! 
            Each spin reveals a new adventure we could go on together.
          </p>
          <p className="text-white/70 text-sm">
            Spin 3 times to complete this level and see all the amazing dates we could have!
          </p>
        </motion.div>
      )}

      {/* Completion Message */}
      {spinCount >= 3 && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center mt-8"
        >
          <div className="text-6xl mb-4">🎊</div>
          <h3 className="text-3xl font-dancing text-white mb-4">
            So Many Adventures Await!
          </h3>
          <p className="text-white/90 text-lg max-w-2xl mx-auto">
            You've spun the wheel and discovered amazing date ideas! 
            I can't wait to experience all these romantic adventures with you. 
            Every moment with you is already perfect! 💕
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default RouletteLevel;