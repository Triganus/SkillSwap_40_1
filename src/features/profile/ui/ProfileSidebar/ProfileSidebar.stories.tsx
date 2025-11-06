import { ProfileSidebar } from './ProfileSidebar';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Shared/UI/ProfileSidebar',
  component: ProfileSidebar,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof ProfileSidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultProfileMenu: Story = {
  args: {
    pathname: '/profile',
    handleLogout: () => {},
  },
};
