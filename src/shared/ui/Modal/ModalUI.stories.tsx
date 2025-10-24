import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ModalUI } from './ModalUI';

const meta: Meta<typeof ModalUI> = {
  title: 'Shared/UI/Modal',
  component: ModalUI,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: 'Открыта ли модалка',
    },
    title: {
      control: 'text',
      description: 'Заголовок модалки',
    },
    children: {
      control: 'text',
      description: 'Содержимое модалки',
    },
    onClose: {
      action: 'closed',
      description: 'Обработчик закрытия',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const InteractiveModalComponent = (args: typeof ModalUI.arguments) => {
  const [isOpen, setIsOpen] = useState(args.isOpen ?? true);

  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        style={{
          padding: '12px 24px',
          background: '#ABD27A',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '16px',
        }}
      >
        Открыть модалку
      </button>

      <ModalUI {...args} isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
};

export const Default: Story = {
  args: {
    isOpen: true,
    title: 'Ваше предложение создано',
    children: 'Теперь вы можете предложить обмен',
    actions: [
      {
        label: 'Готово',
        onClick: () => console.log('Готово clicked'),
        variant: 'primary',
      },
    ],
    onClose: () => console.log('Modal closed'),
  },
};

export const Interactive: Story = {
  args: {
    isOpen: false,
    title: 'Ваше предложение создано',
    children: 'Теперь вы можете предложить обмен',
    actions: [
      {
        label: 'Готово',
        onClick: () => console.log('Готово clicked'),
        variant: 'primary',
      },
    ],
  },
  render: InteractiveModalComponent,
};

export const WithMultipleActions: Story = {
  args: {
    isOpen: true,
    title: 'Подтвердите действие',
    children: 'Вы уверены, что хотите продолжить?',
    actions: [
      {
        label: 'Отмена',
        onClick: () => console.log('Отмена clicked'),
        variant: 'secondary',
      },
      {
        label: 'Продолжить',
        onClick: () => console.log('Продолжить clicked'),
        variant: 'primary',
      },
    ],
    onClose: () => console.log('Modal closed'),
  },
};

export const NoActions: Story = {
  args: {
    isOpen: true,
    title: 'Информация',
    children: 'Это модальное окно без кнопок действий',
    onClose: () => console.log('Modal closed'),
  },
};

export const LongContent: Story = {
  args: {
    isOpen: true,
    title: 'Условия использования',
    children: (
      <div>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua.
        </p>
        <p>
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
          commodo consequat.
        </p>
        <p>
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
          nulla pariatur.
        </p>
      </div>
    ),
    actions: [
      {
        label: 'Принять',
        onClick: () => console.log('Принять clicked'),
        variant: 'primary',
      },
    ],
    onClose: () => console.log('Modal closed'),
  },
};
