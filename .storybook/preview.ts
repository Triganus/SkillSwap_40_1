import type { Preview } from '@storybook/react';
import '@/index.css';
import '../src/shared/config/storybook/setupSvgSprite';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;