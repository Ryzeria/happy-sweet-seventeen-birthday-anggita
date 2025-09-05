import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar, MapPin, Play, Pause, Heart } from 'lucide-react';
import Button from '../ui/Button';

const TimelineLevel = ({ level, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewedItems, setViewedItems] = useState(new Set());
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  
  const timeline = level.content.timeline;

  // Mark current item as viewed
  useEffect(() => {
    setViewedItems(prev => new Set([...prev, currentIndex]));
  }, [currentIndex]);

  // Auto complete logic
  useEffect(() => {
    // Complete setelah lihat semua timeline
    if (viewedItems.size === timeline.length && !isCompleted) {
      setTimeout(() => {
        setIsCompleted(true);
        onComplete();
      }, 2000);
    }
    
    // Auto complete setelah 10 detik untuk testing
    const autoCompleteTimer = setTimeout(() => {
      if (!isCompleted) {
        setIsCompleted(true);
        onComplete();
      }
    }, 10000);

    return () => clearTimeout(autoCompleteTimer);
  }, [viewedItems, timeline.length, onComplete, isCompleted]);

  // Auto play functionality
  useEffect(() => {
    let interval;
    if (isAutoPlaying && !isCompleted) {
      interval = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % timeline.length);
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying, timeline.length, isCompleted]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % timeline.length);
    setIsAutoPlaying(false);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + timeline.length) % timeline.length);
    setIsAutoPlaying(false);
  };

  const goToItem = (index) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying);
  };

  const handleManualComplete = () => {
    setIsCompleted(true);
    onComplete();
  };

  const currentItem = timeline[currentIndex];

  return (
    <div className="max-w-4xl mx-auto">
      {/* TESTING BUTTON */}
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
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0] 
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity,
            ease: "easeInOut" 
          }}
          className="text-6xl mb-4"
        >
          {currentItem.emoji}
        </motion.div>
        
        <h2 className="text-3xl font-dancing text-white mb-2">
          Our Beautiful Journey
        </h2>
        
        <p className="text-white/80 text-lg mb-4">
          Explore the timeline of our love story
        </p>

        <div className="flex items-center justify-center gap-2 text-white/70 text-sm">
          <span>Explored: {viewedItems.size}/{timeline.length}</span>
          <div className="w-32 bg-white/20 rounded-full h-2 ml-2">
            <motion.div 
              className="bg-rose-400 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(viewedItems.size / timeline.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>

      {/* Auto-play controls */}
      <div className="text-center mb-8">
        <Button
          variant="secondary"
          size="sm"
          onClick={toggleAutoPlay}
          className={`${isAutoPlaying ? 'bg-white/30' : ''}`}
          icon={isAutoPlaying ? <Pause size={16} /> : <Play size={16} />}
        >
          {isAutoPlaying ? 'Pause Auto-Play' : 'Start Auto-Play'}
        </Button>
      </div>

      {/* Main Timeline Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 100, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -100, scale: 0.9 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 mb-8 shadow-2xl"
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Content */}
            <div className="order-2 md:order-1">
              <div className="flex items-center gap-3 mb-6">
                <motion.div 
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-4xl"
                >
                  {currentItem.emoji}
                </motion.div>
                <div>
                  <div className="flex items-center gap-2 text-white/70 mb-2">
                    <Calendar size={16} />
                    <span className="text-sm font-medium">{currentItem.date}</span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-dancing text-white">
                    {currentItem.title}
                  </h3>
                </div>
              </div>

              <p className="text-white/90 text-lg leading-relaxed mb-6">
                {currentItem.description}
              </p>

              <div className="flex items-center gap-2 text-white/70">
                <span className="text-sm">
                  {currentIndex + 1} of {timeline.length}
                </span>
                <div className="flex-1 bg-white/20 rounded-full h-2 max-w-xs">
                  <motion.div 
                    className="bg-rose-400 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentIndex + 1) / timeline.length) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            </div>

            {/* Image */}
            <div className="order-1 md:order-2">
              <motion.div
                className="relative aspect-square rounded-2xl overflow-hidden shadow-heart bg-gradient-to-br from-pink-300 to-purple-400"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                {/* Try to load actual image first */}
                <img 
                  src={currentItem.image} 
                  alt={currentItem.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // If image fails to load, show placeholder
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                  onLoad={(e) => {
                    // If image loads successfully, hide placeholder
                    e.target.nextSibling.style.display = 'none';
                  }}
                />
                
                {/* Fallback placeholder */}
                <div className="absolute inset-0 flex items-center justify-center text-white bg-gradient-to-br from-pink-300 to-purple-400">
                  <div className="text-center p-4">
                    <div className="text-6xl mb-4">📸</div>
                    <p className="text-sm font-medium mb-1">Photo Memory</p>
                    <p className="text-xs opacity-80">{currentItem.title}</p>
                  </div>
                </div>

                {viewedItems.has(currentIndex) && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute top-4 right-4 bg-pink-500 rounded-full p-2"
                  >
                    <Heart size={16} className="text-white fill-current" />
                  </motion.div>
                )}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between mb-8">
        <Button
          variant="secondary"
          onClick={goToPrevious}
          disabled={isCompleted}
          icon={<ChevronLeft size={20} />}
          className="flex items-center gap-2"
        >
          Previous
        </Button>

        <div className="text-center">
          <p className="text-white/70 text-sm mb-2">Progress</p>
          <div className="text-white text-lg font-semibold">
            {Math.round(((viewedItems.size) / timeline.length) * 100)}%
          </div>
        </div>

        <Button
          variant="secondary"
          onClick={goToNext}
          disabled={isCompleted}
          icon={<ChevronRight size={20} />}
          className="flex items-center gap-2"
        >
          Next
        </Button>
      </div>

      {/* Timeline Dots */}
      <div className="flex justify-center gap-3 mb-8">
        {timeline.map((item, index) => (
          <motion.button
            key={index}
            onClick={() => goToItem(index)}
            disabled={isCompleted}
            className={`relative w-5 h-5 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'bg-rose-400 shadow-glow ring-2 ring-rose-400/50 scale-125'
                : viewedItems.has(index)
                ? 'bg-green-400 scale-100'
                : 'bg-white/30 scale-90'
            }`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-lg">
              {index === currentIndex && (
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  {item.emoji}
                </motion.div>
              )}
            </div>
          </motion.button>
        ))}
      </div>

      {/* Timeline Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {timeline.map((item, index) => (
          <motion.div
            key={index}
            onClick={() => goToItem(index)}
            className={`p-4 rounded-xl cursor-pointer transition-all duration-300 ${
              index === currentIndex
                ? 'bg-white/20 border-2 border-rose-400 shadow-heart'
                : viewedItems.has(index)
                ? 'bg-white/10 border border-green-400/50'
                : 'bg-white/5 border border-white/20 hover:bg-white/10'
            }`}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="text-2xl mb-2">{item.emoji}</div>
            <div className="text-white/70 text-xs mb-1">{item.date}</div>
            <div className="text-white text-sm font-medium leading-tight">{item.title}</div>
            
            <div className="mt-2">
              {index === currentIndex && (
                <div className="text-rose-400 text-xs">🔍 Current</div>
              )}
              {viewedItems.has(index) && index !== currentIndex && (
                <div className="text-green-400 text-xs">✅ Viewed</div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Completion celebration */}
      <AnimatePresence>
        {isCompleted && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center mt-8 bg-gradient-to-r from-pink-400/20 to-purple-400/20 backdrop-blur-sm p-8 rounded-3xl border border-pink-300/50"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0] 
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                ease: "easeInOut" 
              }}
              className="text-6xl mb-4"
            >
              🎉
            </motion.div>
            
            <h3 className="text-3xl font-dancing text-white mb-4">
              Journey Complete!
            </h3>
            
            <p className="text-white/90 text-lg mb-6 max-w-2xl mx-auto">
              You've explored our entire beautiful journey together! 
              Every moment, every memory, every step that brought us to where we are today. 
              {level.completionMessage}
            </p>

            <div className="flex justify-center gap-4">
              <Button
                variant="primary"
                size="lg"
                onClick={() => window.location.href = '/level/2'}
                className="bg-gradient-to-r from-gold to-yellow-400 text-white"
              >
                Continue to Next Level ➡️
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Encouragement messages */}
      {!isCompleted && viewedItems.size >= 2 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mt-8 bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20"
        >
          <h3 className="text-lg font-dancing text-white mb-3">
            Great job exploring our memories! 💕
          </h3>
          <p className="text-white/80 text-sm">
            You're doing amazing! Keep going through our timeline to unlock the next level.
          </p>
        </motion.div>
      )}

      {/* Instructions */}
      {viewedItems.size <= 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mt-8 bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20"
        >
          <h3 className="text-lg font-dancing text-white mb-3">
            Welcome to Our Love Story! 💖
          </h3>
          <p className="text-white/80 mb-4">
            Navigate through our timeline using the arrow buttons or click on the dots below.
            Each moment tells a part of our beautiful journey together.
          </p>
          <p className="text-white/70 text-sm">
            💡 Tip: Try the auto-play feature to sit back and enjoy the memories!
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default TimelineLevel;