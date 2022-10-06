/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        city: "url('/images/bg-city.jpg')",
      },
    },
    fontFamily: {
      serif: ["rockwell", "papyrus", "sans-serif"],
    },
  },
  plugins: [],
};
