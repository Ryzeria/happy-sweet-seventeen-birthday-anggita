// Framer Motion animation variants and utilities

export const fadeInUp = {
  hidden: { 
    opacity: 0, 
    y: 60 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

export const fadeInDown = {
  hidden: { 
    opacity: 0, 
    y: -60 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

export const fadeInLeft = {
  hidden: { 
    opacity: 0, 
    x: -60 
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

export const fadeInRight = {
  hidden: { 
    opacity: 0, 
    x: 60 
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

export const scaleIn = {
  hidden: { 
    opacity: 0, 
    scale: 0.8 
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

export const slideInUp = {
  hidden: { 
    y: "100%" 
  },
  visible: { 
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.6, -0.05, 0.01, 0.99]
    }
  }
};

export const slideInDown = {
  hidden: { 
    y: "-100%" 
  },
  visible: { 
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.6, -0.05, 0.01, 0.99]
    }
  }
};

// Stagger animations for lists
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

export const staggerItem = {
  hidden: { 
    opacity: 0, 
    y: 20 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

// Page transition animations
export const pageTransition = {
  hidden: { 
    opacity: 0, 
    x: -200, 
    scale: 0.8 
  },
  visible: { 
    opacity: 1, 
    x: 0, 
    scale: 1,
    transition: {
      duration: 0.8,
      ease: [0.6, -0.05, 0.01, 0.99]
    }
  },
  exit: { 
    opacity: 0, 
    x: 200, 
    scale: 0.8,
    transition: {
      duration: 0.5,
      ease: "easeInOut"
    }
  }
};

// Card flip animation
export const cardFlip = {
  initial: { rotateY: 0 },
  flipped: { 
    rotateY: 180,
    transition: {
      duration: 0.8,
      ease: "easeInOut"
    }
  }
};

// Floating animation
export const floating = {
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// Pulse animation
export const pulse = {
  animate: {
    scale: [1, 1.1, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// Shake animation
export const shake = {
  animate: {
    x: [-5, 5, -5, 5, 0],
    transition: {
      duration: 0.5,
      ease: "easeInOut"
    }
  }
};

// Bounce animation
export const bounce = {
  animate: {
    y: [-20, 0, -20],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// Rotate animation
export const rotate360 = {
  animate: {
    rotate: [0, 360],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "linear"
    }
  }
};

// Heart beat animation
export const heartBeat = {
  animate: {
    scale: [1, 1.2, 1],
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "easeInOut",
      times: [0, 0.3, 1]
    }
  }
};

// Modal animations
export const modalBackdrop = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: {
      duration: 0.3
    }
  },
  exit: { 
    opacity: 0,
    transition: {
      duration: 0.2
    }
  }
};

export const modalContent = {
  hidden: { 
    opacity: 0, 
    scale: 0.8, 
    y: 50 
  },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 300
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.8, 
    y: 50,
    transition: {
      duration: 0.2
    }
  }
};

// Button hover animations
export const buttonHover = {
  scale: 1.05,
  boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
  transition: {
    duration: 0.3,
    ease: "easeOut"
  }
};

export const buttonTap = {
  scale: 0.95,
  transition: {
    duration: 0.1
  }
};

// Custom easing functions
export const easings = {
  // Smooth ease out
  smooth: [0.6, -0.05, 0.01, 0.99],
  // Bouncy
  bouncy: [0.68, -0.55, 0.265, 1.55],
  // Sharp
  sharp: [0.4, 0, 0.2, 1],
  // Soft
  soft: [0.25, 0.46, 0.45, 0.94]
};

// Utility functions
export const createStagger = (children, delay = 0.1) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: delay,
      delayChildren: 0.3
    }
  }
});

export const createFadeInVariant = (direction = 'up', distance = 60) => {
  const directions = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: -distance },
    right: { x: distance }
  };

  return {
    hidden: { 
      opacity: 0, 
      ...directions[direction] 
    },
    visible: { 
      opacity: 1, 
      x: 0, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };
};

export const createSlideVariant = (direction = 'up') => {
  const directions = {
    up: { y: '100%' },
    down: { y: '-100%' },
    left: { x: '-100%' },
    right: { x: '100%' }
  };

  return {
    hidden: directions[direction],
    visible: { 
      x: 0, 
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.6, -0.05, 0.01, 0.99]
      }
    }
  };
};

// Level-specific animations
export const levelTransitions = {
  // Timeline level
  timelineSlide: {
    enter: { 
      opacity: 0, 
      x: 100 
    },
    center: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0, 
      x: -100,
      transition: {
        duration: 0.3
      }
    }
  },

  // Memory cards flip
  cardReveal: {
    hidden: { 
      rotateY: 0 
    },
    visible: { 
      rotateY: 180,
      transition: {
        duration: 0.6,
        ease: "easeInOut"
      }
    }
  },

  // Puzzle pieces
  puzzlePiece: {
    hidden: { 
      opacity: 0, 
      scale: 0.5, 
      rotate: -180 
    },
    visible: { 
      opacity: 1, 
      scale: 1, 
      rotate: 0,
      transition: {
        duration: 0.8,
        ease: "backOut"
      }
    }
  },

  // Quiz options
  quizOption: {
    hidden: { 
      opacity: 0, 
      x: -50 
    },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    },
    selected: {
      scale: 1.05,
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      transition: {
        duration: 0.2
      }
    }
  },

  // Folder opening animation
  folderOpen: {
    closed: { 
      scale: 1, 
      rotateY: 0 
    },
    opening: { 
      scale: 1.1, 
      rotateY: -15,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    open: { 
      scale: 1, 
      rotateY: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  }
};

// Celebration animations
export const celebrationAnimations = {
  confettiPop: {
    hidden: { 
      scale: 0, 
      opacity: 0 
    },
    visible: { 
      scale: [0, 1.2, 1], 
      opacity: [0, 1, 1],
      transition: {
        duration: 0.6,
        times: [0, 0.6, 1],
        ease: "easeOut"
      }
    }
  },

  starBurst: {
    hidden: { 
      scale: 0, 
      rotate: -180 
    },
    visible: { 
      scale: [0, 1.5, 1], 
      rotate: [0, 180, 360],
      transition: {
        duration: 0.8,
        ease: "backOut"
      }
    }
  },

  heartFloat: {
    hidden: { 
      y: 0, 
      opacity: 1, 
      scale: 0 
    },
    visible: { 
      y: -100, 
      opacity: 0, 
      scale: [0, 1, 0],
      transition: {
        duration: 2,
        ease: "easeOut"
      }
    }
  }
};

// Loading animations
export const loadingAnimations = {
  spinner: {
    animate: {
      rotate: 360,
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "linear"
      }
    }
  },

  dots: {
    animate: {
      scale: [1, 1.2, 1],
      transition: {
        duration: 0.6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  },

  heartLoading: {
    animate: {
      scale: [1, 1.3, 1],
      rotate: [0, 10, -10, 0],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }
};

// Interaction animations
export const interactionAnimations = {
  hoverGrow: {
    scale: 1.05,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  },

  hoverShadow: {
    boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
    y: -5,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  },

  tapShrink: {
    scale: 0.95,
    transition: {
      duration: 0.1
    }
  },

  wiggle: {
    rotate: [-5, 5, -5, 5, 0],
    transition: {
      duration: 0.5,
      ease: "easeInOut"
    }
  }
};

// Text animations
export const textAnimations = {
  typewriter: {
    hidden: { 
      width: 0 
    },
    visible: { 
      width: "100%",
      transition: {
        duration: 2,
        ease: "linear"
      }
    }
  },

  fadeInWords: (delay = 0) => ({
    hidden: { 
      opacity: 0, 
      y: 20 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        delay,
        ease: "easeOut"
      }
    }
  }),

  glowPulse: {
    animate: {
      textShadow: [
        "0 0 5px rgba(255, 255, 255, 0.5)",
        "0 0 20px rgba(255, 255, 255, 0.8)",
        "0 0 5px rgba(255, 255, 255, 0.5)"
      ],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }
};

// Game-specific animations
export const gameAnimations = {
  // Memory game card match
  cardMatch: {
    matched: {
      scale: [1, 1.1, 1],
      backgroundColor: "rgba(34, 197, 94, 0.3)",
      borderColor: "rgb(34, 197, 94)",
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  },

  // Puzzle piece snap
  puzzleSnap: {
    snapped: {
      scale: [1, 1.2, 1],
      boxShadow: "0 0 20px rgba(34, 197, 94, 0.6)",
      transition: {
        duration: 0.4,
        ease: "backOut"
      }
    }
  },

  // Treasure found
  treasureFound: {
    found: {
      scale: [1, 1.3, 1],
      rotate: [0, 10, -10, 0],
      filter: "brightness(1.3) saturate(1.5)",
      transition: {
        duration: 0.8,
        ease: "backOut"
      }
    }
  }
};

// Utility function to create custom spring animations
export const createSpringAnimation = (config = {}) => {
  const defaultConfig = {
    type: "spring",
    damping: 25,
    stiffness: 300,
    ...config
  };

  return {
    transition: defaultConfig
  };
};

// Utility function to create custom timing animations
export const createTimingAnimation = (duration = 0.5, easing = "easeOut") => ({
  transition: {
    duration,
    ease: easing
  }
});

// Export all animations as a collection
export const animations = {
  fadeInUp,
  fadeInDown,
  fadeInLeft,
  fadeInRight,
  scaleIn,
  slideInUp,
  slideInDown,
  staggerContainer,
  staggerItem,
  pageTransition,
  cardFlip,
  floating,
  pulse,
  shake,
  bounce,
  rotate360,
  heartBeat,
  modalBackdrop,
  modalContent,
  buttonHover,
  buttonTap,
  levelTransitions,
  celebrationAnimations,
  loadingAnimations,
  interactionAnimations,
  textAnimations,
  gameAnimations
};

export default animations;