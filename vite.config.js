import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    assetsInlineLimit: 2048,
    target: 'es2020',
  },
  server: {
    host: true,
    port: 5173,
  },
});
