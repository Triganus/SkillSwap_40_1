import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { LikeButtonUI } from './LikeButtonUI';

const meta: Meta<typeof LikeButtonUI> = {
  title: 'Shared/UI/LikeButton',
  component: LikeButtonUI,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    isActive: {
      control: 'boolean',
      description: 'Выделено ли сердечко (заполнено)',
    },
    disabled: {
      control: 'boolean',
      description: 'Заблокирована ли кнопка',
    },
    onClick: {
      action: 'clicked',
      description: 'Обработчик клика',
    },
    ariaLabel: {
      control: 'text',
      description: 'Текст для доступности',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isActive: false,
    disabled: false,
    ariaLabel: 'Нравится',
  },
};

export const Active: Story = {
  args: {
    isActive: true,
    disabled: false,
    ariaLabel: 'Не нравится',
  },
};

export const Disabled: Story = {
  args: {
    isActive: false,
    disabled: true,
    ariaLabel: 'Нравится (недоступно)',
  },
};

export const DisabledActive: Story = {
  args: {
    isActive: true,
    disabled: true,
    ariaLabel: 'Не нравится (недоступно)',
  },
};

const InteractiveComponent = (args: typeof LikeButtonUI.arguments) => {
  const [isActive, setIsActive] = React.useState(args.isActive ?? false);
  
  return (
    <LikeButtonUI
      {...args}
      isActive={isActive}
      onClick={() => setIsActive(!isActive)}
      ariaLabel={isActive ? 'Не нравится' : 'Нравится'}
    />
  );
};

export const Interactive: Story = {
  args: {
    isActive: false,
    disabled: false,
    ariaLabel: 'Нравится',
  },
  render: InteractiveComponent,
};
