import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

import viteCompression from 'vite-plugin-compression';

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    vue(),
    viteCompression({
      verbose: true,
      disable: false,
      threshold: 10240,
      algorithm: 'gzip',
      ext: '.gz',
    }),
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },

  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@import "@/assets/style/main.scss";',
      },
    },
  },

  server: {
    host: '0.0.0.0',
    port: 3000,
    open: true,
    https: false,
    proxy: {
      web_fe_api: {
        target: 'https://w.droid.ac.cn/businessUser',
        secure: false,
        rewrite: (path) => path.replace(/^\/web_fe_api/, ''),
        ws: true,
      },
      '/device/manage': {
        target: 'https://w.droid.ac.c',
        secure: false,
      },
    },
  },

  build: {
    terserOptions: {
      compress: {
        // 去除console
        drop_console: true,
        // 去除debugger
        drop_debugger: true,
      },
    },
  },
});
