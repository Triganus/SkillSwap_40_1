import type { Meta, StoryObj } from '@storybook/react';
import { AvatarUI } from './AvatarUI';

const meta: Meta<typeof AvatarUI> = {
  title: 'Shared/UI/Avatar',
  component: AvatarUI,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    src: {
      control: 'text',
      description: 'URL изображения',
    },
    alt: {
      control: 'text',
      description: 'Альтернативный текст',
    },
    fallback: {
      control: 'text',
      description: 'Текст для fallback (инициалы)',
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
  args: {
    src: 'https://i.pravatar.cc/150?img=1',
    alt: 'User avatar',
  },
};

export const WithFallback: Story = {
  args: {
    fallback: 'Иван Петров',
    alt: 'User avatar',
  },
};

export const WithInitials: Story = {
  args: {
    fallback: 'ИП',
    alt: 'User avatar',
  },
};

export const BrokenImage: Story = {
  args: {
    src: 'https://broken-image-url.com/image.jpg',
    fallback: 'Иван Петров',
    alt: 'Broken image',
  },
};

export const NoFallback: Story = {
  args: {
    alt: 'No image',
  },
};
