/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"], // Ativa o modo escuro que o Figma usa
  content: [
    "./index.html",
    "./default_shadcn_theme.css",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
