import { motion } from 'framer-motion';
import { Heart, Star, Gift } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <motion.footer
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative mt-20 py-12 bg-gradient-to-t from-black/20 to-transparent"
    >
      <div className="container mx-auto px-4 text-center">
        {/* Decorative Hearts */}
        <div className="flex justify-center items-center gap-4 mb-8">
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 5, -5, 0] 
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity,
              ease: "easeInOut" 
            }}
          >
            <Heart className="text-pink-300" size={24} />
          </motion.div>
          
          <motion.div
            animate={{ 
              opacity: [0.5, 1, 0.5] 
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              ease: "easeInOut" 
            }}
          >
            <Star className="text-gold" size={20} />
          </motion.div>
          
          <motion.div
            animate={{ 
              y: [-5, 5, -5] 
            }}
            transition={{ 
              duration: 2.5, 
              repeat: Infinity,
              ease: "easeInOut" 
            }}
          >
            <Gift className="text-purple-300" size={22} />
          </motion.div>
        </div>

        {/* Main Footer Content */}
        <div className="max-w-2xl mx-auto">
          <motion.h3 
            className="text-2xl font-dancing text-white mb-4"
            animate={{ 
              textShadow: [
                "0 0 10px rgba(255,255,255,0.5)",
                "0 0 20px rgba(255,255,255,0.8)", 
                "0 0 10px rgba(255,255,255,0.5)"
              ]
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity,
              ease: "easeInOut" 
            }}
          >
            Made with Love 💕
          </motion.h3>
          
          <p className="text-white/80 text-lg leading-relaxed mb-6">
            Setiap kode yang ditulis, setiap animasi yang dibuat, setiap kata yang dipilih - 
            semua dilakukan dengan penuh cinta untuk merayakan hari istimewamu yang ke-17.
          </p>

          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20 mb-8">
            <p className="text-white/90 italic">
              "The best love is the kind that awakens the soul and makes us reach for more, 
              that plants a fire in our hearts and brings peace to our minds."
            </p>
            <p className="text-white/60 text-sm mt-2">- Nicholas Sparks</p>
          </div>

          {/* Special Birthday Message */}
          <motion.div 
            className="bg-gradient-to-r from-pink-400/20 to-purple-400/20 backdrop-blur-sm p-6 rounded-2xl border border-pink-300/30 mb-8"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <h4 className="text-xl font-dancing text-white mb-3">
              Happy 17th Birthday! 🎂
            </h4>
            <p className="text-white/90">
              Semoga di usia 17 ini, semua impianmu mulai terwujud, 
              semua langkahmu diberkahi, dan kebahagiaan selalu menyertaimu. 
              Kamu deserve all the love and happiness in the world! ✨
            </p>
          </motion.div>
        </div>

        {/* Footer Links & Info */}
        <div className="border-t border-white/20 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-white/60 text-sm">
              © {currentYear} Birthday Surprise Website. Built with Next.js, Tailwind & lots of ❤️
            </div>
            
            <div className="flex items-center gap-6 text-white/60 text-sm">
              <span>🎯 17 Interactive Levels</span>
              <span>🎮 Mini Games</span>
              <span>💝 100+ Surprises</span>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-white/50 text-xs">
              Made especially for the most amazing 17-year-old in the world 🌟
            </p>
          </div>
        </div>

        {/* Floating Animation Elements */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
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
                y: "-20%",
                opacity: [0.7, 1, 0.7, 0]
              }}
              transition={{
                duration: 8 + Math.random() * 4,
                delay: Math.random() * 5,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              {['💖', '✨', '🌟', '💕', '🎈'][i]}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;