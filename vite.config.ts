import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Configuração oficial para Vite + Tailwind v4 rodando no GitHub Pages
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  base: '/Appbarreiravisual/',
})
