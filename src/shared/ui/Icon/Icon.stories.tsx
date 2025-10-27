import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Icon } from './Icon';

const SpriteDecorator = (Story: React.ComponentType) => (
  <>
    <svg style={{ display: 'none' }} aria-hidden="true" focusable="false">
      <symbol id="icon-shared-add" viewBox="0 0 24 24">
        <path d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2h6z" />
      </symbol>
      <symbol id="icon-shared-check" viewBox="0 0 24 24">
        <path d="M9 16.2l-3.5-3.5L4 14.2 9 19l12-12-1.5-1.5z" />
      </symbol>
      <symbol id="icon-shared-close" viewBox="0 0 24 24">
        <path d="M18.3 5.71L12 12l6.3 6.29-1.41 1.42L10.59 13.4 4.3 19.71 2.89 18.3 9.17 12 2.89 5.71 4.3 4.29 10.59 10.6l6.3-6.3z" />
      </symbol>
    </svg>
    <Story />
  </>
);

const meta: Meta<typeof Icon> = {
  title: 'Shared/UI/Icon',
  component: Icon,
  parameters: {
    layout: 'centered',
  },
  decorators: [SpriteDecorator],
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: { type: 'select' },
      options: ['shared-add', 'shared-check', 'shared-close', 'idea'],
      description:
        'Часть после `icon-` в id символа внутри спрайта. Например: `shared-add` для `#icon-shared-add`',
    },
    size: {
      control: { type: 'text' },
      description: 'Размер иконки (px или любая CSS-единица). По умолчанию — 24',
    },
    title: {
      control: { type: 'text' },
      description:
        'Доступный заголовок. При наличии иконка получает role="img" и aria-hidden=false',
    },
    className: { control: false },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    name: 'shared-add',
    size: 24,
  },
};

export const WithTitle: Story = {
  args: {
    name: 'shared-check',
    size: 24,
    title: 'Success',
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <Icon name="shared-add" size={16} title="16px" />
      <Icon name="shared-add" size={24} title="24px" />
      <Icon name="shared-add" size={32} title="32px" />
      <Icon name="shared-add" size={48} title="48px" />
    </div>
  ),
};

export const ColorInherit: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
      <span style={{ color: '#1e88e5', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
        <Icon name="shared-add" size={24} /> Синий (currentColor)
      </span>
      <span style={{ color: '#e53935', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
        <Icon name="shared-close" size={24} /> Красный (currentColor)
      </span>
    </div>
  ),
};
