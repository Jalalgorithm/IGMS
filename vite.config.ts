import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig(({ mode }) => {
  // index.html interpolates this; without it the consent banner silently fails.
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  if (!/^[A-Za-z0-9_-]+$/.test(env.VITE_USERCENTRICS_SETTINGS_ID ?? '')) {
    throw new Error('VITE_USERCENTRICS_SETTINGS_ID is missing or malformed — see .env.example.');
  }

  return {
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5173,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    target: 'es2022',
  },
  };
});
