import { useEffect, useRef } from 'react';

const ParticleSystem = ({ particleCount = 60, color = '#FFB6C1', showConnections = true, showGlow = true }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;
    let mouseX = 0;
    let mouseY = 0;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Mouse interaction
    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Enhanced Particle class
    class EnhancedParticle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.baseSize = Math.random() * 4 + 2;
        this.size = this.baseSize;
        this.speedX = (Math.random() - 0.5) * 3;
        this.speedY = (Math.random() - 0.5) * 3;
        this.baseOpacity = Math.random() * 0.5 + 0.2;
        this.opacity = this.baseOpacity;
        this.pulse = Math.random() * 0.03 + 0.01;
        this.angle = Math.random() * Math.PI * 2;
        this.life = 1;
        this.decay = Math.random() * 0.008 + 0.002;
        this.color = this.getRandomColor();
        this.glowIntensity = Math.random() * 15 + 5;
        this.attractionRadius = 100;
        this.repulsionRadius = 50;
      }

      getRandomColor() {
        const colors = [
          '#FFB6C1', // soft-pink
          '#E8B4B8', // rose-gold
          '#E6E6FA', // lavender
          '#FF7F7F', // coral
          '#FFD700', // gold
          '#FFFFFF', // white
          '#FFCCCB', // light pink
          '#DDA0DD'  // plum
        ];
        return colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        // Mouse interaction
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < this.attractionRadius) {
          if (distance < this.repulsionRadius) {
            // Repulsion from mouse
            this.x -= dx * 0.01;
            this.y -= dy * 0.01;
          } else {
            // Attraction to mouse
            this.x += dx * 0.005;
            this.y += dy * 0.005;
          }
        }

        // Regular movement
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Pulsing animation
        this.angle += this.pulse;
        this.size = this.baseSize + Math.sin(this.angle) * 2;
        
        // Life cycle
        this.life -= this.decay;
        this.opacity = Math.max(0, this.life * this.baseOpacity);

        // Boundary wrapping with some padding
        const padding = 50;
        if (this.x > canvas.width + padding) this.x = -padding;
        if (this.x < -padding) this.x = canvas.width + padding;
        if (this.y > canvas.height + padding) this.y = -padding;
        if (this.y < -padding) this.y = canvas.height + padding;

        // Respawn when life ends
        if (this.life <= 0) {
          this.x = Math.random() * canvas.width;
          this.y = Math.random() * canvas.height;
          this.life = 1;
          this.color = this.getRandomColor();
          this.glowIntensity = Math.random() * 15 + 5;
        }
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        
        if (showGlow) {
          // Create multiple layers for glowing effect
          const gradient = ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, this.size * 4
          );
          gradient.addColorStop(0, this.color);
          gradient.addColorStop(0.3, this.color + '60');
          gradient.addColorStop(0.7, this.color + '20');
          gradient.addColorStop(1, 'transparent');
          
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
          ctx.fill();
        }
        
        // Main particle
        ctx.shadowBlur = showGlow ? this.glowIntensity : 0;
        ctx.shadowColor = this.color;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Inner highlight
        if (showGlow) {
          ctx.fillStyle = '#FFFFFF80';
          ctx.beginPath();
          ctx.arc(this.x - this.size * 0.3, this.y - this.size * 0.3, this.size * 0.3, 0, Math.PI * 2);
          ctx.fill();
        }
        
        ctx.restore();
      }
    }

    // Initialize particles
    const initParticles = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new EnhancedParticle());
      }
    };

    // Animation loop
    const animate = () => {
      // Clear with slight trail effect for smoother animation
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      // Draw connections between particles
      if (showConnections) {
        drawConnections();
      }
      
      // Draw mouse interaction area
      drawMouseEffect();
      
      animationId = requestAnimationFrame(animate);
    };

    // Enhanced connections with varying styles
    const drawConnections = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 150) {
            ctx.save();
            const opacity = (150 - distance) / 150 * 0.2;
            ctx.globalAlpha = opacity;
            
            // Create gradient line
            const gradient = ctx.createLinearGradient(
              particles[i].x, particles[i].y,
              particles[j].x, particles[j].y
            );
            gradient.addColorStop(0, particles[i].color);
            gradient.addColorStop(1, particles[j].color);
            
            ctx.strokeStyle = gradient;
            ctx.lineWidth = Math.max(1, (150 - distance) / 50);
            
            if (showGlow) {
              ctx.shadowBlur = 5;
              ctx.shadowColor = color;
            }
            
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
            ctx.restore();
          }
        }
      }
    };

    // Mouse interaction visual effect
    const drawMouseEffect = () => {
      if (mouseX === 0 && mouseY === 0) return;
      
      ctx.save();
      ctx.globalAlpha = 0.1;
      
      const gradient = ctx.createRadialGradient(
        mouseX, mouseY, 0,
        mouseX, mouseY, 100
      );
      gradient.addColorStop(0, '#FFD700');
      gradient.addColorStop(0.5, '#FFB6C140');
      gradient.addColorStop(1, 'transparent');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(mouseX, mouseY, 100, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    initParticles();
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [particleCount, color, showConnections, showGlow]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ 
        background: 'transparent',
        mixBlendMode: 'screen'
      }}
    />
  );
};

export default ParticleSystem;