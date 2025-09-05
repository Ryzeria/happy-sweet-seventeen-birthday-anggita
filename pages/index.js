import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Gift, Star, Music, Play } from 'lucide-react';
import FloatingHearts from '../src/components/animations/FloatingHearts';
import ParticleSystem from '../src/components/animations/ParticleSystem';
import { getBirthdayMessage, getTimeBasedMessage } from '../src/data/messages';

export default function Home() {
  const [isGiftOpened, setIsGiftOpened] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    // Set personalized birthday message
    setCurrentMessage(getBirthdayMessage());

    // Countdown to Anggita's birthday - 6 September 2008
    const birthdayDate = new Date('2025-09-06'); // Anggita's 17th birthday
    
    const updateCountdown = () => {
      const now = new Date();
      const difference = birthdayDate.getTime() - now.getTime();
      
      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))-7);
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        setCountdown({ days, hours, minutes, seconds });
      } else {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleGiftClick = () => {
    setIsGiftOpened(true);
    setTimeout(() => {
      setShowWelcome(false);
    }, 2000);
  };

  const toggleMusic = () => {
    setIsPlaying(!isPlaying);
    // Background music bisa ditambahkan nanti
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 1,
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const giftVariants = {
    initial: { scale: 1, rotateY: 0 },
    hover: { scale: 1.1, rotateY: 10 },
    clicked: { 
      scale: 1.3, 
      rotateY: 180,
      transition: { duration: 1.5 }
    }
  };

  if (!showWelcome) {
    return (
      <div className="min-h-screen bg-gradient-love relative overflow-hidden flex items-center justify-center">
        <ParticleSystem />
        <FloatingHearts />
        
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="text-center z-10"
        >
          <motion.div
            initial={{ y: -50 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="mb-8"
          >
            <h1 className="text-6xl md:text-8xl font-dancing text-white text-glow mb-4">
              Welcome to
            </h1>
            <h2 className="text-4xl md:text-6xl font-dancing text-white text-glow">
              Your Birthday Adventure! 🎂
            </h2>
            <p className="text-2xl text-white/90 mt-4">
              For Anggita Azaria Ramadhani ✨
            </p>
          </motion.div>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20 mb-8 max-w-2xl mx-auto"
          >
            <p className="text-xl text-white mb-6 leading-relaxed">
              {currentMessage}
            </p>
            <p className="text-lg text-white/90">
              Bersiaplah untuk petualangan cinta dengan 17 level penuh kejutan spesial dari Mas Za! ✨
            </p>
          </motion.div>

          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.8 }}
          >
            <motion.a
              href="/level/1"
              className="btn-love inline-flex items-center gap-3 text-xl px-8 py-4"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Play size={24} />
              Mulai Journey Cinta Kita
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-love relative overflow-hidden">
      <ParticleSystem />
      <FloatingHearts />
      
      {/* Background Music Toggle */}
      <motion.button
        onClick={toggleMusic}
        className="fixed top-6 right-6 z-50 bg-white/20 backdrop-blur-sm p-3 rounded-full border border-white/30 text-white"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Music size={24} className={isPlaying ? 'animate-pulse' : ''} />
      </motion.button>

      <div className="container mx-auto px-4 flex items-center justify-center min-h-screen">
        <AnimatePresence mode="wait">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center z-10"
          >
            {/* Personalized Greeting */}
            <motion.div variants={itemVariants} className="mb-8">
              <h1 className="text-5xl md:text-7xl font-dancing text-white text-glow mb-4">
                Happy 17th Birthday! 🎉
              </h1>
              <p className="text-xl md:text-2xl text-white/90 mb-2">
                For the most amazing bocah Tambran
              </p>
              <p className="text-lg md:text-xl text-white/80 mb-2">
                Anggita Azaria Ramadhani
              </p>
              <div className="flex items-center justify-center gap-2 text-white">
                <Heart className="text-pink-300 animate-pulse" size={20} />
                <span className="text-lg font-medium">September 6th, 2025</span>
                <Heart className="text-pink-300 animate-pulse" size={20} />
              </div>
            </motion.div>

            {/* Countdown Timer - only show if birthday hasn't passed */}
            {(countdown.days > 0 || countdown.hours > 0 || countdown.minutes > 0 || countdown.seconds > 0) && (
              <motion.div 
                variants={itemVariants}
                className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 mb-8 max-w-md mx-auto"
              >
                <h3 className="text-white text-lg mb-4">Countdown to Your Special Day:</h3>
                <div className="grid grid-cols-4 gap-4 text-center">
                  <div className="text-white">
                    <div className="text-2xl font-bold">{countdown.days}</div>
                    <div className="text-sm opacity-80">Days</div>
                  </div>
                  <div className="text-white">
                    <div className="text-2xl font-bold">{countdown.hours}</div>
                    <div className="text-sm opacity-80">Hours</div>
                  </div>
                  <div className="text-white">
                    <div className="text-2xl font-bold">{countdown.minutes}</div>
                    <div className="text-sm opacity-80">Minutes</div>
                  </div>
                  <div className="text-white">
                    <div className="text-2xl font-bold">{countdown.seconds}</div>
                    <div className="text-sm opacity-80">Seconds</div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Interactive Gift */}
            <motion.div variants={itemVariants} className="mb-8">
              <motion.div
                variants={giftVariants}
                initial="initial"
                animate={isGiftOpened ? "clicked" : "initial"}
                whileHover={!isGiftOpened ? "hover" : {}}
                onClick={handleGiftClick}
                className="cursor-pointer inline-block"
              >
                <div className="relative">
                  <Gift 
                    size={120} 
                    className="text-gold drop-shadow-lg mx-auto mb-4" 
                  />
                  {!isGiftOpened && (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute -top-2 -right-2 bg-pink-500 text-white rounded-full p-2"
                    >
                      <Star size={16} />
                    </motion.div>
                  )}
                </div>
              </motion.div>
              
              {!isGiftOpened ? (
                <motion.div variants={itemVariants}>
                  <p className="text-xl text-white mb-4">
                    Click the gift to unwrap your surprise! 🎁
                  </p>
                  <p className="text-white/80 text-lg">
                    A special journey made just for you...
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 max-w-lg mx-auto"
                >
                  <h3 className="text-2xl font-dancing text-white mb-4">
                    Surprise! 🎉
                  </h3>
                  <p className="text-white text-lg leading-relaxed">
                    Aku udah bikin sesuatu yang spesial buat kamu - sebuah journey melalui 17 level 
                    penuh cinta, kenangan, dan surprise untuk celebrate ulang tahun ke-17 yang amazing ini!
                  </p>
                  <p className="text-white/80 text-sm mt-4">
                    From your Mas Za with love 💕
                  </p>
                </motion.div>
              )}
            </motion.div>

            {/* Floating Elements with Personalized Touch */}
            <div className="absolute top-20 left-10 animate-float">
              <div className="text-2xl">🧬</div> {/* Biology reference */}
            </div>
            <div className="absolute top-32 right-16 animate-float" style={{ animationDelay: '1s' }}>
              <div className="text-xl">📚</div> {/* Novel reference */}
            </div>
            <div className="absolute bottom-32 left-20 animate-float" style={{ animationDelay: '2s' }}>
              <div className="text-2xl">🌙</div> {/* Musang bulan reference */}
            </div>
            <div className="absolute bottom-20 right-12 animate-float" style={{ animationDelay: '0.5s' }}>
              <div className="text-3xl">🥑</div> {/* Nasi alpukat reference */}
            </div>
            <div className="absolute top-1/3 left-1/3 animate-float" style={{ animationDelay: '1.5s' }}>
              <div className="text-xl">🦷</div> {/* Dokter gigi dream */}
            </div>
            <div className="absolute bottom-1/3 right-1/3 animate-float" style={{ animationDelay: '2.5s' }}>
              <div className="text-xl">📰</div> {/* Mahardika reference */}
            </div>

            {/* Sparkle Elements */}
            <motion.div
              className="absolute top-1/4 left-1/4"
              animate={{ 
                scale: [1, 1.5, 1],
                rotate: [0, 180, 360],
                opacity: [0.3, 1, 0.3]
              }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              ✨
            </motion.div>
            <motion.div
              className="absolute top-1/3 right-1/4"
              animate={{ 
                scale: [1.2, 0.8, 1.2],
                rotate: [360, 180, 0],
                opacity: [1, 0.3, 1]
              }}
              transition={{ duration: 3, repeat: Infinity, delay: 1 }}
            >
              ⭐
            </motion.div>
            
            {/* Special Message for Anggita */}
            <motion.div
              variants={itemVariants}
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            >
              <p className="text-white/60 text-sm">
                Made with 💕 by Mas Za for his bocah Tambran favorit
              </p>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}