import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import { VantResolver } from '@vant/auto-import-resolver';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';

import tailwindcss from "tailwindcss";

export default defineConfig({
  plugins: [
    vue(),
    AutoImport({ imports: ['vue', 'vue-router'], resolvers: [VantResolver()] }),
    Components({ resolvers: [VantResolver()] }),
  ],
  css: {
    postcss: {
      plugins: [tailwindcss]
    },
    preprocessorOptions: {
      scss: {
        additionalData: '@import "@/assets/global.scss";'
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})