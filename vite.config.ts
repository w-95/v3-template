import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueI18n from "@intlify/vite-plugin-vue-i18n";
import path from 'path';

import viteCompression from 'vite-plugin-compression';
import vueJsx from "@vitejs/plugin-vue-jsx";

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
    vueJsx(),
    vueI18n({
      include: path.resolve(__dirname, './locales/**')
    })
  ],

  // 否则拿不到process对象
  define: { 'process.env': {} },

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
      '/web_fe_api': {
        target: 'https://x.droid.ac.cn/robotcloud_backend',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/web_fe_api/, ''),
        ws: true,
      }
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
