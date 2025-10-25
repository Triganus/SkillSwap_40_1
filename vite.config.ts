import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import path from 'node:path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr(),
    createSvgIconsPlugin({
      iconDirs: [path.resolve(__dirname, 'src/shared/assets/icons')],
      symbolId: 'icon-[dir]-[name]',
      svgoOptions: {
        plugins: [
          {
            name: 'preset-default',
            params: {
              overrides: {
                removeViewBox: false,
              },
            },
          },
          'removeDimensions',
          {
            name: 'removeAttrs',
            params: {
              attrs: '(fill|stroke|style|class|data-name)'
            }
          },
          'prefixIds',
        ],
      },
      inject: 'body-last',
    }),
  ],
  server: {
    open: true,
  },
  resolve: {
    alias: {
      '@app': path.resolve(__dirname, 'src/app'),
      '@entities': path.resolve(__dirname, 'src/entities'),
      '@features': path.resolve(__dirname, 'src/features'),
      '@widgets': path.resolve(__dirname, 'src/widgets'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@shared': path.resolve(__dirname, 'src/shared'),
      '@api': path.resolve(__dirname, 'src/api'),
    },
  },
  css: {
    modules: {
      localsConvention: 'camelCaseOnly'
    }
  }
});
