/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        backgroundImage: "url('/images/background.jpeg')",
      },
    },
    fontFamily: {
      serif: ["rockwell", "papyrus", "sans-serif"],
    },
  },
  plugins: [],
};
