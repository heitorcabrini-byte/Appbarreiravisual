import { defineConfig } from 'vite';
import react from '@vitejs/react-vite-plugin'; // ou o plugin que estiver usando, ex: @vitejs/plugin-react
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/Appbarreiravisual/', // <--- ADICIONE ESTA LINHA COM O NOME DO SEU REPOSITÓRIO
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
