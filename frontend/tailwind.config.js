/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0f1115',
        card: '#141821',
        line: '#1f2531',
        text: '#e7eaf2',
        mute: '#9aa3b2',
        brand: '#3b82f6'
      }
    },
  },
  plugins: [],
}
