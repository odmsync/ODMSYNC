import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  return {
    base: '/',

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

    // Ensure environment variables are properly handled
    // Only VITE_ prefixed vars are exposed to client
    // ⚠️ WARNING: DO NOT set VITE_GEMINI_API_KEY in Netlify - it will be bundled into client code!
    // Use GEMINI_API_KEY instead (server-side only, used by Netlify Functions)
    envPrefix: ['VITE_'],

    // Build configuration
    build: {
      // Ensure no source maps leak secrets in production
      sourcemap: mode === 'development',
      
      // Minify to prevent easy key extraction
      minify: 'esbuild',
      
      // Rollup options to prevent key leakage
      rollupOptions: {
        output: {
          // Don't include env vars in chunk names
          manualChunks: undefined,
        },
      },
    },

    // Define environment variables (only VITE_ prefixed)
    define: {
      'process.env': {}, // required for legacy libs
    },
  };
});
