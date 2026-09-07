/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: '#FAF7F2',
          dark: '#F0EBE1',
        },
        blush: {
          DEFAULT: '#B87068',
          light: '#D49A93',
          dark: '#8E4E47',
        },
        gold: {
          DEFAULT: '#009775',
          light: '#3DBA9C',
          dark: '#00664F',
        },
        ink: {
          DEFAULT: '#2C2418',
          muted: '#8B7D6E',
          light: '#B5A898',
        },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'serif'],
        body: ['"DM Sans"', 'sans-serif'],
      },
      animation: {
        'fade-up': 'fadeUp 0.5s ease both',
        'fade-in': 'fadeIn 0.4s ease both',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
