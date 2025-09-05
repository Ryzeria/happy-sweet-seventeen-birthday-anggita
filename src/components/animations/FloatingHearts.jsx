import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FloatingHearts = ({ count = 8, duration = 8, showGifts = true, showSparkles = true, intensity = 'medium' }) => {
  const [hearts, setHearts] = useState([]);
  const [gifts, setGifts] = useState([]);
  const [sparkles, setSparkles] = useState([]);
  const [balloons, setBalloons] = useState([]);
  const canvasRef = useRef(null);

  const heartEmojis = ['💕', '💖', '💗', '💘', '💝', '💞', '💟', '❤️', '🩷', '💌', '😍', '🥰'];
  const giftEmojis = ['🎁', '🎂', '🎈', '🎀', '💐', '🧁', '🍰', '🎊', '🎉', '🌟', '✨', '💝'];
  const sparkleEmojis = ['✨', '⭐', '🌟', '💫', '🎇', '🎆', '🌠', '💎'];
  const balloonEmojis = ['🎈', '🎁', '🧸', '🍭', '🦄', '🌈', '🎪', '🎠'];

  // Intensity settings
  const intensityConfig = {
    low: { heartCount: 6, giftCount: 8, sparkleCount: 15, balloonCount: 6, frequency: 3500 },
    medium: { heartCount: 8, giftCount: 12, sparkleCount: 20, balloonCount: 8, frequency: 2500 },
    high: { heartCount: 12, giftCount: 16, sparkleCount: 30, balloonCount: 12, frequency: 1800 }
  };

  const config = intensityConfig[intensity] || intensityConfig.medium;

  // Enhanced Particle System
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = (Math.random() - 0.5) * 2;
        this.speedY = (Math.random() - 0.5) * 2;
        this.opacity = Math.random() * 0.4 + 0.1;
        this.pulse = Math.random() * 0.02 + 0.01;
        this.angle = Math.random() * Math.PI * 2;
        this.life = 1;
        this.decay = Math.random() * 0.005 + 0.001;
        this.color = this.getRandomColor();
      }

      getRandomColor() {
        const colors = ['#FFB6C1', '#E8B4B8', '#E6E6FA', '#FF7F7F', '#FFD700'];
        return colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.angle += this.pulse;
        this.size = Math.abs(Math.sin(this.angle) * 3) + 1;
        
        this.life -= this.decay;
        this.opacity = this.life * 0.3;

        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;

        if (this.life <= 0) {
          this.x = Math.random() * canvas.width;
          this.y = Math.random() * canvas.height;
          this.life = 1;
        }
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        
        const gradient = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.size * 2
        );
        gradient.addColorStop(0, this.color);
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < 50; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            ctx.save();
            ctx.globalAlpha = (100 - distance) / 100 * 0.1;
            ctx.strokeStyle = '#FFB6C1';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
            ctx.restore();
          }
        }
      }
      
      animationId = requestAnimationFrame(animate);
    };

    initParticles();
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  // Hearts Effect
  useEffect(() => {
    const generateHeart = () => {
      const id = Date.now() + Math.random();
      const leftPosition = Math.random() * 100;
      const emoji = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
      const size = Math.random() * 20 + 15;
      const animationDuration = Math.random() * 3 + duration;
      
      return {
        id,
        emoji,
        left: leftPosition,
        size,
        duration: animationDuration,
        swing: Math.random() * 20 + 10
      };
    };

    const createHeart = () => {
      setHearts(prevHearts => [...prevHearts, generateHeart()]);
    };

    for (let i = 0; i < config.heartCount; i++) {
      setTimeout(() => createHeart(), i * 1000);
    }

    const interval = setInterval(createHeart, config.frequency);
    return () => clearInterval(interval);
  }, [config.heartCount, config.frequency, duration]);

  // Gifts Effect
  useEffect(() => {
    if (!showGifts) return;

    const initialGifts = Array.from({ length: config.giftCount }, (_, i) => ({
      id: i,
      emoji: giftEmojis[i % giftEmojis.length],
      x: Math.random() * 100,
      y: Math.random() * 100,
      scale: 0.6 + Math.random() * 0.8,
      rotation: Math.random() * 360,
      duration: 20 + Math.random() * 15,
      delay: Math.random() * 5
    }));
    setGifts(initialGifts);
  }, [showGifts, config.giftCount]);

  // Sparkles Effect
  useEffect(() => {
    if (!showSparkles) return;

    const initialSparkles = Array.from({ length: config.sparkleCount }, (_, i) => ({
      id: i,
      emoji: sparkleEmojis[Math.floor(Math.random() * sparkleEmojis.length)],
      x: Math.random() * 100,
      y: Math.random() * 100,
      scale: Math.random() * 0.5 + 0.5,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 2
    }));
    setSparkles(initialSparkles);
  }, [showSparkles, config.sparkleCount]);

  // Balloons Effect
  useEffect(() => {
    const initialBalloons = Array.from({ length: config.balloonCount }, (_, i) => ({
      id: i,
      emoji: balloonEmojis[i % balloonEmojis.length],
      x: Math.random() * 90 + 5,
      y: Math.random() * 80 + 10,
      floatHeight: Math.random() * 20 + 10,
      duration: Math.random() * 4 + 6,
      delay: Math.random() * 3
    }));
    setBalloons(initialBalloons);
  }, [config.balloonCount]);

  const removeHeart = (id) => {
    setHearts(prevHearts => prevHearts.filter(heart => heart.id !== id));
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Enhanced Particle Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ 
          background: 'transparent',
          mixBlendMode: 'multiply'
        }}
      />

      {/* Floating Hearts */}
      <AnimatePresence>
        {hearts.map((heart) => (
          <motion.div
            key={heart.id}
            initial={{
              y: '100vh',
              x: `${heart.left}vw`,
              scale: 0,
              opacity: 1,
              rotate: 0
            }}
            animate={{
              y: '-10vh',
              x: [`${heart.left}vw`, `${heart.left + heart.swing}vw`, `${heart.left - heart.swing}vw`, `${heart.left}vw`],
              scale: [0, 1, 1, 0],
              opacity: [1, 0.8, 0.8, 0],
              rotate: 360
            }}
            exit={{
              opacity: 0,
              scale: 0
            }}
            transition={{
              duration: heart.duration,
              ease: "linear",
              x: {
                duration: heart.duration / 2,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }
            }}
            onAnimationComplete={() => removeHeart(heart.id)}
            className="absolute"
            style={{
              fontSize: `${heart.size}px`,
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
            }}
          >
            {heart.emoji}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Floating Gifts */}
      {showGifts && gifts.map((gift) => (
        <motion.div
          key={gift.id}
          className="absolute text-4xl opacity-30"
          initial={{
            x: `${gift.x}vw`,
            y: `${gift.y}vh`,
            scale: 0,
            rotate: gift.rotation,
            opacity: 0
          }}
          animate={{
            x: [`${gift.x}vw`, `${(gift.x + 10) % 100}vw`, `${(gift.x + 20) % 100}vw`],
            y: [`${gift.y}vh`, `${(gift.y + 15) % 100}vh`, `${(gift.y + 30) % 100}vh`],
            scale: [0, gift.scale, gift.scale, 0],
            rotate: [gift.rotation, gift.rotation + 360, gift.rotation + 720],
            opacity: [0, 0.3, 0.3, 0]
          }}
          transition={{
            duration: gift.duration,
            delay: gift.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))'
          }}
        >
          {gift.emoji}
        </motion.div>
      ))}

      {/* Birthday Sparkles */}
      {showSparkles && sparkles.map((sparkle) => (
        <motion.div
          key={sparkle.id}
          className="absolute text-2xl opacity-40"
          style={{
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`
          }}
          animate={{
            scale: [0, sparkle.scale, 0],
            rotate: [0, 360],
            opacity: [0, 0.6, 0]
          }}
          transition={{
            duration: sparkle.duration,
            delay: sparkle.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {sparkle.emoji}
        </motion.div>
      ))}

      {/* Floating Balloons */}
      {balloons.map((balloon) => (
        <motion.div
          key={balloon.id}
          className="absolute text-3xl opacity-35"
          style={{
            left: `${balloon.x}%`,
            top: `${balloon.y}%`
          }}
          animate={{
            y: [-balloon.floatHeight, balloon.floatHeight],
            x: [-5, 5],
            rotate: [-10, 10]
          }}
          transition={{
            duration: balloon.duration,
            delay: balloon.delay,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        >
          {balloon.emoji}
        </motion.div>
      ))}
    </div>
  );
};

export default FloatingHearts;