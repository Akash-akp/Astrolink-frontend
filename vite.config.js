import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    watch: {
      ignored: ['**/node_modules/**', '**/.git/**'],
      usePolling: true,
      interval: 1000
    }
  },
});