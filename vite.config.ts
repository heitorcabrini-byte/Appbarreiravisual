import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'; // <--- Nome correto do pacote oficial!
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/Appbarreiravisual/', // Mantém isso para consertar o CSS no GitHub Pages
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
