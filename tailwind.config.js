/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'cours': '#dbeafe',
        'tp': '#dcfce7',
        'td': '#f3e8ff',
        'sport': '#fed7aa',
      }
    }
  },
  plugins: [],
}

