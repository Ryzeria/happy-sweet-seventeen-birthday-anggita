import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Key, Eye, EyeOff, Lightbulb, Trophy } from 'lucide-react';
import Button from '../ui/Button';

const CipherGameLevel = ({ level, onComplete }) => {
  const [currentCipher, setCurrentCipher] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [completedCiphers, setCompletedCiphers] = useState([]);
  const [attempts, setAttempts] = useState(0);

  const ciphers = [
    {
      id: 1,
      type: "caesar",
      shift: 3,
      encrypted: "NDX FLQWD SDGDPX",
      decrypted: "AKU CINTA PADAMU",
      hint: "Geser setiap huruf 3 posisi ke belakang dalam alfabet",
      instruction: "Caesar Cipher: Setiap huruf digeser 3 posisi"
    },
    {
      id: 2,
      type: "reverse",
      encrypted: "UMAKADAP ATNIC UKA",
      decrypted: "AKU CINTA PADAMU",
      hint: "Baca dari belakang ke depan",
      instruction: "Reverse Cipher: Teks ditulis terbalik"
    },
    {
      id: 3,
      type: "number",
      encrypted: "1-11-21 3-9-14-20-1 16-1-4-1-13-21",
      decrypted: "AKU CINTA PADAMU",
      hint: "A=1, B=2, C=3, dan seterusnya...",
      instruction: "Number Cipher: Huruf diganti dengan posisi di alfabet"
    },
    {
      id: 4,
      type: "binary",
      encrypted: "01000001 01001011 01010101 ❤️",
      decrypted: "AKU",
      hint: "Binary code: 8 digit untuk setiap huruf",
      instruction: "Binary Cipher: Huruf dalam kode biner"
    },
    {
      id: 5,
      type: "custom",
      encrypted: "143 637 25 1432",
      decrypted: "I LOVE YOU FOREVER",
      hint: "Jumlah huruf dalam setiap kata: I(1) LOVE(4) YOU(3), dst.",
      instruction: "Custom Love Code: Jumlah huruf per kata"
    }
  ];

  const cipher = ciphers[currentCipher];

  useEffect(() => {
    if (completedCiphers.length === ciphers.length && completedCiphers.length > 0) {
      setTimeout(() => {
        onComplete();
      }, 2000);
    }
  }, [completedCiphers, onComplete]);

  const checkAnswer = () => {
    setAttempts(prev => prev + 1);
    const normalizedInput = userInput.trim().toUpperCase();
    const normalizedAnswer = cipher.decrypted.toUpperCase();
    
    if (normalizedInput === normalizedAnswer) {
      setIsCorrect(true);
      setCompletedCiphers(prev => [...prev, cipher.id]);
      
      setTimeout(() => {
        if (currentCipher < ciphers.length - 1) {
          setCurrentCipher(prev => prev + 1);
          setUserInput('');
          setIsCorrect(null);
          setShowHint(false);
        }
      }, 2000);
    } else {
      setIsCorrect(false);
      setTimeout(() => setIsCorrect(null), 2000);
    }
  };

  const skipCipher = () => {
    setCompletedCiphers(prev => [...prev, cipher.id]);
    if (currentCipher < ciphers.length - 1) {
      setCurrentCipher(prev => prev + 1);
      setUserInput('');
      setIsCorrect(null);
      setShowHint(false);
    }
  };

  const resetGame = () => {
    setCurrentCipher(0);
    setUserInput('');
    setIsCorrect(null);
    setShowHint(false);
    setCompletedCiphers([]);
    setAttempts(0);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <motion.div
          animate={{ 
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-6xl mb-4"
        >
          🔐
        </motion.div>
        <h2 className="text-3xl font-dancing text-white mb-4">
          Secret Code Breaker
        </h2>
        <p className="text-white/80 text-lg">
          Decode these secret love messages just for you!
        </p>
      </div>

      {/* Progress */}
      <div className="flex justify-center gap-4 mb-8">
        <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
          <div className="flex items-center gap-2 text-white">
            <Key size={16} />
            <span>Cipher: {currentCipher + 1}/{ciphers.length}</span>
          </div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
          <div className="flex items-center gap-2 text-white">
            <Trophy size={16} />
            <span>Solved: {completedCiphers.length}</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="w-full bg-white/20 rounded-full h-3">
          <motion.div 
            className="bg-gradient-to-r from-indigo-400 to-purple-500 h-3 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(completedCiphers.length / ciphers.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Current Cipher */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentCipher}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className="space-y-8"
        >
          {/* Cipher Card */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8">
            {/* Cipher Type */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 bg-indigo-500/20 border border-indigo-400/30 px-4 py-2 rounded-full mb-4">
                <span className="text-indigo-300 font-medium">
                  {cipher.instruction}
                </span>
              </div>
            </div>

            {/* Encrypted Message */}
            <div className="text-center mb-8">
              <h3 className="text-white/70 text-sm mb-2">Encrypted Message:</h3>
              <div className="bg-black/20 p-6 rounded-xl font-mono text-xl text-center">
                <span className="text-white tracking-wider">
                  {cipher.encrypted}
                </span>
              </div>
            </div>

            {/* Input Field */}
            <div className="space-y-4">
              <div>
                <label className="text-white/80 text-sm block mb-2">
                  Your Answer:
                </label>
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
                  className="w-full bg-white/10 border border-white/30 rounded-xl p-4 text-white placeholder-white/50 focus:border-indigo-400 focus:outline-none"
                  placeholder="Type your decoded message here..."
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button
                  variant="primary"
                  onClick={checkAnswer}
                  disabled={!userInput.trim()}
                  className="flex-1"
                >
                  Decode Message
                </Button>

                <Button
                  variant="secondary"
                  onClick={() => setShowHint(!showHint)}
                  icon={showHint ? <EyeOff size={16} /> : <Eye size={16} />}
                >
                  {showHint ? 'Hide' : 'Show'} Hint
                </Button>
              </div>
            </div>
          </div>

          {/* Hint */}
          <AnimatePresence>
            {showHint && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-yellow-400/20 border border-yellow-400/30 rounded-2xl p-6"
              >
                <div className="flex items-center gap-3 mb-3">
                  <Lightbulb className="text-yellow-300" size={20} />
                  <h3 className="text-yellow-200 font-medium">Hint:</h3>
                </div>
                <p className="text-yellow-100">{cipher.hint}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Result Feedback */}
          <AnimatePresence>
            {isCorrect !== null && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className={`text-center p-6 rounded-2xl ${
                  isCorrect 
                    ? 'bg-green-500/20 border border-green-400/30' 
                    : 'bg-red-500/20 border border-red-400/30'
                }`}
              >
                <div className="text-4xl mb-3">
                  {isCorrect ? '🎉' : '❌'}
                </div>
                <h3 className={`text-xl font-dancing mb-2 ${
                  isCorrect ? 'text-green-300' : 'text-red-300'
                }`}>
                  {isCorrect ? 'Correct!' : 'Try Again!'}
                </h3>
                <p className={`${isCorrect ? 'text-green-200' : 'text-red-200'}`}>
                  {isCorrect 
                    ? `"${cipher.decrypted}" - You cracked the code! 💕`
                    : "That's not quite right. Check the hint and try again!"
                  }
                </p>
                
                {isCorrect && currentCipher < ciphers.length - 1 && (
                  <p className="text-green-200/80 text-sm mt-2">
                    Moving to next cipher...
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>

      {/* Skip Option */}
      {attempts >= 3 && !completedCiphers.includes(cipher.id) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mt-6"
        >
          <p className="text-white/70 text-sm mb-3">
            Having trouble? That's okay!
          </p>
          <Button
            variant="secondary"
            size="sm"
            onClick={skipCipher}
          >
            Skip This Cipher
          </Button>
        </motion.div>
      )}

      {/* All Ciphers Completed */}
      {completedCiphers.length === ciphers.length && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center mt-8"
        >
          <div className="text-8xl mb-4">🎊</div>
          <h3 className="text-4xl font-dancing text-white mb-4">
            Master Code Breaker!
          </h3>
          <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 backdrop-blur-sm p-8 rounded-2xl border border-indigo-300/30 max-w-2xl mx-auto">
            <p className="text-white text-xl leading-relaxed mb-6">
              You've successfully decoded all the secret messages! Each cipher revealed a piece of my heart, 
              just like how you've unlocked every part of my love for you.
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-white/70">Total Attempts</div>
                <div className="text-white text-xl font-bold">{attempts}</div>
              </div>
              <div>
                <div className="text-white/70">Success Rate</div>
                <div className="text-white text-xl font-bold">
                  {Math.round((completedCiphers.length / attempts) * 100)}%
                </div>
              </div>
            </div>
          </div>

          <Button
            variant="secondary"
            onClick={resetGame}
            className="mt-6"
          >
            Decode Again
          </Button>
        </motion.div>
      )}

      {/* Helper Examples */}
      {currentCipher === 0 && !completedCiphers.includes(cipher.id) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20"
        >
          <h3 className="text-lg font-dancing text-white mb-4">
            How Caesar Cipher Works:
          </h3>
          <div className="text-white/80 text-sm space-y-2">
            <p>Example: A → D (shift 3), B → E, C → F, etc.</p>
            <p>So "HELLO" becomes "KHOOR"</p>
            <p className="text-white/60">Tip: Work backwards from the encrypted text!</p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default CipherGameLevel;