/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#3B82F6', // Blue for user messages
          dark: '#2563EB',
        },
        secondary: {
          light: '#F3F4F6', // Gray for bot messages
          dark: '#374151',
        },
        background: {
          light: '#FFFFFF',
          dark: '#1F2937',
        },
        text: {
          light: '#111827',
          dark: '#F9FAFB',
        }
      },
      animation: {
        'bounce-slow': 'bounce 1.5s infinite',
        'typing': 'typing 1s infinite',
      },
      keyframes: {
        typing: {
          '0%': { opacity: 0.2 },
          '50%': { opacity: 1 },
          '100%': { opacity: 0.2 },
        },
      },
    },
  },
  plugins: [],
} 