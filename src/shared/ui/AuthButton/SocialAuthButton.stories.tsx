import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { fn } from 'storybook/test';
import { AuthButton } from './SocialAuthButton';
import type { AuthProvider } from './types';

// Декоратор для SVG спрайта
const SpriteDecorator = (Story: React.ComponentType) => (
  <>
    {/* В реальном приложении спрайт загружается автоматически через setupSvgSprite */}
    {/* Здесь для Storybook создаём минимальный спрайт с нужными иконками */}
    <svg style={{ display: 'none' }} aria-hidden="true" focusable="false">
      <symbol id="icon-google" viewBox="0 0 20 20">
        <path
          d="M19.6 10.2273C19.6 9.51818 19.5364 8.83636 19.4182 8.18182H10V12.05H15.3818C15.15 13.3 14.4455 14.3591 13.3864 15.0682V17.5773H16.6182C18.5091 15.8364 19.6 13.2727 19.6 10.2273Z"
          fill="#4285F4"
        />
        <path
          d="M10 20C12.7 20 14.9636 19.1045 16.6182 17.5773L13.3864 15.0682C12.4909 15.6682 11.3455 16.0227 10 16.0227C7.39545 16.0227 5.19091 14.2636 4.40455 11.9H1.06364V14.4909C2.70909 17.7591 6.09091 20 10 20Z"
          fill="#34A853"
        />
        <path
          d="M4.40455 11.9C4.20455 11.3 4.09091 10.6591 4.09091 10C4.09091 9.34091 4.20455 8.7 4.40455 8.1V5.50909H1.06364C0.386364 6.85909 0 8.38636 0 10C0 11.6136 0.386364 13.1409 1.06364 14.4909L4.40455 11.9Z"
          fill="#FBBC05"
        />
        <path
          d="M10 3.97727C11.4682 3.97727 12.7864 4.48182 13.8227 5.47273L16.6909 2.60455C14.9636 0.990909 12.6955 0 10 0C6.09091 0 2.70909 2.24091 1.06364 5.50909L4.40455 8.1C5.19091 5.73636 7.39545 3.97727 10 3.97727Z"
          fill="#EA4335"
        />
      </symbol>
      <symbol id="icon-apple" viewBox="0 0 24 24">
        <path
          d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"
          fill="currentColor"
        />
      </symbol>
    </svg>
    <Story />
  </>
);

const meta: Meta<typeof AuthButton> = {
  title: 'Shared/UI/AuthButton',
  component: AuthButton,
  parameters: {
    layout: 'centered',
  },
  decorators: [SpriteDecorator],
  tags: ['autodocs'],
  argTypes: {
    provider: {
      control: { type: 'select' },
      options: ['google', 'apple'] satisfies AuthProvider[],
      description: 'Провайдер авторизации',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Отключено ли состояние кнопки',
    },
    onClick: {
      action: 'clicked',
      description: 'Обработчик клика по кнопке',
    },
    className: {
      control: false,
      description: 'Дополнительные CSS классы',
    },
  },
  args: {
    onClick: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Основные варианты
export const Google: Story = {
  args: {
    provider: 'google',
    disabled: false,
  },
};

export const Apple: Story = {
  args: {
    provider: 'apple',
    disabled: false,
  },
};

// Состояния
export const GoogleDisabled: Story = {
  args: {
    provider: 'google',
    disabled: true,
  },
};

export const AppleDisabled: Story = {
  args: {
    provider: 'apple',
    disabled: true,
  },
};

// Все варианты вместе
export const AllProviders: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '400px' }}>
      <AuthButton provider="google" onClick={fn()} />
      <AuthButton provider="apple" onClick={fn()} />
    </div>
  ),
};

export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '400px' }}>
      <AuthButton provider="google" onClick={fn()} />
      <AuthButton provider="google" onClick={fn()} disabled={true} />
      <AuthButton provider="apple" onClick={fn()} />
      <AuthButton provider="apple" onClick={fn()} disabled={true} />
    </div>
  ),
};

// Интерактивные примеры
export const WithClickHandler: Story = {
  args: {
    provider: 'google',
    onClick: () => {
      console.log('Авторизация через Google');
      alert('Клик по кнопке Google!');
    },
  },
};

export const WithAppleClickHandler: Story = {
  args: {
    provider: 'apple',
    onClick: () => {
      console.log('Авторизация через Apple');
      alert('Клик по кнопке Apple!');
    },
  },
};
