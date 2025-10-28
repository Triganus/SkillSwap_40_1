import type { Meta, StoryObj } from '@storybook/react';
import { NavMenu } from './NavMenu';
import { baseNavItems } from '@/shared/config/navigation';

const meta: Meta<typeof NavMenu> = {
  title: 'Navigation/NavMenu',
  component: NavMenu,
  parameters: {
    router: {
      initialEntries: ['/project'],
    },
  },
  args: {
    items: baseNavItems,
  },
};
export default meta;

type Story = StoryObj<typeof NavMenu>;

export const Row: Story = {
  args: {
    orientation: 'row',
  },
};

export const Column: Story = {
  args: {
    orientation: 'column',
  },
};

export const ColumnWithMarkers: Story = {
  args: {
    orientation: 'column',
    showMarkers: true,
  },
};

export const ActiveSkills: Story = {
  parameters: {
    router: {
      initialEntries: ['/skills'],
    },
  },
  args: {
    orientation: 'row',
  },
};

export const WithCustomNode: Story = {
  args: {
    orientation: 'row',
    items: [
      ...baseNavItems,
      {
        key: 'custom',
        node: <button type="button">Кнопка</button>,
      },
    ],
  },
};
