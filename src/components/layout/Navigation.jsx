import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
import { ChevronLeft, ChevronRight, Home, Map, Trophy, Settings } from 'lucide-react';
import { levels } from '../../data/levels';
import useProgress from '../../hooks/useProgress';
import Button from '../ui/Button';

const Navigation = ({ currentLevel, showLevelSelector = true }) => {
  const router = useRouter();
  const [showLevelMap, setShowLevelMap] = useState(false);
  const { isLevelUnlocked, isLevelCompleted, getCompletionPercentage } = useProgress();

  const goToLevel = (levelId) => {
    if (isLevelUnlocked(levelId)) {
      router.push(`/level/${levelId}`);
      setShowLevelMap(false);
    }
  };

  const goToPrevious = () => {
    const prevLevel = currentLevel - 1;
    if (prevLevel >= 1) {
      router.push(`/level/${prevLevel}`);
    } else {
      router.push('/');
    }
  };

  const goToNext = () => {
    const nextLevel = currentLevel + 1;
    if (nextLevel <= 17 && isLevelUnlocked(nextLevel)) {
      router.push(`/level/${nextLevel}`);
    }
  };

  const goHome = () => {
    router.push('/');
  };

  return (
    <>
      {/* Main Navigation Bar */}
      <motion.nav
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40"
      >
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-full p-2 shadow-2xl">
          <div className="flex items-center gap-2">
            {/* Previous Level */}
            <Button
              variant="ghost"
              size="sm"
              onClick={goToPrevious}
              disabled={currentLevel <= 1}
              className="p-3 rounded-full"
              icon={currentLevel <= 1 ? <Home size={20} /> : <ChevronLeft size={20} />}
            />

            {/* Level Selector */}
            {showLevelSelector && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowLevelMap(true)}
                className="px-4 py-3 rounded-full"
                icon={<Map size={18} />}
              >
                <span className="hidden sm:inline ml-2">
                  Level {currentLevel}
                </span>
              </Button>
            )}

            {/* Progress Indicator */}
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full">
              <Trophy className="text-gold" size={16} />
              <span className="text-white text-sm font-medium">
                {getCompletionPercentage()}%
              </span>
              <div className="w-16 bg-white/20 rounded-full h-2">
                <div 
                  className="bg-gold h-2 rounded-full transition-all duration-500"
                  style={{ width: `${getCompletionPercentage()}%` }}
                />
              </div>
            </div>

            {/* Next Level */}
            <Button
              variant="ghost"
              size="sm"
              onClick={goToNext}
              disabled={currentLevel >= 17 || !isLevelUnlocked(currentLevel + 1)}
              className="p-3 rounded-full"
              icon={<ChevronRight size={20} />}
            />
          </div>
        </div>
      </motion.nav>

      {/* Level Map Modal */}
      <AnimatePresence>
        {showLevelMap && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowLevelMap(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-dancing text-white">
                  Choose Your Level 🗺️
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowLevelMap(false)}
                  className="p-2"
                >
                  ✕
                </Button>
              </div>

              {/* Progress Overview */}
              <div className="bg-white/5 rounded-2xl p-4 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-white/80">Overall Progress</span>
                  <span className="text-white font-medium">{getCompletionPercentage()}%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-3">
                  <motion.div 
                    className="bg-gradient-to-r from-pink-400 to-purple-400 h-3 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${getCompletionPercentage()}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
              </div>

              {/* Level Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {levels.map((level) => {
                  const isUnlocked = isLevelUnlocked(level.id);
                  const isCompleted = isLevelCompleted(level.id);
                  const isCurrent = level.id === currentLevel;

                  return (
                    <motion.div
                      key={level.id}
                      whileHover={isUnlocked ? { scale: 1.05 } : {}}
                      whileTap={isUnlocked ? { scale: 0.95 } : {}}
                      className={`
                        relative p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300
                        ${isCurrent 
                          ? 'border-gold bg-gold/20 shadow-gold' 
                          : isCompleted 
                          ? 'border-green-400 bg-green-400/20' 
                          : isUnlocked 
                          ? 'border-white/30 bg-white/10 hover:border-white/50 hover:bg-white/20' 
                          : 'border-white/10 bg-white/5 opacity-50 cursor-not-allowed'
                        }
                      `}
                      onClick={() => isUnlocked && goToLevel(level.id)}
                    >
                      {/* Level Number */}
                      <div className="text-center mb-3">
                        <div className={`
                          w-12 h-12 rounded-full mx-auto flex items-center justify-center text-lg font-bold
                          ${isCurrent 
                            ? 'bg-gold text-white' 
                            : isCompleted 
                            ? 'bg-green-400 text-white' 
                            : isUnlocked 
                            ? 'bg-white/20 text-white' 
                            : 'bg-white/10 text-white/50'
                          }
                        `}>
                          {isCompleted ? '✓' : level.id}
                        </div>
                      </div>

                      {/* Level Info */}
                      <div className="text-center">
                        <div className="text-2xl mb-2">{level.icon}</div>
                        <h3 className="text-white font-medium text-sm leading-tight mb-1">
                          {level.title}
                        </h3>
                        <p className="text-white/60 text-xs">
                          {level.category}
                        </p>
                      </div>

                      {/* Status Indicators */}
                      {isCurrent && (
                        <div className="absolute -top-2 -right-2 bg-gold text-white text-xs px-2 py-1 rounded-full">
                          Current
                        </div>
                      )}
                      
                      {isCompleted && !isCurrent && (
                        <div className="absolute -top-2 -right-2 bg-green-400 text-white text-xs px-2 py-1 rounded-full">
                          ✓
                        </div>
                      )}
                      
                      {!isUnlocked && (
                        <div className="absolute inset-0 bg-black/30 rounded-2xl flex items-center justify-center">
                          <div className="text-white/80 text-2xl">🔒</div>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {/* Categories Legend */}
              <div className="mt-6 pt-6 border-t border-white/20">
                <h3 className="text-white font-medium mb-3">Categories</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-white/70">
                    <div className="w-3 h-3 rounded-full bg-pink-400"></div>
                    Memory Lane
                  </div>
                  <div className="flex items-center gap-2 text-white/70">
                    <div className="w-3 h-3 rounded-full bg-purple-400"></div>
                    Getting to Know You
                  </div>
                  <div className="flex items-center gap-2 text-white/70">
                    <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                    Adventures Together
                  </div>
                  <div className="flex items-center gap-2 text-white/70">
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    Fun & Games
                  </div>
                  <div className="flex items-center gap-2 text-white/70">
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    Hidden Treasures
                  </div>
                  <div className="flex items-center gap-2 text-white/70">
                    <div className="w-3 h-3 rounded-full bg-gold"></div>
                    Grand Finale
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;