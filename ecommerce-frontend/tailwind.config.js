/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#6366f1',
          hover: '#4f46e5',
          light: '#818cf8',
        },
        accent: {
          DEFAULT: '#ec4899',
          light: '#f472b6',
        },
        surface: {
          light: '#ffffff',
          dark: '#1e293b',
        },
        background: {
          light: '#f8fafc',
          dark: '#0f172a',
        },
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.06)',
        'lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.05)',
        'glow': '0 0 20px rgba(99, 102, 241, 0.4)',
        'glow-dark': '0 0 25px rgba(129, 140, 248, 0.3)',
      },
      borderRadius: {
        'xl': '1.25rem',
        '2xl': '2rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-in': 'slideIn 0.4s ease-out',
        'float': 'float 6s ease-in-out infinite',
        'blob': 'blob 8s infinite alternate',
        'spin-slow': 'spin 1s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        float: {
          '0%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
          '100%': { transform: 'translateY(0px)' },
        },
        blob: {
          '0%': { 
            borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
            transform: 'scale(1)',
          },
          '33%': { 
            borderRadius: '30% 60% 70% 40% / 50% 60% 30% 60%',
            transform: 'scale(1.1) rotate(5deg)',
          },
          '66%': { 
            borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
            transform: 'scale(0.9) rotate(-5deg)',
          },
          '100%': { 
            borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
            transform: 'scale(1)',
          },
        },
      },
      backgroundImage: {
        'primary-gradient': 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
        'primary-gradient-dark': 'linear-gradient(135deg, #818cf8 0%, #c084fc 100%)',
        'accent-gradient': 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)',
      },
    },
  },
  plugins: [],
}
