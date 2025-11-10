import type { Meta, StoryObj } from '@storybook/react';
import { PagePreloader } from './';

const meta = {
  title: 'UI/PagePreloader',
  component: PagePreloader,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof PagePreloader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
