import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { NotificationBellUI } from './NotificationBellUI';

// Декоратор для SVG спрайта, если нужно добавить иконку
const SpriteDecorator = (Story: React.ComponentType) => (
  <>
    {/* В реальном приложении спрайт загружается автоматически через setupSvgSprite */}
    {/* Здесь для Storybook создаём минимальный спрайт */}
    <svg style={{ display: 'none' }} aria-hidden="true" focusable="false">
      <symbol id="icon-shared-notification" viewBox="0 0 24 24">
        {/* Иконка колокольчика - в реальном проекте используется notification.svg из assets/icons */}
        <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
      </symbol>
    </svg>
    <Story />
  </>
);

const meta: Meta<typeof NotificationBellUI> = {
  title: 'Shared/UI/NotificationBell',
  component: NotificationBellUI,
  decorators: [SpriteDecorator],
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    count: {
      control: { type: 'number', min: 0, max: 99 },
      description: 'Количество непрочитанных уведомлений. Если больше 9, показывается "9+"',
    },
    onClick: {
      action: 'clicked',
      description: 'Обработчик клика по колокольчику',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Состояние без уведомлений
 * Бейдж не отображается
 */
export const NoNotifications: Story = {
  args: {
    count: 0,
  },
};

/**
 * Одно уведомление
 * Бейдж отображается с числом "1"
 */
export const OneNotification: Story = {
  args: {
    count: 1,
  },
};

/**
 * Пять уведомлений
 * Бейдж отображается с числом "5"
 */
export const FiveNotifications: Story = {
  args: {
    count: 5,
  },
};

/**
 * Двенадцать уведомлений
 * Бейдж отображается с текстом "9+"
 */
export const TwelveNotifications: Story = {
  args: {
    count: 12,
  },
};

/**
 * Интерактивный пример
 * Позволяет изменять количество уведомлений через контролы Storybook
 */
export const Interactive: Story = {
  args: {
    count: 0,
  },
};
