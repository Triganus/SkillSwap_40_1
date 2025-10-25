import type { StorybookConfig } from '@storybook/react-vite';

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
    
    return config;
  }
};
export default config;