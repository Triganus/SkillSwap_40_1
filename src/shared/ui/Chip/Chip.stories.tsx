import type { Meta, StoryObj } from '@storybook/react';
import { Chip } from './Chip';

const meta = {
  title: 'Shared/Chip',
  component: Chip,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onRemove: { action: 'removed' },
  },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Английский',
  },
};

export const WithRemove: Story = {
  args: {
    label: 'Хочу научиться',
    onRemove: () => console.log('removed'),
  },
};

export const LongText: Story = {
  args: {
    label: 'Длинный текст чипа для проверки',
    onRemove: () => console.log('removed'),
  },
};

export const Multiple: Story = {
  args: {
    label: 'Example',
  },
  render: () => (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <Chip label="Хочу научиться" onRemove={() => console.log('removed 1')} />
      <Chip label="Английский" onRemove={() => console.log('removed 2')} />
      <Chip label="Программирование" onRemove={() => console.log('removed 3')} />
      <Chip label="Дизайн" />
    </div>
  ),
};
