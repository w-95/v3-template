import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueI18n from '@intlify/vite-plugin-vue-i18n';
import path from 'path';

import viteCompression from 'vite-plugin-compression';
import vueJsx from '@vitejs/plugin-vue-jsx';

import PkgConfig from 'vite-plugin-package-config';
import OptimizationPersist from 'vite-plugin-optimize-persist';

console.log(process.env.NODE_ENV, '-----');
// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    PkgConfig(),
    OptimizationPersist(),
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
      include: path.resolve(__dirname, './locales/**'),
    }),
  ],
  mode: process.env.NODE_ENV,
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
    postcss: {
      plugins: [
        require('postcss-preset-env')({
          stage: 3,
          features: {
            'nesting-rules': true,
          },
        }),
        require('postcss-px-to-viewport')({
          unitToConvert: 'px',
          viewportWidth: 1920,
          unitPrecision: 5,
          propList: ['*'],
          viewportUnit: 'vw',
          fontViewportUnit: 'vw',
          selectorBlackList: ['keep-px'],
          minPixelValue: 1,
          mediaQuery: false,
          replace: true,
          exclude: [/node_modules/],
          include: [/src/],
          landscape: false,
          landscapeUnit: 'vw',
          landscapeWidth: 1920,
        }),
      ],
    },
  },

  server: {
    host: '0.0.0.0',
    port: 3000,
    open: true,
    https: false,
    proxy: {
      '/web_fe_api': {
        target: 'https://w.droid.ac.cn/businessUser',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/web_fe_api/, ''),
        ws: true,
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
