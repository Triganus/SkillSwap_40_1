import type { Meta, StoryObj } from '@storybook/react';
import ProfilePage from './ProfilePage';

const meta: Meta<typeof ProfilePage> = {
  title: 'Pages/Profile/ProfilePage',
  component: ProfilePage,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof ProfilePage>;

export const Default: Story = {
  args: {},
  // Нет пропсов — компонент сам управляет состоянием
};
