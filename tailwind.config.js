/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // <--- Esta linha garante que o Tailwind procure as classes dentro de src/app/components
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
