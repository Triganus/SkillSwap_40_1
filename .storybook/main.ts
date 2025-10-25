import type { StorybookConfig } from '@storybook/react-vite';
import * as path from 'node:path';

const config: StorybookConfig = {
  "stories": [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@chromatic-com/storybook",
    "@storybook/addon-docs",
    "@storybook/addon-onboarding",
    "@storybook/addon-a11y"
  ],
  "framework": {
    "name": "@storybook/react-vite",
    "options": {}
  },
  "viteFinal": async (config) => {
    // Настройка для работы с CSS Modules и SCSS
    if (config.css) {
      config.css.modules = {
        localsConvention: 'camelCase',
        generateScopedName: '[name]__[local]___[hash:base64:5]'
      };
    }
    
    // Настройка для SCSS
    config.css = {
      ...config.css,
      preprocessorOptions: {
        scss: {
          additionalData: `@import "@/index.css";`
        }
      }
    };
    
    // Алиасы путей как в основном vite.config.ts
    config.resolve = {
      ...config.resolve,
      alias: {
        ...(config.resolve?.alias as Record<string, string> | undefined),
        '@app': path.resolve(__dirname, '../src/app'),
        '@entities': path.resolve(__dirname, '../src/entities'),
        '@features': path.resolve(__dirname, '../src/features'),
        '@widgets': path.resolve(__dirname, '../src/widgets'),
        '@pages': path.resolve(__dirname, '../src/pages'),
        '@shared': path.resolve(__dirname, '../src/shared'),
        '@api': path.resolve(__dirname, '../src/api'),
      }
    };

    return config;
  }
};
export default config;