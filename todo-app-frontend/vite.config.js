import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://demo-backend-4vur.onrender.com',  // Backend server address
        changeOrigin: true,
      },
    },
  },
});
