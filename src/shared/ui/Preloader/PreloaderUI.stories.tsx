import type { Meta, StoryObj } from '@storybook/react';
import { PreloaderUI } from './PreloaderUI';

const meta: Meta<typeof PreloaderUI> = {
  title: 'Shared/UI/Preloader',
  component: PreloaderUI,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
    },
    ariaLabel: {
      control: { type: 'text' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    size: 'medium',
    ariaLabel: 'Loading',
  },
};

export const Small: Story = {
  args: {
    size: 'small',
    ariaLabel: 'Loading',
  },
};

export const Medium: Story = {
  args: {
    size: 'medium',
    ariaLabel: 'Loading',
  },
};

export const Large: Story = {
  args: {
    size: 'large',
    ariaLabel: 'Loading',
  },
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <PreloaderUI size="small" ariaLabel="Small loading" />
        <div style={{ marginTop: '8px', fontSize: '12px', color: '#6b7280' }}>Small</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <PreloaderUI size="medium" ariaLabel="Medium loading" />
        <div style={{ marginTop: '8px', fontSize: '12px', color: '#6b7280' }}>Medium</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <PreloaderUI size="large" ariaLabel="Large loading" />
        <div style={{ marginTop: '8px', fontSize: '12px', color: '#6b7280' }}>Large</div>
      </div>
    </div>
  ),
};

export const WithCustomAriaLabel: Story = {
  args: {
    size: 'medium',
    ariaLabel: 'Please wait, content is loading',
  },
};
