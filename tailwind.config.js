
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'custom-pink': '#C0307F',
      },
      fontFamily: {
        'alata': ['Alata', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
