
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  const disableHMR = env.VITE_DISABLE_HMR === 'true';

  return {
    plugins: [react(), tailwindcss()],

    build: {
      chunkSizeWarningLimit: 1000,
    },

    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },

    server: {
      port: 5173,

      watch: disableHMR
        ? null
        : undefined,
    },
  };
});
