import type { Meta, StoryObj } from '@storybook/react-vite';
import { BrowserRouter } from 'react-router-dom';
import { FooterWidget } from './Footer';

const meta = {
  title: 'Widgets/FooterWidget',
  component: FooterWidget,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof FooterWidget>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <BrowserRouter>
      <FooterWidget />
    </BrowserRouter>
  ),
};
