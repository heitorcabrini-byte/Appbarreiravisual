import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'; // <--- Importa o compilador do Tailwind v4
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // <--- Ativa o Tailwind dentro do Vite
  ],
  base: '/Appbarreiravisual/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
