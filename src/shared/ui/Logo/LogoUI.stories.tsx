import type { Meta, StoryObj } from '@storybook/react';
import { LogoUI } from './LogoUI';

const meta: Meta<typeof LogoUI> = {
  title: 'Shared/UI/Logo',
  component: LogoUI,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onClick: {
      action: 'clicked',
      description: 'Обработчик клика для SPA навигации',
    },
    className: {
      control: 'text',
      description: 'Дополнительный CSS класс',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const WithClickHandler: Story = {
  args: {
    onClick: () => console.log('Logo clicked!'),
  },
};

export const WithCustomClass: Story = {
  args: {
    className: 'custom-logo-class',
  },
};

export const OnDarkBackground: Story = {
  args: {},
  parameters: {
    backgrounds: {
      default: 'dark',
    },
  },
};
