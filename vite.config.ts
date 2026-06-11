import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'; // <--- O plugin que substitui tudo
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // <--- Ele cuida de compilar o CSS sem precisar de PostCSS
  ],
  base: '/Appbarreiravisual/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
