import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig((mode: any) => {
  const env = loadEnv(mode, process.cwd());
  const basePath = env.VITE_NODE_ENV != "production" ?  "/" : env.VITE_PUBLIC_PATH ?  `/${env.VITE_PUBLIC_PATH}` : "/";
  const tartgetApi = env.VITE_NODE_ENV != "production" ? 'http://127.0.0.1:3500' : env.VITE_TARGET_API ? env.VITE_TARGET_API : 'http://127.0.0.1:3500';
  const proxyApi = env.VITE_NODE_ENV != "production" ? `^${basePath}api/` : `^/${basePath}api/`;

  return {
    plugins: [vue()],
    base: basePath,
    server: {
      port: 3501,
      proxy: {
        [proxyApi]: {
          target: tartgetApi,
          changeOrigin: true,
          secure: false,
          // ws: true,
        },
      },
    },
  }

});
