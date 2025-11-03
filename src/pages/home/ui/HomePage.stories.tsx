import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from '@/app/store';
import HomePage from './HomePage';

// Обёртка для Redux провайдера (MemoryRouter уже предоставляется глобальным декоратором в preview.tsx)
const WithReduxProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ReduxProvider store={store}>{children}</ReduxProvider>
);

const meta: Meta<typeof HomePage> = {
  title: 'Pages/HomePage',
  component: HomePage,
  decorators: [
    (Story) => (
      <WithReduxProvider>
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-background, #ffffff)' }}>
          <Story />
        </div>
      </WithReduxProvider>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
    router: {
      initialEntries: ['/'],
    },
    viewport: {
      defaultViewport: 'desktop',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Основная история - обычный режим отображения (с фильтрами и всеми блоками)
export const Default: Story = {
  parameters: {
    router: {
      initialEntries: ['/'],
    },
    viewport: {
      defaultViewport: 'desktop',
    },
  },
};

// История для планшета (фильтры скрыты)
export const TabletView: Story = {
  parameters: {
    router: {
      initialEntries: ['/'],
    },
    viewport: {
      defaultViewport: 'tablet',
    },
  },
};

// История для мобильного (фильтры скрыты)
export const MobileView: Story = {
  parameters: {
    router: {
      initialEntries: ['/'],
    },
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

// История с поиском (с фильтрами и результатами)
export const SearchMode: Story = {
  parameters: {
    router: {
      initialEntries: ['/?search=английский'],
    },
    viewport: {
      defaultViewport: 'desktop',
    },
  },
};

// История с пустым поиском
export const EmptySearch: Story = {
  parameters: {
    router: {
      initialEntries: ['/?search=несуществующийнавык'],
    },
    viewport: {
      defaultViewport: 'desktop',
    },
  },
};

// История с поиском по имени
export const SearchByName: Story = {
  parameters: {
    router: {
      initialEntries: ['/?search=Иван'],
    },
    viewport: {
      defaultViewport: 'desktop',
    },
  },
};
