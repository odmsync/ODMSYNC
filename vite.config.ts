import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  // Use VITE_BASE_PATH from environment (Netlify)
  // Default to "/" for local dev + Netlify production
  // Only apply GitHub Pages-style base path when explicitly set
  const basePath = env.VITE_BASE_PATH || '/';

  return {
    base: basePath,

    server: mode === 'development' ? {
      port: 5173,
      host: '0.0.0.0',
    } : {},

    plugins: [react()],

    resolve: {
      alias: {
        '@': path.resolve(process.cwd(), 'src'),
      }
    },

    // Note: Vite requires VITE_ prefix for client-side env vars
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY || env.VITE_GEMINI_API_KEY || ''),
      'import.meta.env.VITE_GEMINI_API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY || env.GEMINI_API_KEY || ''),
    },
  };
});