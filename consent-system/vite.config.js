import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/turbo': {
          target: env.VITE_LUFFY_HOST_API,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/turbo/, ''),
        },
        '/user': {
          target: env.VITE_GOLDEN_HOST_API,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/user/, ''),
        },
      },
    },
  };
});
