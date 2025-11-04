import type { Meta, StoryObj } from '@storybook/react';
import { Textarea } from './Textarea';

const meta: Meta<typeof Textarea> = {
  title: 'Shared/UI/Textarea',
  component: Textarea,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
    },
    disabled: {
      control: { type: 'boolean' },
    },
    error: {
      control: { type: 'boolean' },
    },
    resize: {
      control: { type: 'select' },
      options: ['none', 'vertical', 'horizontal', 'both'],
    },
    showCounter: {
      control: { type: 'boolean' },
    },
    rows: {
      control: { type: 'number' },
    },
    maxLength: {
      control: { type: 'number' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Введите текст...',
    size: 'medium',
  },
};

export const WithValue: Story = {
  args: {
    value: 'Пример текста в textarea',
    placeholder: 'Введите текст...',
    size: 'medium',
  },
};

export const Small: Story = {
  args: {
    placeholder: 'Маленький размер',
    size: 'small',
  },
};

export const Large: Story = {
  args: {
    placeholder: 'Большой размер',
    size: 'large',
  },
};

export const Error: Story = {
  args: {
    placeholder: 'Состояние ошибки',
    error: true,
    size: 'medium',
  },
};

export const Disabled: Story = {
  args: {
    placeholder: 'Заблокировано',
    disabled: true,
    size: 'medium',
  },
};

export const WithCounter: Story = {
  args: {
    placeholder: 'Введите описание (до 500 символов)',
    maxLength: 500,
    showCounter: true,
    size: 'medium',
  },
};

export const WithCounterAndValue: Story = {
  args: {
    value: 'Это пример текста с счетчиком символов',
    placeholder: 'Введите описание',
    maxLength: 500,
    showCounter: true,
    size: 'medium',
  },
};

export const NoResize: Story = {
  args: {
    placeholder: 'Нельзя изменить размер',
    resize: 'none',
    size: 'medium',
  },
};

export const HorizontalResize: Story = {
  args: {
    placeholder: 'Изменение размера по горизонтали',
    resize: 'horizontal',
    size: 'medium',
  },
};

export const BothResize: Story = {
  args: {
    placeholder: 'Изменение размера в обоих направлениях',
    resize: 'both',
    size: 'medium',
  },
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '400px' }}>
      <Textarea placeholder="Маленький textarea" size="small" />
      <Textarea placeholder="Средний textarea" size="medium" />
      <Textarea placeholder="Большой textarea" size="large" />
    </div>
  ),
};

export const WithDescription: Story = {
  args: {
    placeholder: 'Коротко опишите, чему можете научить',
    maxLength: 500,
    showCounter: true,
    size: 'medium',
    rows: 5,
  },
};

