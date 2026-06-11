import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Configuração padrão limpa para o Vite + Tailwind v4
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  base: '/Appbarreiravisual/',
})
