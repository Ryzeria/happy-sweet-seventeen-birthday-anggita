import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Eye, Lightbulb, Trophy, CheckCircle } from 'lucide-react';
import Button from '../ui/Button';

const TreasureHuntLevel = ({ level, onComplete }) => {
  const [currentPhoto, setCurrentPhoto] = useState(0);
  const [foundClues, setFoundClues] = useState([]);
  const [showHint, setShowHint] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Personalized photo treasure hunt untuk Anggita
  const personalizedPhotos = [
    {
      image: "/images/photos/bebek.jpg",
      clue: "Di masa study session kita, Mas Za sering gambarin hewan apa buat Gita waktu ngajarin matematika?",
      answer: "bebek",
      hint: "Hewan yang lucu dan sering Mas Za sketch sambil explain rumus-rumus"
    },
    {
      image: "/images/photos/discord.jpg", 
      clue: "Platform apa yang kita pake buat date online dan nonton bareng?",
      answer: "discord",
      hint: "Gaming platform yang jadi virtual meeting place kita"
    },
    {
      image: "/images/photos/jadian.jpg",
      clue: "Tanggal berapa kita jadian? (format: DD/MM)",
      answer: "10/03",
      hint: "Bulan Maret, tanggal yang double digit dan sama"
    },
    {
      image: "/images/photos/binturong.jpg",
      clue: "Hewan favorit yang pengen Gita pelihara tapi Pak Niam sama Bu Nita belum ngizinin?",
      answer: "binturong",
      hint: "Hewan nokturnal yang cute banget"
    },
    {
      image: "/images/photos/recent-photo.jpg",
      clue: "Makanan aneh yang Gita suka tapi bikin Mas Za bingung?",
      answer: "nasi alpukat",
      hint: "Kombinasi weird antara carb dan buah hijau"
    },
    {
      image: "/images/photos/birthday-last-year.jpg",
      clue: "Cita-cita Gita yang bikin Mas Za bangga dan support terus?",
      answer: "dokter gigi",
      hint: "Profesi medis yang berhubungan dengan oral health"
    }
  ];

  const photos = level?.content?.photos || personalizedPhotos;
  const currentPhotoData = photos[currentPhoto];

  useEffect(() => {
    if (foundClues.length === photos.length && photos.length > 0) {
      setTimeout(() => {
        onComplete();
      }, 2000);
    }
  }, [foundClues, photos.length, onComplete]);

  const handleSubmitAnswer = () => {
    const correct = userAnswer.toLowerCase().trim() === currentPhotoData.answer.toLowerCase();
    setIsCorrect(correct);
    setShowFeedback(true);

    if (correct) {
      setFoundClues(prev => [...prev, currentPhoto]);
      setTimeout(() => {
        if (currentPhoto < photos.length - 1) {
          setCurrentPhoto(prev => prev + 1);
          setUserAnswer('');
          setShowFeedback(false);
          setShowHint(false);
        }
      }, 2000);
    } else {
      setTimeout(() => {
        setShowFeedback(false);
      }, 3000);
    }
  };

  const nextPhoto = () => {
    if (currentPhoto < photos.length - 1) {
      setCurrentPhoto(prev => prev + 1);
      setUserAnswer('');
      setShowFeedback(false);
      setShowHint(false);
    }
  };

  const prevPhoto = () => {
    if (currentPhoto > 0) {
      setCurrentPhoto(prev => prev - 1);
      setUserAnswer('');
      setShowFeedback(false);
      setShowHint(false);
    }
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
          🕵️‍♀️
        </motion.div>
        
        <h2 className="text-3xl font-dancing text-white mb-4">
          Memory Treasure Hunt
        </h2>
        
        <p className="text-white/80 text-lg">
          Find the hidden details dalam kenangan kita bersama, bocah Tambran detective!
        </p>
      </div>

      {/* Progress */}
      <div className="flex justify-center gap-4 mb-8">
        <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
          <div className="flex items-center gap-2 text-white">
            <Trophy size={16} />
            <span>Found: {foundClues.length}/{photos.length}</span>
          </div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
          <div className="flex items-center gap-2 text-white">
            <Search size={16} />
            <span>Memory {currentPhoto + 1}/{photos.length}</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="w-full bg-white/20 rounded-full h-3">
          <motion.div 
            className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(foundClues.length / photos.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Photo Display */}
        <div className="space-y-6">
          <div className="relative">
            {/* Photo Container */}
            <motion.div
              key={currentPhoto}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative aspect-square bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl overflow-hidden"
            >
              {/* FIXED: Actual Photo Display */}
              {currentPhotoData.image ? (
                <img 
                  src={currentPhotoData.image} 
                  alt={`Memory ${currentPhoto + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to placeholder if image fails to load
                    e.target.style.display = 'none';
                    e.target.nextElementSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              
              {/* Fallback Placeholder */}
              <div 
                className="w-full h-full bg-gradient-to-br from-purple-300 to-pink-400 flex items-center justify-center"
                style={{ display: currentPhotoData.image ? 'none' : 'flex' }}
              >
                <div className="text-center text-white">
                  <div className="text-6xl mb-4">📸</div>
                  <p className="text-sm">Memory: {currentPhotoData.image}</p>
                </div>
              </div>

              {/* Found Indicator */}
              {foundClues.includes(currentPhoto) && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-4 right-4 bg-green-500 text-white p-3 rounded-full"
                >
                  <CheckCircle size={24} />
                </motion.div>
              )}

              {/* Magnifying Glass Overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-white/30 text-8xl"
                >
                  🔍
                </motion.div>
              </div>
            </motion.div>

            {/* Navigation Arrows */}
            <div className="absolute inset-y-0 left-0 flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={prevPhoto}
                disabled={currentPhoto === 0}
                className="p-2 ml-2"
              >
                ←
              </Button>
            </div>
            
            <div className="absolute inset-y-0 right-0 flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={nextPhoto}
                disabled={currentPhoto === photos.length - 1}
                className="p-2 mr-2"
              >
                →
              </Button>
            </div>
          </div>

          {/* Photo Thumbnails */}
          <div className="flex gap-2 justify-center">
            {photos.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPhoto(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentPhoto
                    ? 'bg-yellow-400 scale-125'
                    : foundClues.includes(index)
                    ? 'bg-green-400'
                    : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Clue and Answer Section */}
        <div className="space-y-6">
          {/* Clue Card */}
          <motion.div
            key={currentPhoto}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <Search className="text-yellow-400" size={24} />
              <h3 className="text-xl font-dancing text-white">Find the Memory</h3>
            </div>
            
            <p className="text-white/90 text-lg leading-relaxed mb-6">
              {currentPhotoData.clue}
            </p>

            {/* Answer Input */}
            {!foundClues.includes(currentPhoto) && (
              <div className="space-y-4">
                <div>
                  <label className="text-white/80 text-sm block mb-2">
                    Your Answer:
                  </label>
                  <input
                    type="text"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Type your answer here..."
                    className="w-full p-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-yellow-400"
                    onKeyPress={(e) => e.key === 'Enter' && handleSubmitAnswer()}
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="primary"
                    onClick={handleSubmitAnswer}
                    disabled={!userAnswer.trim()}
                    className="flex-1"
                  >
                    Submit Answer
                  </Button>
                  
                  <Button
                    variant="secondary"
                    onClick={() => setShowHint(!showHint)}
                    icon={<Lightbulb size={16} />}
                  >
                    Hint
                  </Button>
                </div>
              </div>
            )}

            {/* Already Found */}
            {foundClues.includes(currentPhoto) && (
              <div className="text-center p-4 bg-green-400/20 rounded-lg border border-green-400/30">
                <CheckCircle className="text-green-400 mx-auto mb-2" size={32} />
                <p className="text-green-300 font-medium">Memory Found!</p>
                <p className="text-white/80 text-sm mt-1">Answer: {currentPhotoData.answer}</p>
              </div>
            )}
          </motion.div>

          {/* Hint Card */}
          <AnimatePresence>
            {showHint && !foundClues.includes(currentPhoto) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-yellow-400/20 border border-yellow-400/30 rounded-2xl p-6"
              >
                <div className="flex items-center gap-3 mb-3">
                  <Lightbulb className="text-yellow-400" size={20} />
                  <h4 className="text-lg font-medium text-yellow-200">Hint from Mas Za</h4>
                </div>
                <p className="text-yellow-200/90">
                  {currentPhotoData.hint}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Feedback */}
          <AnimatePresence>
            {showFeedback && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`p-6 rounded-2xl border-2 ${
                  isCorrect 
                    ? 'bg-green-400/20 border-green-400/50 text-green-300' 
                    : 'bg-red-400/20 border-red-400/50 text-red-300'
                }`}
              >
                <div className="text-center">
                  <div className="text-4xl mb-2">
                    {isCorrect ? '🎉' : '🤔'}
                  </div>
                  <h4 className="text-lg font-medium mb-2">
                    {isCorrect ? 'Correct!' : 'Not quite right...'}
                  </h4>
                  <p className="text-sm opacity-90">
                    {isCorrect 
                      ? 'Amazing memory skills! You found our hidden treasure!' 
                      : 'Take another look at our memories and try again!'
                    }
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Instructions */}
      {foundClues.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mt-8 bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20"
        >
          <h3 className="text-lg font-dancing text-white mb-3">
            How to Play 🕵️‍♀️
          </h3>
          <p className="text-white/80 mb-4">
            Look carefully at each memory dan find detail yang mentioned in the clue. 
            Setiap clue adalah tentang kenangan spesial kita atau hal-hal yang Gita suka!
          </p>
          <p className="text-white/70 text-sm">
            Need help? Use the hint button untuk guidance dari Mas Za!
          </p>
        </motion.div>
      )}

      {/* Completion Celebration */}
      {foundClues.length === photos.length && photos.length > 0 && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center mt-8"
        >
          <div className="text-8xl mb-4">🏆</div>
          <h3 className="text-4xl font-dancing text-white mb-4">
            Memory Detective Master!
          </h3>
          <p className="text-white/90 text-lg max-w-2xl mx-auto">
            Kamu berhasil found semua hidden treasures dalam kenangan kita! 
            Your attention to detail is amazing - just like how you always remember 
            setiap momen spesial yang kita share together. You truly know our story by heart! 💕
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default TreasureHuntLevel;