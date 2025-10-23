import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';

const meta: Meta<typeof Input> = {
  title: 'Shared/UI/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
    },
    type: {
      control: { type: 'select' },
      options: ['text', 'email', 'password', 'number', 'tel', 'url'],
    },
    disabled: {
      control: { type: 'boolean' },
    },
    error: {
      control: { type: 'boolean' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
    size: 'medium',
  },
};

export const WithValue: Story = {
  args: {
    value: 'Hello World',
    placeholder: 'Enter text...',
    size: 'medium',
  },
};

export const Small: Story = {
  args: {
    placeholder: 'Small input',
    size: 'small',
  },
};

export const Large: Story = {
  args: {
    placeholder: 'Large input',
    size: 'large',
  },
};

export const Error: Story = {
  args: {
    placeholder: 'Error state',
    error: true,
    size: 'medium',
  },
};

export const Disabled: Story = {
  args: {
    placeholder: 'Disabled input',
    disabled: true,
    size: 'medium',
  },
};

export const Password: Story = {
  args: {
    type: 'password',
    placeholder: 'Enter password',
    size: 'medium',
  },
};

export const Email: Story = {
  args: {
    type: 'email',
    placeholder: 'Enter email',
    size: 'medium',
  },
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '300px' }}>
      <Input placeholder="Small input" size="small" />
      <Input placeholder="Medium input" size="medium" />
      <Input placeholder="Large input" size="large" />
    </div>
  ),
};
