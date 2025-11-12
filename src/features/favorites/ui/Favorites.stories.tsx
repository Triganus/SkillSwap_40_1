import type { Meta, StoryObj } from '@storybook/react';
import { Favorites } from './Favorites';

const meta: Meta<typeof Favorites> = {
  title: 'features/favorites/Favorites',
  component: Favorites,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Favorites>;

export const Default: Story = {
  args: {},
  // Нет пропсов — компонент сам управляет состоянием
};
