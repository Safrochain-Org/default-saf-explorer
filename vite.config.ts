import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import Layouts from 'vite-plugin-vue-layouts';
import DefineOptions from 'unplugin-vue-define-options/vite';
import AutoImport from 'unplugin-auto-import/vite';
import Pages from 'vite-plugin-pages';
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite';

import nodeGlobalsPolyfill from '@esbuild-plugins/node-globals-polyfill';
import nodeModulesPolyfill from '@esbuild-plugins/node-modules-polyfill';

export default defineConfig({
  base: '/', // ✅ IMPORTANT for production path resolution
  define: {
    'process.env': {},
    global: 'globalThis',
  },
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) =>
            [
              'ping-connect-wallet',
              'ping-token-convert',
              'ping-tx-dialog',
            ].includes(tag),
        },
      },
    }),
    vueJsx(),
    Pages({
      dirs: ['./src/modules', './src/pages'],
      exclude: ['**/*.ts'],
    }),
    Layouts({
      layoutsDirs: './src/layouts/',
    }),
    AutoImport({
      imports: [
        'vue',
        'vue-router',
        '@vueuse/core',
        '@vueuse/math',
        'vue-i18n',
        'pinia',
      ],
      vueTemplate: true,
    }),
    VueI18nPlugin({
      runtimeOnly: true,
      compositionOnly: true,
      include: [
        fileURLToPath(
          new URL('./src/plugins/i18n/locales/**', import.meta.url)
        ),
      ],
    }),
    DefineOptions(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      buffer: 'buffer',
      stream: 'stream-browserify',
      crypto: 'crypto-browserify',
      util: 'util',
      process: 'process/browser',
    },
  },
  optimizeDeps: {
    entries: ['./src/**/*.vue'],
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
      plugins: [
        nodeGlobalsPolyfill({ process: true, buffer: true }),
        nodeModulesPolyfill(),
      ],
    },
  },
});
