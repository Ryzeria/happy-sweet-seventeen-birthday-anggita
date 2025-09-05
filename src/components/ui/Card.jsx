import { motion } from 'framer-motion';
import { clsx } from 'clsx';

const Card = ({ 
  children, 
  variant = 'default', 
  hover = true, 
  className = '', 
  onClick,
  ...props 
}) => {
  const baseClasses = "rounded-2xl transition-all duration-300";
  
  const variants = {
    default: "bg-white/10 backdrop-blur-sm border border-white/20 shadow-love",
    glass: "bg-white/5 backdrop-blur-md border border-white/10",
    solid: "bg-white shadow-xl border border-gray-100",
    gradient: "bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm border border-white/20",
    love: "bg-gradient-to-br from-pink-400/20 to-purple-400/20 backdrop-blur-sm border border-pink-300/30 shadow-heart",
    gold: "bg-gradient-to-br from-yellow-400/20 to-gold/20 backdrop-blur-sm border border-yellow-300/30 shadow-gold"
  };

  const hoverEffects = hover ? "hover:shadow-heart hover:scale-105 hover:bg-white/15" : "";
  const clickable = onClick ? "cursor-pointer" : "";

  const classes = clsx(
    baseClasses,
    variants[variant],
    hoverEffects,
    clickable,
    className
  );

  const MotionCard = motion.div;

  return (
    <MotionCard
      className={classes}
      onClick={onClick}
      whileHover={hover ? { scale: 1.02 } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
      {...props}
    >
      {children}
    </MotionCard>
  );
};

// Sub-components
Card.Header = ({ children, className = '' }) => (
  <div className={clsx("p-6 pb-0", className)}>
    {children}
  </div>
);

Card.Body = ({ children, className = '' }) => (
  <div className={clsx("p-6", className)}>
    {children}
  </div>
);

Card.Footer = ({ children, className = '' }) => (
  <div className={clsx("p-6 pt-0", className)}>
    {children}
  </div>
);

export default Card;