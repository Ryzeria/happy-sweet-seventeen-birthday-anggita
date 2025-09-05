import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { forwardRef } from 'react';

const Button = forwardRef(({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  disabled = false, 
  loading = false, 
  icon, 
  onClick, 
  className = '',
  playSound = true,
  soundVolume = 0.3,
  ...props 
}, ref) => {
  const baseClasses = "inline-flex items-center justify-center gap-2 font-medium rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-soft-pink to-rose-gold text-white shadow-love hover:shadow-heart hover:scale-105 focus:ring-pink-300",
    secondary: "bg-white/20 backdrop-blur-sm text-white border border-white/30 hover:bg-white/30 hover:scale-105 focus:ring-white/50",
    outline: "border-2 border-white/50 text-white hover:bg-white/10 hover:scale-105 focus:ring-white/50",
    ghost: "text-white hover:bg-white/10 hover:scale-105 focus:ring-white/50",
    success: "bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-lg hover:shadow-xl hover:scale-105 focus:ring-green-300",
    warning: "bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg hover:shadow-xl hover:scale-105 focus:ring-yellow-300",
    danger: "bg-gradient-to-r from-red-400 to-pink-500 text-white shadow-lg hover:shadow-xl hover:scale-105 focus:ring-red-300",
    gold: "bg-gradient-to-r from-yellow-400 to-gold text-white shadow-gold hover:shadow-xl hover:scale-105 focus:ring-yellow-300"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
    xl: "px-8 py-4 text-xl"
  };

  const classes = clsx(
    baseClasses,
    variants[variant],
    sizes[size],
    className
  );

  const handleClick = (e) => {
    // Play click sound if enabled
    if (playSound && !disabled && !loading && typeof window !== 'undefined' && window.playClickSound) {
      window.playClickSound(soundVolume);
    }
    
    // Call original onClick handler
    if (onClick && !disabled && !loading) {
      onClick(e);
    }
  };

  return (
    <motion.button
      ref={ref}
      className={classes}
      onClick={handleClick}
      disabled={disabled || loading}
      whileHover={disabled || loading ? {} : { scale: 1.05 }}
      whileTap={disabled || loading ? {} : { scale: 0.95 }}
      {...props}
    >
      {loading && (
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
      )}
      {icon && !loading && <span className="text-lg">{icon}</span>}
      {children}
    </motion.button>
  );
});

Button.displayName = 'Button';

export default Button;