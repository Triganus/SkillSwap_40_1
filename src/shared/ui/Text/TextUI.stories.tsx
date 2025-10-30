import type { Meta, StoryObj } from '@storybook/react';
import { TextUI } from './TextUI';
import type { TextVariant, TextColor } from './TTextUIProps';

const meta: Meta<typeof TextUI> = {
  title: 'Shared/Text',
  component: TextUI,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['body', 'caption'] satisfies TextVariant[],
      description: 'Тип текстового стиля из дизайн-системы (Figma)',
    },
    color: {
      control: 'inline-radio',
      options: ['primary', 'secondary', 'muted', 'accent', 'error', 'link'] satisfies TextColor[],
      description: 'Цвет текста по теме',
    },
    children: {
      control: 'text',
      description: 'Содержимое компонента',
    },
    className: { control: false },
    style: { control: false },
  },
  args: {
    children: 'The quick brown fox jumps over the lazy dog',
    variant: 'body',
    color: 'primary',
  },
};

export default meta;
type Story = StoryObj<typeof TextUI>;

export const Playground: Story = {
  args: {
    children: 'Playground example — меняй variant и color в Controls',
  },
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 12 }}>
      <TextUI variant="body" color="secondary">
        Body — основной текстовый стиль
      </TextUI>
      <TextUI variant="caption" color="secondary">
        Caption — подпись или вспомогательный текст
      </TextUI>
    </div>
  ),
};

export const Colors: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 8 }}>
      <TextUI color="primary">Primary — основной цвет</TextUI>
      <TextUI color="secondary">Secondary — вторичный</TextUI>
      <TextUI color="muted">Muted — приглушённый</TextUI>
      <TextUI color="link">Link — ссылка</TextUI>
      <TextUI color="error">Error — ошибка</TextUI>
      <TextUI color="accent">accent — акцент</TextUI>
    </div>
  ),
};
