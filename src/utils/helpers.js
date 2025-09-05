// General utility helper functions

// Date and time utilities
export const dateUtils = {
  // Format date to readable string
  formatDate: (date, options = {}) => {
    const defaultOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      ...options
    };
    
    return new Date(date).toLocaleDateString('id-ID', defaultOptions);
  },

  // Get time ago string
  timeAgo: (date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now - new Date(date)) / 1000);
    
    const intervals = [
      { label: 'tahun', seconds: 31536000 },
      { label: 'bulan', seconds: 2592000 },
      { label: 'minggu', seconds: 604800 },
      { label: 'hari', seconds: 86400 },
      { label: 'jam', seconds: 3600 },
      { label: 'menit', seconds: 60 },
      { label: 'detik', seconds: 1 }
    ];

    for (const interval of intervals) {
      const count = Math.floor(diffInSeconds / interval.seconds);
      if (count >= 1) {
        return `${count} ${interval.label} yang lalu`;
      }
    }
    
    return 'Baru saja';
  },

  // Check if date is today
  isToday: (date) => {
    const today = new Date();
    const checkDate = new Date(date);
    return checkDate.toDateString() === today.toDateString();
  },

  // Check if date is birthday
  isBirthday: (date, birthday) => {
    const checkDate = new Date(date);
    const birthdayDate = new Date(birthday);
    
    return (
      checkDate.getDate() === birthdayDate.getDate() &&
      checkDate.getMonth() === birthdayDate.getMonth()
    );
  },

  // Calculate age
  calculateAge: (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  },

  // Days until birthday
  daysUntilBirthday: (birthday) => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const birthdayThisYear = new Date(currentYear, new Date(birthday).getMonth(), new Date(birthday).getDate());
    
    if (birthdayThisYear < today) {
      birthdayThisYear.setFullYear(currentYear + 1);
    }
    
    const diffTime = birthdayThisYear - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
};

// String utilities
export const stringUtils = {
  // Capitalize first letter
  capitalize: (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  },

  // Convert to title case
  titleCase: (str) => {
    return str.replace(/\w\S*/g, (txt) => {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  },

  // Truncate string with ellipsis
  truncate: (str, length = 50) => {
    return str.length > length ? str.slice(0, length) + '...' : str;
  },

  // Remove special characters
  sanitize: (str) => {
    return str.replace(/[^a-zA-Z0-9\s]/g, '');
  },

  // Generate slug from string
  slugify: (str) => {
    return str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  },

  // Count words in string
  wordCount: (str) => {
    return str.trim().split(/\s+/).length;
  },

  // Extract initials
  getInitials: (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('');
  }
};

// Number utilities
export const numberUtils = {
  // Format number with commas
  formatNumber: (num) => {
    return new Intl.NumberFormat('id-ID').format(num);
  },

  // Convert to currency
  toCurrency: (amount, currency = 'IDR') => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: currency
    }).format(amount);
  },

  // Generate random number in range
  randomBetween: (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  // Convert to percentage
  toPercentage: (value, total, decimals = 1) => {
    return ((value / total) * 100).toFixed(decimals) + '%';
  },

  // Clamp number between min and max
  clamp: (num, min, max) => {
    return Math.min(Math.max(num, min), max);
  },

  // Round to specific decimal places
  roundTo: (num, decimals = 2) => {
    return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
  }
};

// Array utilities
export const arrayUtils = {
  // Shuffle array
  shuffle: (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  },

  // Get random item from array
  randomItem: (array) => {
    return array[Math.floor(Math.random() * array.length)];
  },

  // Remove duplicates
  unique: (array) => {
    return [...new Set(array)];
  },

  // Group by property
  groupBy: (array, key) => {
    return array.reduce((groups, item) => {
      const group = item[key];
      groups[group] = groups[group] || [];
      groups[group].push(item);
      return groups;
    }, {});
  },

  // Sort by property
  sortBy: (array, key, direction = 'asc') => {
    return [...array].sort((a, b) => {
      const aVal = a[key];
      const bVal = b[key];
      
      if (direction === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
  },

  // Chunk array into smaller arrays
  chunk: (array, size) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }
};

// Color utilities
export const colorUtils = {
  // Generate random color
  randomColor: () => {
    const colors = [
      '#FFB6C1', '#E8B4B8', '#E6E6FA', '#FF7F7F', '#FFD700',
      '#FF69B4', '#DDA0DD', '#F0E68C', '#87CEEB', '#98FB98'
    ];
    return arrayUtils.randomItem(colors);
  },

  // Convert hex to rgba
  hexToRgba: (hex, alpha = 1) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return null;
    
    const r = parseInt(result[1], 16);
    const g = parseInt(result[2], 16);
    const b = parseInt(result[3], 16);
    
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  },

  // Get contrasting text color
  getContrastColor: (hexColor) => {
    const rgb = parseInt(hexColor.slice(1), 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >>  8) & 0xff;
    const b = (rgb >>  0) & 0xff;
    
    const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    
    return luma < 40 ? '#ffffff' : '#000000';
  }
};

// Local storage utilities
export const storageUtils = {
  // Set item with expiry
  setWithExpiry: (key, value, ttl) => {
    const now = new Date();
    const item = {
      value: value,
      expiry: now.getTime() + ttl
    };
    localStorage.setItem(key, JSON.stringify(item));
  },

  // Get item with expiry check
  getWithExpiry: (key) => {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) return null;
    
    const item = JSON.parse(itemStr);
    const now = new Date();
    
    if (now.getTime() > item.expiry) {
      localStorage.removeItem(key);
      return null;
    }
    
    return item.value;
  },

  // Safe JSON parse
  safeJSONParse: (str, fallback = null) => {
    try {
      return JSON.parse(str);
    } catch (e) {
      return fallback;
    }
  }
};

