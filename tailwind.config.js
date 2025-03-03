/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'background': '#0a0a0f',
        'surface': '#12121a',
        'surface-elevated': '#1a1a25',
        'text-primary': '#f2f2f8',
        'text-secondary': '#a0a0b8',
        'neon-blue': '#2c7bff',
        'neon-purple': '#9951ff',
        'neon-cyan': '#00e5ff',
        'neon-green': '#00ffa3',
      },
      backgroundImage: {
        'futuristic-grid': 'linear-gradient(rgba(44, 123, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(44, 123, 255, 0.1) 1px, transparent 1px)',
        'gradient-shimmer': 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0) 100%)',
      },
      backgroundSize: {
        'grid': '40px 40px',
        'shimmer-bg': '200% 100%',
      },
      animation: {
        'fadeIn': 'fadeIn 0.5s ease forwards',
        'pulse-slow': 'pulse 3s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulse: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
      },
    },
  },
  plugins: [],
  darkMode: 'class',
  // Enable data-theme="dark" variant for our custom theme solution
  variants: {
    extend: {
      backgroundColor: ['dark'],
      textColor: ['dark'],
      borderColor: ['dark'],
    },
  },
};
