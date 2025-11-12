import type { Meta, StoryObj } from '@storybook/react';
import { SearchHeaderUI } from './SearchHeaderUI';

const meta: Meta<typeof SearchHeaderUI> = {
  title: 'Shared/UI/SearchHeaderUI',
  component: SearchHeaderUI,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    total: { control: 'number', description: 'Общее количество результатов' },
    sortOrder: {
      control: 'inline-radio',
      options: ['newest', 'oldest'],
      description: 'Порядок сортировки',
    },
    onSortChange: { action: 'sortChanged' },
  },
};

export default meta;

type Story = StoryObj<typeof SearchHeaderUI>;

export const Default: Story = {
  args: {
    title: 'Избранное',
  },
};

export const WithTotal: Story = {
  args: {
    title: 'Избранное',
    total: 42,
  },
};

export const SortableNewest: Story = {
  args: {
    title: 'Подходящие предложения',
    total: 128,
    sortOrder: 'newest',
    onSortChange: (order) => console.log('New sort order:', order),
  },
};

export const SortableOldest: Story = {
  args: {
    title: 'Подходящие предложения',
    total: 128,
    sortOrder: 'oldest',
    onSortChange: (order) => console.log('New sort order:', order),
  },
};
