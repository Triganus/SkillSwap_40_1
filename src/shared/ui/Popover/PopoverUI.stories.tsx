import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { PopoverUI } from './PopoverUI';

const meta: Meta<typeof PopoverUI> = {
  title: 'Shared/UI/Popover',
  component: PopoverUI,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: 'Открыт ли Popover',
    },
    position: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
      description: 'Позиция Popover относительно триггера',
    },
    children: {
      control: 'text',
      description: 'Содержимое Popover',
    },
    onClose: {
      action: 'closed',
      description: 'Обработчик закрытия',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const InteractivePopoverComponent = (args: typeof PopoverUI.arguments) => {
  const [isOpen, setIsOpen] = useState(args.isOpen ?? false);

  return (
    <div style={{ padding: '100px' }}>
      <button
        onClick={() => setIsOpen(true)}
        style={{
          padding: '12px 24px',
          background: '#ABD27A',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: 500,
          color: '#253017',
        }}
      >
        Открыть Popover
      </button>

      <PopoverUI {...args} isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
};

export const Opened: Story = {
  args: {
    isOpen: true,
    position: 'bottom',
    children: (
      <div>
        <p style={{ margin: '0 0 8px 0', fontWeight: 600 }}>Уведомление</p>
        <p style={{ margin: 0 }}>У вас есть новое сообщение!</p>
      </div>
    ),
    onClose: () => console.log('Popover closed'),
  },
};

export const Closed: Story = {
  args: {
    isOpen: false,
    position: 'bottom',
    children: <div>Содержимое Popover</div>,
    onClose: () => console.log('Popover closed'),
  },
};

export const Interactive: Story = {
  args: {
    isOpen: false,
    position: 'bottom',
    children: (
      <div>
        <p style={{ margin: '0 0 8px 0', fontWeight: 600 }}>Уведомление</p>
        <p style={{ margin: 0 }}>У вас есть новое сообщение!</p>
      </div>
    ),
  },
  render: InteractivePopoverComponent,
};

export const PositionTop: Story = {
  args: {
    isOpen: true,
    position: 'top',
    children: (
      <div>
        <p style={{ margin: '0 0 8px 0', fontWeight: 600 }}>Позиция: Сверху</p>
        <p style={{ margin: 0 }}>Popover появляется сверху</p>
      </div>
    ),
    onClose: () => console.log('Popover closed'),
  },
};

export const PositionBottom: Story = {
  args: {
    isOpen: true,
    position: 'bottom',
    children: (
      <div>
        <p style={{ margin: '0 0 8px 0', fontWeight: 600 }}>Позиция: Снизу</p>
        <p style={{ margin: 0 }}>Popover появляется снизу</p>
      </div>
    ),
    onClose: () => console.log('Popover closed'),
  },
};

export const PositionLeft: Story = {
  args: {
    isOpen: true,
    position: 'left',
    children: (
      <div>
        <p style={{ margin: '0 0 8px 0', fontWeight: 600 }}>Позиция: Слева</p>
        <p style={{ margin: 0 }}>Popover появляется слева</p>
      </div>
    ),
    onClose: () => console.log('Popover closed'),
  },
};

export const PositionRight: Story = {
  args: {
    isOpen: true,
    position: 'right',
    children: (
      <div>
        <p style={{ margin: '0 0 8px 0', fontWeight: 600 }}>Позиция: Справа</p>
        <p style={{ margin: 0 }}>Popover появляется справа</p>
      </div>
    ),
    onClose: () => console.log('Popover closed'),
  },
};

export const WithMenu: Story = {
  args: {
    isOpen: true,
    position: 'bottom',
    children: (
      <div>
        <button
          onClick={() => console.log('Профиль')}
          style={{
            width: '100%',
            padding: '8px 12px',
            textAlign: 'left',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            fontSize: '14px',
            borderRadius: '4px',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#f3f4f6')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        >
          Профиль
        </button>
        <button
          onClick={() => console.log('Настройки')}
          style={{
            width: '100%',
            padding: '8px 12px',
            textAlign: 'left',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            fontSize: '14px',
            borderRadius: '4px',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#f3f4f6')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        >
          Настройки
        </button>
        <hr style={{ margin: '8px 0', border: 'none', borderTop: '1px solid #e5e7eb' }} />
        <button
          onClick={() => console.log('Выход')}
          style={{
            width: '100%',
            padding: '8px 12px',
            textAlign: 'left',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            fontSize: '14px',
            color: '#dc2626',
            borderRadius: '4px',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#fef2f2')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        >
          Выйти
        </button>
      </div>
    ),
    onClose: () => console.log('Popover closed'),
  },
};

export const WithNotifications: Story = {
  args: {
    isOpen: true,
    position: 'bottom',
    children: (
      <div style={{ minWidth: '300px' }}>
        <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: 600 }}>Уведомления</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ padding: '12px', background: '#f9fafb', borderRadius: '6px' }}>
            <p style={{ margin: '0 0 4px 0', fontWeight: 500, fontSize: '14px' }}>
              Новое предложение
            </p>
            <p style={{ margin: 0, fontSize: '12px', color: '#6b7280' }}>
              Иван предложил обмен навыками
            </p>
          </div>
          <div style={{ padding: '12px', background: '#f9fafb', borderRadius: '6px' }}>
            <p style={{ margin: '0 0 4px 0', fontWeight: 500, fontSize: '14px' }}>
              Новое сообщение
            </p>
            <p style={{ margin: 0, fontSize: '12px', color: '#6b7280' }}>
              Анна ответила на ваше предложение
            </p>
          </div>
        </div>
      </div>
    ),
    onClose: () => console.log('Popover closed'),
  },
};