// URL utilities
export const urlUtils = {
  // Get query parameters
  getQueryParams: () => {
    const params = new URLSearchParams(window.location.search);
    const result = {};
    for (let [key, value] of params) {
      result[key] = value;
    }
    return result;
  },

  // Build URL with parameters
  buildUrl: (base, params = {}) => {
    const url = new URL(base);
    Object.keys(params).forEach(key => {
      url.searchParams.append(key, params[key]);
    });
    return url.toString();
  }
};

// Device utilities
export const deviceUtils = {
  // Check if mobile device
  isMobile: () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  },

  // Check if touch device
  isTouchDevice: () => {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  },

  // Get viewport dimensions
  getViewport: () => ({
    width: Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0),
    height: Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
  }),

  // Check if device supports audio
  supportsAudio: () => {
    return !!(document.createElement('audio').canPlayType);
  }
};

// Performance utilities
export const performanceUtils = {
  // Debounce function
  debounce: (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // Throttle function
  throttle: (func, limit) => {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  // Measure execution time
  measureTime: (fn) => {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    console.log(`Execution time: ${end - start} milliseconds`);
    return result;
  }
};

// Animation utilities
export const animationUtils = {
  // Easing functions
  easing: {
    linear: (t) => t,
    easeInQuad: (t) => t * t,
    easeOutQuad: (t) => t * (2 - t),
    easeInOutQuad: (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
    easeInCubic: (t) => t * t * t,
    easeOutCubic: (t) => (--t) * t * t + 1,
    easeInOutCubic: (t) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
  },

  // Interpolate between values
  lerp: (start, end, factor) => {
    return start + (end - start) * factor;
  },

  // Map value from one range to another
  mapRange: (value, inMin, inMax, outMin, outMax) => {
    return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
  }
};

// Validation utilities
export const validationUtils = {
  // Email validation
  isValidEmail: (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  },

  // Phone number validation (Indonesian)
  isValidPhone: (phone) => {
    const re = /^(\+62|62|0)[0-9]{9,11}$/;
    return re.test(phone.replace(/\s/g, ''));
  },

  // Check if string is empty or whitespace
  isEmpty: (str) => {
    return !str || str.trim().length === 0;
  },

  // Check if object has property
  hasProperty: (obj, prop) => {
    return Object.prototype.hasOwnProperty.call(obj, prop);
  }
};

// Love message utilities
export const loveUtils = {
  // Get romantic compliment
  getRandomCompliment: () => {
    const compliments = [
      "Gita cantik banget hari ini! ✨",
      "Senyummu bikin hari ku jadi cerah ☀️",
      "Gita itu amazing, tahu nggak? 💖",
      "Eyes mu sparkle kayak bintang 🌟",
      "Gita perfect just the way you are 💕",
      "Your laugh is my favorite sound 😊",
      "Gita bikin everything feels magical ✨"
    ];
    
    return arrayUtils.randomItem(compliments);
  },

  // Generate love percentage (just for fun)
  calculateLovePercentage: (name1, name2) => {
    // This is just for fun - not a real calculation!
    const combined = (name1 + name2).toLowerCase();
    let hash = 0;
    
    for (let i = 0; i < combined.length; i++) {
      hash = ((hash << 5) - hash) + combined.charCodeAt(i);
      hash = hash & hash;
    }
    
    return Math.abs(hash) % 41 + 60; // Returns 60-100%
  },

  // Get mood emoji
  getMoodEmoji: (score) => {
    if (score >= 90) return "🥰";
    if (score >= 80) return "😍";
    if (score >= 70) return "😊";
    if (score >= 60) return "🙂";
    return "😌";
  }
};

// Achievement utilities
export const achievementUtils = {
  // Check if milestone reached
  checkMilestone: (current, milestones) => {
    return milestones.filter(milestone => current >= milestone.threshold && !milestone.achieved);
  },

  // Generate achievement message
  generateAchievementMessage: (type, value) => {
    const messages = {
      level: `🎉 Selamat! Gita sudah menyelesaikan ${value} level!`,
      score: `⭐ Amazing! Total score Gita ${value} points!`,
      time: `⏰ Wow! Gita sudah menghabiskan ${value} menit di journey ini!`,
      streak: `🔥 Streak ${value} hari! Keep it up!`,
      perfect: `💯 Perfect score! Gita memang luar biasa!`
    };
    
    return messages[type] || `🎊 Achievement unlocked: ${type}!`;
  }
};

// Export all utilities
export default {
  dateUtils,
  stringUtils,
  numberUtils,
  arrayUtils,
  colorUtils,
  storageUtils,
  urlUtils,
  deviceUtils,
  performanceUtils,
  animationUtils,
  validationUtils,
  loveUtils,
  achievementUtils
};