/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'soft-pink': '#FFB6C1',
        'rose-gold': '#E8B4B8',
        'lavender': '#E6E6FA',
        'warm-white': '#FFFEF7',
        'coral': '#FF7F7F',
        'gold': '#FFD700',
        'deep-purple': '#2D1B69',
      },
      fontFamily: {
        'dancing': ['Dancing Script', 'cursive'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'spin-slow': 'spin 3s linear infinite',
        'fade-in': 'fadeIn 0.5s ease-in',
        'slide-up': 'slideUp 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'heart-beat': 'heartBeat 1.5s ease-in-out infinite',
        'sparkle': 'sparkle 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        heartBeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
        },
        sparkle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.5', transform: 'scale(0.8)' },
        },
      },
      backgroundImage: {
        'gradient-love': 'linear-gradient(135deg, #FFB6C1 0%, #E8B4B8 50%, #E6E6FA 100%)',
        'gradient-sunset': 'linear-gradient(135deg, #FF7F7F 0%, #FFB6C1 100%)',
        'gradient-night': 'linear-gradient(135deg, #2D1B69 0%, #4A4A8A 100%)',
      },
      boxShadow: {
        'love': '0 4px 20px rgba(255, 182, 193, 0.4)',
        'gold': '0 4px 20px rgba(255, 215, 0, 0.3)',
        'heart': '0 8px 32px rgba(255, 127, 127, 0.3)',
      },
    },
  },
  plugins: [],
}