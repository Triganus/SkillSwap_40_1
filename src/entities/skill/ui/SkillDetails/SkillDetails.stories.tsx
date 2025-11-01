import type { Meta, StoryObj } from '@storybook/react';
import { SkillDetails } from './SkillDetails';
import type { SkillDetailsProps } from './types';

const meta: Meta<typeof SkillDetails> = {
  title: 'entities/Skill/SkillDetails',
  component: SkillDetails,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'radio',
      options: ['want', 'can'],
      description: 'Режим отображения компонента',
    },
    isLiked: {
      control: 'boolean',
      description: 'В избранном ли (только для variant="want")',
    },
    isLikeActive: {
      control: 'boolean',
      description: 'Можно ли лайкать (только для variant="want")',
    },
    isRequestSent: {
      control: 'boolean',
      description: 'Отправлен ли запрос на обмен (только для variant="want")',
    },
  },
};

export default meta;
type Story = StoryObj<typeof SkillDetails>;

// Базовые данные для примеров
const defaultProps: Partial<SkillDetailsProps> = {
  title: 'Игра на барабанах',
  subTitle: 'Творчество и искусство / Музыка и звук',
  text: 'Привет! Я играю на барабанах уже больше 10 лет — от репетиций в гараже до выступлений на сцене с живыми группами. Научу основам техники (и как не отбить себе пальцы), играть любимые ритмы и разбирать песни, импровизировать и звучать уверенно даже без партитуры.',
  images: ['/db/avatars/ivan.png', '/public/vite.svg', '/public/vite.svg', '/public/vite.svg'],
};

// Режим "want" - публичный просмотр
export const WantDefault: Story = {
  args: {
    ...defaultProps,
    variant: 'want',
    isLiked: false,
    isLikeActive: true,
    isRequestSent: false,
    onLikeClick: () => console.log('Лайк кликнут'),
    onExchangeClick: () => console.log('Предложить обмен'),
    onShareClick: () => console.log('Поделиться'),
    onMoreClick: () => console.log('Ещё'),
  },
};

export const WantLiked: Story = {
  args: {
    ...defaultProps,
    variant: 'want',
    isLiked: true,
    isLikeActive: true,
    isRequestSent: false,
    onLikeClick: () => console.log('Убрать лайк'),
    onExchangeClick: () => console.log('Предложить обмен'),
    onShareClick: () => console.log('Поделиться'),
    onMoreClick: () => console.log('Ещё'),
  },
};

export const WantRequestSent: Story = {
  args: {
    ...defaultProps,
    variant: 'want',
    isLiked: false,
    isLikeActive: true,
    isRequestSent: true,
    onLikeClick: () => console.log('Лайк кликнут'),
    onShareClick: () => console.log('Поделиться'),
    onMoreClick: () => console.log('Ещё'),
  },
};

export const WantNotAuthenticated: Story = {
  args: {
    ...defaultProps,
    variant: 'want',
    isLiked: false,
    isLikeActive: false, // Не авторизован - лайк недоступен
    isRequestSent: false,
    onExchangeClick: () => console.log('Предложить обмен (требуется авторизация)'),
    onShareClick: () => console.log('Поделиться'),
    onMoreClick: () => console.log('Ещё'),
  },
};

// Режим "can" - редактирование
export const CanEdit: Story = {
  args: {
    ...defaultProps,
    variant: 'can',
    onEditClick: () => console.log('Редактировать'),
    onDoneClick: () => console.log('Готово'),
  },
  parameters: {
    docs: {
      description: {
        story:
          'Режим редактирования навыка. Показывается в модалке. ' +
          'Скрыты иконки действий (лайк, поделиться), показываются кнопки "Редактировать" и "Готово".',
      },
    },
  },
};

// С одной картинкой (проверка MediaSlider)
export const SingleImage: Story = {
  args: {
    ...defaultProps,
    variant: 'want',
    images: ['/db/avatars/ivan.png'],
    isLikeActive: true,
    isRequestSent: false,
  },
};

// С множеством изображений
export const ManyImages: Story = {
  args: {
    ...defaultProps,
    variant: 'want',
    images: [
      '/db/avatars/ivan.png',
      '/public/vite.svg',
      '/public/vite.svg',
      '/public/vite.svg',
      '/public/vite.svg',
    ],
  },
};
