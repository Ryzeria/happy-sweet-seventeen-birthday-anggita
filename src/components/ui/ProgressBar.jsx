import { motion } from 'framer-motion';
import { clsx } from 'clsx';

const ProgressBar = ({ 
  value = 0, 
  max = 100, 
  variant = 'default',
  size = 'md',
  showLabel = true,
  label,
  animated = true,
  className = ''
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const variants = {
    default: {
      bg: 'bg-white/20',
      fill: 'bg-gradient-to-r from-pink-400 to-rose-400'
    },
    success: {
      bg: 'bg-white/20',
      fill: 'bg-gradient-to-r from-green-400 to-emerald-500'
    },
    warning: {
      bg: 'bg-white/20',
      fill: 'bg-gradient-to-r from-yellow-400 to-orange-500'
    },
    danger: {
      bg: 'bg-white/20',
      fill: 'bg-gradient-to-r from-red-400 to-pink-500'
    },
    gold: {
      bg: 'bg-white/20',
      fill: 'bg-gradient-to-r from-yellow-400 to-gold'
    },
    rainbow: {
      bg: 'bg-white/20',
      fill: 'bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400'
    }
  };

  const sizes = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
    xl: 'h-6'
  };

  return (
    <div className={clsx("w-full", className)}>
      {/* Label */}
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-white/80 text-sm font-medium">
            {label || `Progress`}
          </span>
          <span className="text-white/70 text-sm">
            {Math.round(percentage)}%
          </span>
        </div>
      )}

      {/* Progress Bar */}
      <div className={clsx(
        "relative rounded-full overflow-hidden",
        variants[variant].bg,
        sizes[size]
      )}>
        <motion.div
          className={clsx(
            "absolute top-0 left-0 h-full rounded-full",
            variants[variant].fill
          )}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={animated ? { 
            duration: 1, 
            ease: "easeOut",
            type: "spring",
            stiffness: 100 
          } : { duration: 0 }}
        />

        {/* Shimmer Effect */}
        {animated && percentage > 0 && (
          <motion.div
            className="absolute top-0 left-0 h-full w-full"
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <div className="h-full w-1/3 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          </motion.div>
        )}
      </div>

      {/* Value Display */}
      {showLabel && (
        <div className="flex justify-between items-center mt-1">
          <span className="text-white/60 text-xs">
            {value} / {max}
          </span>
        </div>
      )}
    </div>
  );
};

// Circular Progress Bar
export const CircularProgress = ({ 
  value = 0, 
  max = 100, 
  size = 120,
  strokeWidth = 8,
  variant = 'default',
  showLabel = true,
  className = ''
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const colors = {
    default: '#F472B6', // pink-400
    success: '#10B981', // emerald-500
    warning: '#F59E0B', // amber-500
    danger: '#EF4444',  // red-500
    gold: '#FFD700'     // gold
  };

  return (
    <div className={clsx("relative inline-flex items-center justify-center", className)}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255, 255, 255, 0.2)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        
        {/* Progress Circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors[variant]}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>

      {/* Center Label */}
      {showLabel && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white font-bold text-lg">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;