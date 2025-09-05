import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
import { 
  Heart, 
  Home, 
  Music, 
  Settings, 
  Menu, 
  X, 
  Volume2, 
  VolumeX,
  Star,
  Trophy,
  Clock
} from 'lucide-react';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import useProgress from '../../hooks/useProgress';
import useAudio from '../../hooks/useAudio';
import { usePreferences } from '../../hooks/useLocalStorage';

const Header = () => {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const { progress, getStats, getCompletionPercentage } = useProgress();
  const { preferences, updatePreference } = usePreferences();
  
  // Background music
  const backgroundMusic = useAudio('/audio/background-music.mp3', {
    loop: true,
    volume: preferences.volume || 0.3,
    autoPlay: preferences.autoPlayMusic && preferences.musicEnabled
  });

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Handle music toggle
  const toggleMusic = () => {
    if (backgroundMusic.isPlaying) {
      backgroundMusic.pause();
      updatePreference('musicEnabled', false);
    } else {
      backgroundMusic.play();
      updatePreference('musicEnabled', true);
    }
  };

  // Handle volume change
  const handleVolumeChange = (newVolume) => {
    backgroundMusic.setVolume(newVolume);
    updatePreference('volume', newVolume);
  };

  const stats = getStats();
  const isHomePage = router.pathname === '/';
  const isLevelPage = router.pathname.startsWith('/level/');

  return (
    <>
      {/* Main Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-md border-b border-white/20"
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo/Brand */}
            <motion.div
              className="flex items-center gap-3"
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-2xl animate-pulse">💕</div>
              <div>
                <h1 className="text-lg font-dancing text-white font-semibold">
                  Birthday Journey
                </h1>
                {!isHomePage && (
                  <p className="text-xs text-white/70">
                    Level {router.query.id || 1} of 17
                  </p>
                )}
              </div>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              {/* Progress Indicator */}
              {!isHomePage && (
                <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
                  <Trophy className="text-gold" size={16} />
                  <span className="text-white text-sm">
                    {stats.levelsCompleted}/17
                  </span>
                  <div className="w-20 bg-white/20 rounded-full h-2">
                    <div 
                      className="bg-gold h-2 rounded-full transition-all duration-300"
                      style={{ width: `${getCompletionPercentage()}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Time */}
              <div className="flex items-center gap-2 text-white/80 text-sm">
                <Clock size={16} />
                {currentTime.toLocaleTimeString('id-ID', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>

              {/* Music Controls */}
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleMusic}
                  className="p-2"
                  icon={backgroundMusic.isPlaying ? <Volume2 size={18} /> : <VolumeX size={18} />}
                />
                
                {backgroundMusic.isPlaying && (
                  <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 'auto', opacity: 1 }}
                    className="flex items-center gap-2"
                  >
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={preferences.volume || 0.3}
                      onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                      className="w-20 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                    />
                  </motion.div>
                )}
              </div>

              {/* Navigation Buttons */}
              <div className="flex items-center gap-2">
                {!isHomePage && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push('/')}
                    icon={<Home size={18} />}
                  >
                    Home
                  </Button>
                )}

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsSettingsOpen(true)}
                  icon={<Settings size={18} />}
                >
                  Settings
                </Button>
              </div>
            </nav>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden p-2"
              onClick={() => setIsMobileMenuOpen(true)}
              icon={<Menu size={20} />}
            />
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm md:hidden"
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="absolute right-0 top-0 h-full w-80 bg-gradient-love p-6"
            >
              {/* Close Button */}
              <div className="flex justify-end mb-6">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                  icon={<X size={20} />}
                />
              </div>

              {/* Mobile Navigation */}
              <div className="space-y-6">
                {/* Progress Card */}
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/20">
                  <h3 className="text-white font-medium mb-3">Progress</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-white/80">
                      <span>Levels Completed</span>
                      <span>{stats.levelsCompleted}/17</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div 
                        className="bg-rose-400 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${getCompletionPercentage()}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-sm text-white/80">
                      <span>Total Score</span>
                      <span>{stats.totalScore}</span>
                    </div>
                  </div>
                </div>

                {/* Music Controls */}
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/20">
                  <h3 className="text-white font-medium mb-3">Music</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-white/80 text-sm">Background Music</span>
                      <Button
                        variant={backgroundMusic.isPlaying ? "success" : "secondary"}
                        size="sm"
                        onClick={toggleMusic}
                        icon={backgroundMusic.isPlaying ? <Volume2 size={16} /> : <VolumeX size={16} />}
                      />
                    </div>
                    
                    {backgroundMusic.isPlaying && (
                      <div>
                        <label className="text-white/80 text-sm block mb-2">Volume</label>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={preferences.volume || 0.3}
                          onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                          className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Navigation Links */}
                <div className="space-y-3">
                  {!isHomePage && (
                    <Button
                      variant="secondary"
                      className="w-full justify-start"
                      onClick={() => {
                        router.push('/');
                        setIsMobileMenuOpen(false);
                      }}
                      icon={<Home size={18} />}
                    >
                      Back to Home
                    </Button>
                  )}

                  <Button
                    variant="secondary"
                    className="w-full justify-start"
                    onClick={() => {
                      setIsSettingsOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    icon={<Settings size={18} />}
                  >
                    Settings
                  </Button>
                </div>

                {/* Current Time */}
                <div className="text-center text-white/60 text-sm">
                  <Clock size={16} className="inline mr-2" />
                  {currentTime.toLocaleString('id-ID', {
                    weekday: 'long',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Modal */}
      <Modal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        title="Settings ⚙️"
        size="md"
      >
        <div className="space-y-6">
          {/* Audio Settings */}
          <div>
            <h3 className="text-white font-medium mb-4 flex items-center gap-2">
              <Music size={18} />
              Audio Settings
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-white/80">Background Music</span>
                <Button
                  variant={preferences.musicEnabled ? "success" : "secondary"}
                  size="sm"
                  onClick={() => {
                    updatePreference('musicEnabled', !preferences.musicEnabled);
                    if (!preferences.musicEnabled) {
                      backgroundMusic.play();
                    } else {
                      backgroundMusic.pause();
                    }
                  }}
                >
                  {preferences.musicEnabled ? 'ON' : 'OFF'}
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-white/80">Sound Effects</span>
                <Button
                  variant={preferences.soundEnabled ? "success" : "secondary"}
                  size="sm"
                  onClick={() => updatePreference('soundEnabled', !preferences.soundEnabled)}
                >
                  {preferences.soundEnabled ? 'ON' : 'OFF'}
                </Button>
              </div>

              <div>
                <label className="text-white/80 text-sm block mb-2">
                  Volume: {Math.round((preferences.volume || 0.3) * 100)}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={preferences.volume || 0.3}
                  onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                  className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
            </div>
          </div>

          {/* Visual Settings */}
          <div>
            <h3 className="text-white font-medium mb-4 flex items-center gap-2">
              <Star size={18} />
              Visual Settings
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-white/80">Animations</span>
                <Button
                  variant={preferences.animationsEnabled ? "success" : "secondary"}
                  size="sm"
                  onClick={() => updatePreference('animationsEnabled', !preferences.animationsEnabled)}
                >
                  {preferences.animationsEnabled ? 'ON' : 'OFF'}
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-white/80">Show Hints</span>
                <Button
                  variant={preferences.showHints ? "success" : "secondary"}
                  size="sm"
                  onClick={() => updatePreference('showHints', !preferences.showHints)}
                >
                  {preferences.showHints ? 'ON' : 'OFF'}
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Display */}
          <div>
            <h3 className="text-white font-medium mb-4 flex items-center gap-2">
              <Trophy size={18} />
              Your Progress
            </h3>
            <div className="bg-white/5 p-4 rounded-xl space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-white/70">Levels Completed</span>
                <span className="text-white">{stats.levelsCompleted}/17</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/70">Total Score</span>
                <span className="text-white">{stats.totalScore}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/70">Time Spent</span>
                <span className="text-white">{stats.timeSpent}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/70">Completion</span>
                <span className="text-white">{getCompletionPercentage()}%</span>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #F472B6;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        }

        .slider::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #F472B6;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        }
      `}</style>
    </>
  );
};

export default Header;