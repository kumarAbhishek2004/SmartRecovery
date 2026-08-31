/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        razorpay: {
          dark: '#0b132b',
          navy: '#1c2541',
          blue: '#2b6cb0',
          cyan: '#00d2ff',
          accent: '#3a86ff',
          card: '#131b36',
          border: '#202d54',
          emerald: '#10b981',
          rose: '#f43f5e',
          amber: '#f59e0b'
        }
      }
    },
  },
  plugins: [],
}
