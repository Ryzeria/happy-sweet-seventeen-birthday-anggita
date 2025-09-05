import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Star, Check } from 'lucide-react';
import { levels, getLevel, unlockLevel } from '../../src/data/levels';
import FloatingHearts from '../../src/components/animations/FloatingHearts';
import ParticleSystem from '../../src/components/animations/ParticleSystem';

// Import level components
import TimelineLevel from '../../src/components/levels/TimelineLevel';
import JigsawLevel from '../../src/components/levels/JigsawLevel';
import MemoryCardsLevel from '../../src/components/levels/MemoryCardsLevel';
import PersonalityQuizLevel from '../../src/components/levels/PersonalityQuizLevel';
import BingoLevel from '../../src/components/levels/BingoLevel';
import WordSearchLevel from '../../src/components/levels/WordSearchLevel';
import InteractiveMapLevel from '../../src/components/levels/InteractiveMapLevel';
import TreasureHuntLevel from '../../src/components/levels/TreasureHuntLevel';
import RouletteLevel from '../../src/components/levels/RouletteLevel';
import CrosswordLevel from '../../src/components/levels/CrosswordLevel';
import AdvancedMemoryLevel from '../../src/components/levels/AdvancedMemoryLevel';
import ArcadeGameLevel from '../../src/components/levels/ArcadeGameLevel';
import FolderExplorerLevel from '../../src/components/levels/FolderExplorerLevel';
import CipherGameLevel from '../../src/components/levels/CipherGameLevel';
import EscapeRoomLevel from '../../src/components/levels/EscapeRoomLevel';
import InteractiveStoryLevel from '../../src/components/levels/InteractiveStoryLevel';
import FinalSurpriseLevel from '../../src/components/levels/FinalSurpriseLevel';

export default function LevelPage() {
  const router = useRouter();
  const { id } = router.query;
  const [level, setLevel] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (id) {
      const levelData = getLevel(parseInt(id));
      setLevel(levelData);
      
      // Check if level is unlocked
      if (levelData && !levelData.unlocked && parseInt(id) !== 1) {
        router.push('/level/1');
      }
    }
  }, [id, router]);

  const handleLevelComplete = () => {
    setIsCompleted(true);
    setShowCompletion(true);
    
    // Unlock next level
    const nextLevelId = parseInt(id) + 1;
    if (nextLevelId <= 17) {
      unlockLevel(nextLevelId);
    }
  };

  const goToNextLevel = () => {
    const nextLevelId = parseInt(id) + 1;
    if (nextLevelId <= 17) {
      router.push(`/level/${nextLevelId}`);
    } else {
      router.push('/level/complete');
    }
  };

  const goToPreviousLevel = () => {
    const prevLevelId = parseInt(id) - 1;
    if (prevLevelId >= 1) {
      router.push(`/level/${prevLevelId}`);
    }
  };

  const renderLevelComponent = () => {
    if (!level) return null;

    const componentProps = {
      level,
      onComplete: handleLevelComplete,
      onProgress: setProgress
    };

    switch (level.type) {
      case 'timeline':
        return <TimelineLevel {...componentProps} />;
      case 'jigsaw':
        return <JigsawLevel {...componentProps} />;
      case 'memory-cards':
        return <MemoryCardsLevel {...componentProps} />;
      case 'personality-quiz':
        return <PersonalityQuizLevel {...componentProps} />;
      case 'bingo':
        return <BingoLevel {...componentProps} />;
      case 'word-search':
        return <WordSearchLevel {...componentProps} />;
      case 'interactive-map':
        return <InteractiveMapLevel {...componentProps} />;
      case 'treasure-hunt':
        return <TreasureHuntLevel {...componentProps} />;
      case 'roulette':
        return <RouletteLevel {...componentProps} />;
      case 'crossword':
        return <CrosswordLevel {...componentProps} />;
      case 'advanced-memory':
        return <AdvancedMemoryLevel {...componentProps} />;
      case 'arcade-game':
        return <ArcadeGameLevel {...componentProps} />;
      case 'folder-explorer':
        return <FolderExplorerLevel {...componentProps} />;
      case 'cipher-game':
        return <CipherGameLevel {...componentProps} />;
      case 'escape-room':
        return <EscapeRoomLevel {...componentProps} />;
      case 'interactive-story':
        return <InteractiveStoryLevel {...componentProps} />;
      case 'final-surprise':
        return <FinalSurpriseLevel {...componentProps} />;
      default:
        return <div>Level type not found</div>;
    }
  };

  if (!level) {
    return (
      <div className="min-h-screen bg-gradient-love flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-love relative overflow-hidden">
      <ParticleSystem />
      <FloatingHearts />
      
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="relative z-50 p-6"
      >
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          {/* Back Button */}
          <motion.button
            onClick={goToPreviousLevel}
            disabled={parseInt(id) === 1}
            className="btn-secondary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft size={20} />
            Back
          </motion.button>

          {/* Level Info */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-2xl">{level.icon}</span>
              <h1 className="text-2xl md:text-3xl font-dancing text-white">
                Level {id}
              </h1>
            </div>
            <p className="text-white/80 text-sm">
              {level.category}
            </p>
          </div>

          {/* Progress */}
          <div className="text-right">
            <div className="text-white text-sm mb-1">
              {parseInt(id)}/17
            </div>
            <div className="w-24 bg-white/20 rounded-full h-2">
              <div 
                className="bg-gold h-2 rounded-full transition-all duration-300"
                style={{ width: `${(parseInt(id) / 17) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </motion.header>

      {/* Level Content */}
      <main className="relative z-10 px-4 pb-20">
        <div className="max-w-6xl mx-auto">
          {/* Level Title */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h2 className={`text-4xl md:text-6xl font-dancing text-white mb-4 bg-gradient-to-r ${level.color} bg-clip-text text-transparent`}>
              {level.title}
            </h2>
            <p className="text-xl text-white/90 mb-2">
              {level.subtitle}
            </p>
            <p className="text-white/70">
              {level.description}
            </p>
          </motion.div>

          {/* Level Component */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            {renderLevelComponent()}
          </motion.div>
        </div>
      </main>

      {/* Completion Modal */}
      <AnimatePresence>
        {showCompletion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 10 }}
              className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20 text-center max-w-lg mx-auto"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-6"
              >
                <div className="text-6xl mb-4">🎉</div>
                <div className="flex justify-center mb-4">
                  <Check className="text-green-400 bg-green-400/20 rounded-full p-2" size={48} />
                </div>
              </motion.div>

              <h3 className="text-3xl font-dancing text-white mb-4">
                Level Completed!
              </h3>
              
              <p className="text-white/90 text-lg mb-6 leading-relaxed">
                {level.completionMessage}
              </p>

              <div className="flex gap-4 justify-center">
                <motion.button
                  onClick={() => setShowCompletion(false)}
                  className="btn-secondary"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Stay Here
                </motion.button>
                
                <motion.button
                  onClick={goToNextLevel}
                  className="btn-love flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {parseInt(id) < 17 ? (
                    <>
                      Next Level
                      <ArrowRight size={20} />
                    </>
                  ) : (
                    <>
                      Grand Finale
                      <Star size={20} />
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}