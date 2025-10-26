/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        '900px': '900px',
        'mobile' : '450px'
      }
    }
  },
  plugins: [],
}