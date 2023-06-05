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
    postcss: {
      plugins: [
        require('postcss-px-to-viewport-8-plugin')({
          unitToConvert: 'px', // 需要转换的单位，默认为"px"
          viewportWidth: 1920, // 设计稿的视口宽度
          unitPrecision: 5, // 单位转换后保留的精度
          propList: ['*'], // 能转化为vw的属性列表,!font-size表示font-size后面的单位不会被转换
          viewportUnit: 'vw', // 希望使用的视口单位
          fontViewportUnit: 'vw', // 字体使用的视口单位
          selectorBlackList: ['keep-px'], // 需要忽略的CSS选择器，不会转为视口单位，使用原有的px等单位。
          minPixelValue: 1, // 设置最小的转换数值，如果为1的话，只有大于1的值会被转换
          mediaQuery: false, // 媒体查询里的单位是否需要转换单位
          replace: true, //  是否直接更换属性值，而不添加备用属性
          exclude: [/node_modules/], // 忽略某些文件夹下的文件或特定文件，例如 'node_modules' 下的文件
          include: [/src/], // 如果设置了include，那将只有匹配到的文件才会被转换
          landscape: false, // 是否添加根据 landscapeWidth 生成的媒体查询条件 @media (orientation: landscape)
          landscapeUnit: 'vw', // 横屏时使用的单位
          landscapeWidth: 1920, // 横屏时使用的视口宽度
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
