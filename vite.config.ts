import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    const isDev = mode === 'development';
    
    return {
      base: '/ODMSYNC/',
      server: isDev ? {
        port: 5173,
        host: '0.0.0.0',
        strictPort: false,
        allowedHosts: ['odmsync.github.io', 'odm-lb.com', 'odm-lb.netlify.app', 'localhost', '127.0.0.1'],
      } : undefined,
      
      plugins: [react()],
      
      // Note: Vite requires VITE_ prefix for client-side env vars
      // But we'll support both GEMINI_API_KEY and VITE_GEMINI_API_KEY
      define: {
        // Make both available for backward compatibility
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY || env.VITE_GEMINI_API_KEY || ''),
        'import.meta.env.VITE_GEMINI_API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY || env.GEMINI_API_KEY || ''),
        'import.meta.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY || env.VITE_GEMINI_API_KEY || ''),
      },
      
      resolve: {
        alias: {
          '@': path.resolve(process.cwd(), 'src'),
        }
      },
      
      build: {
        chunkSizeWarningLimit: 1000,
        minify: 'esbuild', // Use esbuild (Vite default, faster, no extra dependency)
        // esbuild automatically removes console and debugger in production
        rollupOptions: {
          output: {
            manualChunks: {
              'react-vendor': ['react', 'react-dom'],
              'gemini-vendor': ['@google/genai'],
              'lucide-icons': ['lucide-react'],
            },
            // Optimize chunk names for better caching
            chunkFileNames: 'assets/[name]-[hash].js',
            entryFileNames: 'assets/[name]-[hash].js',
            assetFileNames: 'assets/[name]-[hash].[ext]',
          },
        },
        // Enable source maps for production debugging (optional)
        sourcemap: false,
      },
      
      optimizeDeps: {
        include: ['react', 'react-dom'],
      },
    };
});