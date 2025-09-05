import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, Volume2, VolumeX, Play, Pause } from 'lucide-react';
import useAudio from '../../hooks/useAudio';
import { useSoundEffects } from '../../hooks/useSoundEffects';

const AudioManager = ({ 
  showControls = true,
  autoStartMusic = false 
}) => {
  const [userInteracted, setUserInteracted] = useState(false);
  const [showWelcomePrompt, setShowWelcomePrompt] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [showFirstTimeNotification, setShowFirstTimeNotification] = useState(false);
  
  // Background music using birthday-song.mp3
  const backgroundMusic = useAudio('/audio/birthday-song.mp3', { 
    loop: true, 
    volume: isMuted ? 0 : 0.4,
    autoPlay: false 
  });

  const soundEffects = useSoundEffects();

  // Check if first time visitor
  useEffect(() => {
    const hasVisited = localStorage.getItem('birthday-site-visited');
    if (!hasVisited) {
      setShowFirstTimeNotification(true);
      localStorage.setItem('birthday-site-visited', 'true');
    } else {
      setShowWelcomePrompt(false);
    }
  }, []);

  // Preload sound effects
  useEffect(() => {
    soundEffects.preloadSounds([
      { name: 'success', src: '/audio/success-sound.mp3' },
      { name: 'click', src: '/audio/click-sound.mp3' },
      { name: 'notification', src: '/audio/notification-sound.mp3' }
    ]);
  }, [soundEffects]);

  // Handle user interaction requirement
  useEffect(() => {
    const handleUserInteraction = () => {
      setUserInteracted(true);
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };

    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('keydown', handleUserInteraction);
    document.addEventListener('touchstart', handleUserInteraction);

    return () => {
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };
  }, []);

  // Auto start music after user interaction and approval
  useEffect(() => {
    if (userInteracted && autoStartMusic && !backgroundMusic.isPlaying) {
      startBackgroundMusic();
    }
  }, [userInteracted, autoStartMusic]);

  // Play notification sound on first visit
  useEffect(() => {
    if (showFirstTimeNotification && userInteracted) {
      setTimeout(() => {
        soundEffects.playSound('notification', 0.6);
      }, 1000);
    }
  }, [showFirstTimeNotification, userInteracted, soundEffects]);

  const startBackgroundMusic = async () => {
    try {
      await backgroundMusic.play();
    } catch (error) {
      console.error('Failed to start background music:', error);
    }
  };

  const toggleMusic = async () => {
    if (backgroundMusic.isPlaying) {
      backgroundMusic.pause();
    } else {
      await startBackgroundMusic();
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    backgroundMusic.setVolume(isMuted ? 0.4 : 0);
  };

  const handleWelcomeResponse = async (startMusic) => {
    setShowWelcomePrompt(false);
    if (startMusic) {
      await startBackgroundMusic();
    }
    // Play notification sound
    setTimeout(() => {
      soundEffects.playSound('notification', 0.6);
    }, 500);
  };

  // Expose sound effects globally for use in other components
  useEffect(() => {
    window.playSuccessSound = () => soundEffects.playSound('success', 0.7);
    window.playClickSound = () => soundEffects.playSound('click', 0.3);
    window.playNotificationSound = () => soundEffects.playSound('notification', 0.6);
    
    return () => {
      delete window.playSuccessSound;
      delete window.playClickSound;
      delete window.playNotificationSound;
    };
  }, [soundEffects]);

  return (
    <>
      {/* Music Controls */}
      {showControls && !showWelcomePrompt && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed top-6 right-6 z-50 flex gap-2"
        >
          {/* Play/Pause Button */}
          <button
            onClick={toggleMusic}
            className="bg-white/20 backdrop-blur-sm p-3 rounded-full border border-white/30 text-white hover:bg-white/30 transition-all duration-300"
            title={backgroundMusic.isPlaying ? 'Pause Music' : 'Play Music'}
          >
            {backgroundMusic.isPlaying ? (
              <Pause size={20} />
            ) : (
              <Play size={20} />
            )}
          </button>

          {/* Mute Button */}
          <button
            onClick={toggleMute}
            className="bg-white/20 backdrop-blur-sm p-3 rounded-full border border-white/30 text-white hover:bg-white/30 transition-all duration-300"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? (
              <VolumeX size={20} />
            ) : (
              <Volume2 size={20} />
            )}
          </button>

          {/* Music Indicator */}
          {backgroundMusic.isPlaying && (
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{ 
                duration: 1, 
                repeat: Infinity 
              }}
              className="bg-pink-500/30 backdrop-blur-sm p-3 rounded-full border border-pink-400/50 text-pink-300"
            >
              <Music size={20} />
            </motion.div>
          )}
        </motion.div>
      )}

      {/* First Time Notification */}
      <AnimatePresence>
        {showFirstTimeNotification && userInteracted && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-center max-w-sm"
          >
            <div className="text-2xl mb-2">🎉</div>
            <p className="text-white text-sm">
              Welcome to your birthday surprise!
            </p>
            <button
              onClick={() => setShowFirstTimeNotification(false)}
              className="mt-2 text-white/70 text-xs hover:text-white"
            >
              Continue
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Welcome Music Prompt */}
      <AnimatePresence>
        {showWelcomePrompt && userInteracted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 text-center max-w-md mx-4"
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity 
                }}
                className="text-6xl mb-4"
              >
                🎂
              </motion.div>
              
              <h3 className="text-2xl font-dancing text-white mb-4">
                Welcome to Your Birthday Surprise!
              </h3>
              
              <p className="text-white/80 mb-6">
                Would you like to play the birthday song while you explore 
                this special website made just for you?
              </p>
              
              <div className="flex gap-4">
                <button
                  onClick={() => handleWelcomeResponse(true)}
                  className="flex-1 bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-xl transition-colors font-medium"
                >
                  Yes, Play Music! 🎵
                </button>
                <button
                  onClick={() => handleWelcomeResponse(false)}
                  className="flex-1 bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl transition-colors"
                >
                  Maybe Later
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AudioManager;
