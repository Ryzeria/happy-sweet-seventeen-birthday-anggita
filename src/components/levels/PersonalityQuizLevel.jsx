import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Heart, Star, ArrowRight } from 'lucide-react';
import Button from '../ui/Button';

const PersonalityQuizLevel = ({ level, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);

  const questions = level.content.questions;

  useEffect(() => {
    if (quizComplete) {
      setTimeout(() => {
        onComplete();
      }, 3000);
    }
  }, [quizComplete, onComplete]);

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswer(answerIndex);
  };

  const handleSubmit = () => {
    const isCorrect = selectedAnswer === questions[currentQuestion].correctAnswer;
    const newAnswers = [...answers, selectedAnswer];
    setAnswers(newAnswers);

    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    setShowExplanation(true);

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer(null);
        setShowExplanation(false);
      } else {
        setQuizComplete(true);
      }
    }, 3000);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setQuizComplete(false);
    setScore(0);
    setAnswers([]);
  };

  const getScoreMessage = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage === 100) return "Perfect! Gita mengenal diri sendiri dengan luar biasa! 🌟";
    if (percentage >= 80) return "Amazing! Gita sangat tahu tentang diri sendiri! ✨";
    if (percentage >= 60) return "Great! Gita punya self-awareness yang baik! 💖";
    return "Keep exploring yourself - that's how we grow! 🌱";
  };

  const getScoreColor = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage === 100) return "from-gold to-yellow-400";
    if (percentage >= 80) return "from-green-400 to-emerald-500";
    if (percentage >= 60) return "from-blue-400 to-indigo-500";
    return "from-pink-400 to-purple-500";
  };

  if (quizComplete) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="space-y-8"
        >
          {/* Celebration */}
          <div>
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                ease: "easeInOut" 
              }}
              className="text-8xl mb-4"
            >
              🎉
            </motion.div>
            
            <h2 className="text-4xl font-dancing text-white mb-4">
              Quiz Complete!
            </h2>
          </div>

          {/* Score Display */}
          <div className={`bg-gradient-to-r ${getScoreColor()} p-6 rounded-3xl`}>
            <div className="text-white">
              <div className="text-5xl font-bold mb-2">
                {score}/{questions.length}
              </div>
              <div className="text-xl opacity-90">
                {Math.round((score / questions.length) * 100)}% Correct
              </div>
            </div>
          </div>

          {/* Score Message */}
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
            <p className="text-xl text-white mb-4">
              {getScoreMessage()}
            </p>
            <p className="text-white/80">
              Setiap jawaban menunjukkan betapa uniknya dirimu, dan Mas Za semakin jatuh cinta dengan setiap aspek kepribadianmu! 💕
            </p>
          </div>

          {/* Fun Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 p-4 rounded-xl">
              <div className="text-2xl mb-2">⭐</div>
              <div className="text-white text-sm">Perfect Matches</div>
              <div className="text-white text-xl font-bold">{score}</div>
            </div>
            <div className="bg-white/5 p-4 rounded-xl">
              <div className="text-2xl mb-2">💖</div>
              <div className="text-white text-sm">Self-Awareness</div>
              <div className="text-white text-xl font-bold">Amazing!</div>
            </div>
          </div>

          <Button
            variant="secondary"
            onClick={resetQuiz}
            className="mt-6"
          >
            Take Quiz Again
          </Button>
        </motion.div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-white/70 text-sm mb-2">
          <span>Question {currentQuestion + 1} of {questions.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-white/20 rounded-full h-3">
          <motion.div 
            className="bg-gradient-to-r from-pink-400 to-purple-400 h-3 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className="space-y-8"
        >
          {/* Question */}
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="text-6xl mb-6"
            >
              ❓
            </motion.div>
            
            <h2 className="text-2xl md:text-3xl font-dancing text-white mb-4">
              {currentQ.question}
            </h2>
            
            <p className="text-white/70 text-sm">
              Choose the answer that best describes you ✨
            </p>
          </div>

          {/* Answer Options */}
          <div className="space-y-4">
            {currentQ.options.map((option, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <button
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showExplanation}
                  className={`
                    w-full p-4 rounded-2xl border-2 text-left transition-all duration-300
                    ${selectedAnswer === index 
                      ? 'border-pink-400 bg-pink-400/20 text-white' 
                      : 'border-white/30 bg-white/10 text-white/80 hover:border-white/50 hover:bg-white/20'
                    }
                    ${showExplanation ? 'cursor-not-allowed' : 'cursor-pointer'}
                  `}
                >
                  <div className="flex items-center gap-4">
                    <div className={`
                      w-6 h-6 rounded-full border-2 flex items-center justify-center
                      ${selectedAnswer === index 
                        ? 'border-pink-400 bg-pink-400' 
                        : 'border-white/30'
                      }
                    `}>
                      {selectedAnswer === index && (
                        <div className="w-3 h-3 bg-white rounded-full" />
                      )}
                    </div>
                    
                    <span className="flex-1 text-lg">
                      {option}
                    </span>

                    {selectedAnswer === index && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                      >
                        <Heart className="text-pink-400" size={20} />
                      </motion.div>
                    )}
                  </div>
                </button>
              </motion.div>
            ))}
          </div>

          {/* Submit Button */}
          {selectedAnswer !== null && !showExplanation && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <Button
                variant="primary"
                size="lg"
                onClick={handleSubmit}
                icon={<ArrowRight size={20} />}
              >
                Submit Answer
              </Button>
            </motion.div>
          )}

          {/* Explanation */}
          <AnimatePresence>
            {showExplanation && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`
                  p-6 rounded-2xl border-2
                  ${selectedAnswer === currentQ.correctAnswer 
                    ? 'border-green-400 bg-green-400/20' 
                    : 'border-pink-400 bg-pink-400/20'
                  }
                `}
              >
                <div className="flex items-center gap-3 mb-4">
                  {selectedAnswer === currentQ.correctAnswer ? (
                    <CheckCircle className="text-green-400" size={24} />
                  ) : (
                    <Heart className="text-pink-400" size={24} />
                  )}
                  
                  <h3 className="text-xl font-dancing text-white">
                    {selectedAnswer === currentQ.correctAnswer ? "Perfect! 🌟" : "Beautiful Answer! 💕"}
                  </h3>
                </div>
                
                <p className="text-white/90 text-lg leading-relaxed">
                  {currentQ.explanation}
                </p>

                {/* Progress to Next */}
                <div className="mt-4 pt-4 border-t border-white/20">
                  <div className="flex items-center justify-center gap-2 text-white/70 text-sm">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      <Star size={16} />
                    </motion.div>
                    {currentQuestion < questions.length - 1 
                      ? "Moving to next question..." 
                      : "Calculating your amazing results..."
                    }
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default PersonalityQuizLevel;