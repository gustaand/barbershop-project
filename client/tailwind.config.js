/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xsm': '450px',
        '2xsm': '400px',
        '3xsm': '375px',
        '4xsm': '320px'
      }
    },
  },
  plugins: [],
}