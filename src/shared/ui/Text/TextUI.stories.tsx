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
      options: ['h1', 'h2', 'h3', 'h4', 'body', 'caption'] satisfies TextVariant[],
      description: 'Тип текстового стиля из дизайн-системы (Figma)',
    },
    color: {
      control: 'inline-radio',
      options: ['primary', 'secondary', 'muted' ,'accent', 'error', 'link'] satisfies TextColor[],
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
      <TextUI variant="h1" color='secondary'>H1 — Заголовок крупный</TextUI>
      <TextUI variant="h2" color='secondary'>H2 — Подзаголовок</TextUI>
      <TextUI variant="h3" color='secondary'>H3 — Средний заголовок</TextUI>
      <TextUI variant="h4" color='secondary'>H4 — Малый заголовок</TextUI>
      <TextUI variant="body" color='secondary'>Body — основной текстовый стиль</TextUI>
      <TextUI variant="caption" color='secondary'>Caption — подпись или вспомогательный текст</TextUI>
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