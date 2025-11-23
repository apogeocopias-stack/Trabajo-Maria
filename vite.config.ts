import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    base: './', 
    define: {
      // Esto sustituye process.env.API_KEY por el valor real durante la construcción
      'process.env.API_KEY': JSON.stringify(env.API_KEY || process.env.API_KEY),
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      // IMPORTANTE: Hemos eliminado rollupOptions.external para que Vercel incluya
      // React y Three.js dentro del paquete final y no fallen al cargar.
    }
  };
});