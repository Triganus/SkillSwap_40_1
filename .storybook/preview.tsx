import type { Preview } from '@storybook/react';
import '@/index.css';
import '@shared/config/storybook/setupSvgSprite';
import { MemoryRouter } from 'react-router-dom';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story, context) => (
      <MemoryRouter initialEntries={context?.parameters?.router?.initialEntries ?? ['/']}>
        <Story />
      </MemoryRouter>
    ),
  ],
};

export default preview;