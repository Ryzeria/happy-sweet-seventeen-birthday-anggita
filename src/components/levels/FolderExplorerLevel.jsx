import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Folder, FolderOpen, X, Star, Heart, Gift } from 'lucide-react';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import { generateAllFolders, isSpecialFolder, specialFolderTypes, getFolderHint } from '../../data/folders';

const FolderExplorerLevel = ({ level, onComplete }) => {
  const [folders] = useState(generateAllFolders());
  const [openedFolders, setOpenedFolders] = useState(new Set());
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentHint, setCurrentHint] = useState('');
  const [progress, setProgress] = useState(0);

  // Update progress when folders are opened
  useEffect(() => {
    const progressPercentage = (openedFolders.size / 100) * 100;
    setProgress(progressPercentage);

    // Check if enough folders opened to complete level
    if (openedFolders.size >= 20) {
      setTimeout(() => {
        onComplete();
      }, 2000);
    }
  }, [openedFolders, onComplete]);

  // Set initial hint
  useEffect(() => {
    setCurrentHint(getFolderHint());
  }, []);

  const handleFolderClick = (folderId) => {
    if (openedFolders.has(folderId)) {
      // Already opened, show content again
      setSelectedFolder(folders[folderId]);
      setShowModal(true);
    } else {
      // First time opening
      setOpenedFolders(prev => new Set([...prev, folderId]));
      setSelectedFolder(folders[folderId]);
      setShowModal(true);
      
      // Change hint occasionally
      if (Math.random() < 0.3) {
        setCurrentHint(getFolderHint());
      }
    }
  };

  const getFolderStyle = (folderId) => {
    const isSpecial = isSpecialFolder(folderId);
    const isOpened = openedFolders.has(folderId);
    
    if (isSpecial) {
      if (isOpened) {
        return 'border-gold bg-gold/20 text-white shadow-gold';
      } else {
        return 'border-yellow-400 bg-yellow-400/10 text-yellow-200 shadow-lg animate-pulse';
      }
    } else {
      if (isOpened) {
        return 'border-green-400 bg-green-400/10 text-green-200';
      } else {
        return 'border-white/30 bg-white/5 text-white/70 hover:border-white/50 hover:bg-white/10';
      }
    }
  };

  const getFolderTypeStyle = (type) => {
    return specialFolderTypes[type] || specialFolderTypes.default;
  };

  const renderFolderContent = () => {
    if (!selectedFolder) return null;

    const typeStyle = getFolderTypeStyle(selectedFolder.type);
    
    return (
      <div className="space-y-6">
        {/* Header with Icon */}
        <div className="text-center">
          <div className="text-6xl mb-4">
            {selectedFolder.icon}
          </div>
          <h2 className="text-2xl font-dancing text-white mb-2">
            {selectedFolder.title}
          </h2>
          {selectedFolder.date && (
            <p className="text-white/60 text-sm">
              {selectedFolder.date}
            </p>
          )}
        </div>

        {/* Content */}
        <div className={`p-6 rounded-2xl bg-gradient-to-br ${typeStyle.bgColor}`}>
          <div className="space-y-4">
            {/* FIXED: Proper image display */}
            {selectedFolder.image && (
              <div className="w-full h-48 rounded-xl overflow-hidden mb-4">
                <img 
                  src={selectedFolder.image} 
                  alt={selectedFolder.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback jika gambar tidak ditemukan
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="w-full h-48 bg-white/10 rounded-xl hidden items-center justify-center mb-4">
                  <p className="text-white/80 text-sm">
                    📸 {selectedFolder.image}
                  </p>
                </div>
              </div>
            )}
            
            <p className={`text-lg leading-relaxed ${typeStyle.textColor}`}>
              {selectedFolder.content}
            </p>
          </div>
        </div>

        {/* Special Message for Special Folders */}
        {selectedFolder.isSpecial && (
          <div className="bg-gold/20 border border-gold/50 p-4 rounded-xl text-center">
            <div className="text-2xl mb-2">🌟</div>
            <p className="text-gold font-medium">
              This is a special folder! You found one of the hidden treasures! ✨
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto">
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
          📁
        </motion.div>
        
        <h2 className="text-3xl font-dancing text-white mb-4">
          100 Folders of Love
        </h2>
        
        <p className="text-white/80 text-lg max-w-2xl mx-auto">
          Explore 100 folders filled dengan surprises, love notes, memories, dan special messages dari Mas Za untukmu!
        </p>
      </div>

      {/* Progress & Stats */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
          <div className="flex items-center gap-2 text-white">
            <FolderOpen size={16} />
            <span>Explored: {openedFolders.size}/100</span>
          </div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
          <div className="flex items-center gap-2 text-white">
            <Star size={16} />
            <span>Progress: {Math.round(progress)}%</span>
          </div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
          <div className="flex items-center gap-2 text-white">
            <Gift size={16} />
            <span>Special: {Array.from(openedFolders).filter(id => isSpecialFolder(id)).length}</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8 max-w-2xl mx-auto">
        <div className="w-full bg-white/20 rounded-full h-4">
          <motion.div 
            className="bg-gradient-to-r from-pink-400 to-purple-400 h-4 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Hint */}
      {currentHint && openedFolders.size < 50 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/20 max-w-xl mx-auto"
        >
          <p className="text-white/80 text-sm">
            💡 <em>{currentHint}</em>
          </p>
        </motion.div>
      )}

      {/* Folder Grid */}
      <div className="grid grid-cols-5 md:grid-cols-10 gap-3 mb-8">
        {Array.from({ length: 100 }, (_, i) => i + 1).map(folderId => {
          const isOpened = openedFolders.has(folderId);
          const isSpecial = isSpecialFolder(folderId);
          
          return (
            <motion.button
              key={folderId}
              onClick={() => handleFolderClick(folderId)}
              className={`
                aspect-square p-2 rounded-xl border-2 transition-all duration-300
                ${getFolderStyle(folderId)}
              `}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: (folderId - 1) * 0.01 }}
            >
              <div className="flex flex-col items-center justify-center h-full">
                {/* Folder Icon */}
                <div className="text-2xl mb-1">
                  {isOpened ? (
                    <FolderOpen size={20} />
                  ) : (
                    <Folder size={20} />
                  )}
                </div>
                
                {/* Folder Number */}
                <div className="text-xs font-medium">
                  {folderId}
                </div>
                
                {/* Special Indicator */}
                {isSpecial && !isOpened && (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="absolute -top-1 -right-1"
                  >
                    <div className="w-3 h-3 bg-gold rounded-full">
                      <Star size={8} className="text-white m-0.5" />
                    </div>
                  </motion.div>
                )}
                
                {/* Opened Indicator */}
                {isOpened && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1"
                  >
                    <div className="w-3 h-3 bg-green-400 rounded-full flex items-center justify-center">
                      <div className="text-white text-xs">✓</div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Completion Message */}
      {openedFolders.size >= 20 && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center mt-8"
        >
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-3xl font-dancing text-white mb-4">
            Amazing Explorer!
          </h3>
          <p className="text-white/90 text-lg max-w-2xl mx-auto">
            Gita udah discovered banyak hidden treasures! Setiap folder yang Gita buka mengungkap another piece of my love for you. 
            Keep exploring - masih ada {100 - openedFolders.size} more surprises menanti! 💕
          </p>
        </motion.div>
      )}

      {/* Folder Content Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        size="md"
      >
        {renderFolderContent()}
      </Modal>

      {/* Floating Animation Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <AnimatePresence>
          {openedFolders.size > 0 && (
            <>
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-2xl"
                  initial={{
                    x: `${Math.random() * 100}%`,
                    y: "100%",
                    opacity: 0.7
                  }}
                  animate={{
                    y: "-10%",
                    opacity: [0.7, 1, 0.7, 0]
                  }}
                  transition={{
                    duration: 6 + Math.random() * 4,
                    delay: Math.random() * 3,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                >
                  {['📁', '💝', '✨', '💕', '🌟'][i]}
                </motion.div>
              ))}
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FolderExplorerLevel;