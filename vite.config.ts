import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, (process as any).cwd(), '');
  return {
    plugins: [react()],
    base: './', 
    resolve: {
      dedupe: ['three', 'react', 'react-dom', '@react-three/fiber'],
    },
    define: {
      'process.env.API_KEY': JSON.stringify(env.API_KEY || process.env.API_KEY),
    },
    // Force Vite to exclude these from pre-bundling in Dev mode.
    // This ensures the browser uses the Import Map (CDN) versions directly,
    // preventing the "Multiple Instances" conflict between local node_modules and CDN.
    optimizeDeps: {
      exclude: ['three', 'react', 'react-dom', '@react-three/fiber', '@react-three/drei']
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      rollupOptions: {
        // Keep this for Production build to ensure we don't bundle them twice
        external: [
          'react', 
          'react-dom', 
          'three', 
          '@react-three/fiber', 
          '@react-three/drei',
          '@google/genai'
        ],
        output: {
          globals: {
            react: 'React',
            'react-dom': 'ReactDOM',
            three: 'THREE',
          }
        }
      }
    }
  };
});