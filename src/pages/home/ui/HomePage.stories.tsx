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
        <Story />
      </WithReduxProvider>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
    router: {
      initialEntries: ['/'],
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Основная история - обычный режим отображения
export const Default: Story = {
  parameters: {
    router: {
      initialEntries: ['/'],
    },
  },
};

// История с поиском
export const SearchMode: Story = {
  parameters: {
    router: {
      initialEntries: ['/?search=английский'],
    },
  },
};

// История с пустым поиском
export const EmptySearch: Story = {
  parameters: {
    router: {
      initialEntries: ['/?search=несуществующийнавык'],
    },
  },
};

// История с поиском по имени
export const SearchByName: Story = {
  parameters: {
    router: {
      initialEntries: ['/?search=Иван'],
    },
  },
};
