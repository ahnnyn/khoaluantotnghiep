import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import dns from 'dns';
import path from 'path';

dns.setDefaultResultOrder('verbatim');

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'components': path.resolve(__dirname, 'src/components'),
      'pages': path.resolve(__dirname, 'src/pages'),
      '@redux': path.resolve(__dirname, 'src/redux'),
      'utils': path.resolve(__dirname, 'src/utils'),
      'services': path.resolve(__dirname, 'src/services'),
    },
  },
  server: {
    port: 3001,
    proxy: {
      '/api': 'http://localhost:8080',
    },

  },
});
