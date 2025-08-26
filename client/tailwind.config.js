/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-bar': 'linear-gradient(to top, #6366f1, #a855f7)', // Gradient for bars
        'gradient-text': 'linear-gradient(to right, #6366f1, #a855f7)', // Gradient for text
      },
    },
  },
  plugins: [],
}
