import type { Meta, StoryObj } from '@storybook/react';
import { CardSectionUI } from './CardSectionUI';
import type { TagCategory } from '@/shared/ui/Tag';

const meta: Meta<typeof CardSectionUI> = {
  title: 'Shared/UI/CardSection',
  component: CardSectionUI,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    onLookClick: () => {},
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// TODO: Насколько нужны данные email, skills, createdAt?
const mockCards = [
  {
    user: {
      id: 'user-1',
      name: 'Иван',
      email: 'ivan@example.com',
      bio: 'Санкт-Петербург, 34 года',
      avatar:
        'https://avatars.mds.yandex.net/i?id=9d47c46c416a58b98f5db0f8e631fd1e_l-12640276-images-thumbs&n=13',
      createdAt: '2023-01-15',
      skills: ['Барабаны', 'Музыка'],
    },
    teachingSkills: [
      {
        id: '1',
        title: 'Игра на барабанах',
        description: 'Научу играть на барабанах',
        type: 'teaching' as const,
        category: 'art' as TagCategory,
        authorId: '2',
        createdAt: '2023-01-15',
      },
    ],
    learningSkills: [
      {
        id: '2',
        title: 'Тайм менеджмент',
        description: 'Хочу научиться управлять временем',
        type: 'learning' as const,
        category: 'business' as TagCategory,
        authorId: '3',
        createdAt: '2023-01-15',
      },
      {
        id: '3',
        title: 'Медитация',
        description: 'Интересуюсь медитацией',
        type: 'learning' as const,
        category: 'health' as TagCategory,
        authorId: '4',
        createdAt: '2023-01-15',
      },
      {
        id: '3',
        title: 'Медитация',
        description: 'Интересуюсь медитацией',
        type: 'learning' as const,
        category: 'health' as TagCategory,
        authorId: '4',
        createdAt: '2023-01-15',
      },
    ],
    onDetailsClick: () => {},
    onLikeClick: () => {},
    isLiked: false,
  },
  {
    user: {
      id: 'user-2',
      name: 'Анна',
      email: 'anna@example.com',
      bio: 'Казань, 26 лет',
      avatar:
        'https://avatars.mds.yandex.net/i?id=2796cd94b751e04a7f8c8bea0d1f8b39_sr-5882731-images-thumbs&n=13',
      createdAt: '2023-01-15',
      skills: ['Английский', 'Лингвистика'],
    },
    teachingSkills: [
      {
        id: '7',
        title: 'Английский язык',
        description: 'Научу английскому языку',
        type: 'teaching' as const,
        category: 'languages' as TagCategory,
        authorId: '5',
        createdAt: '2023-01-15',
      },
    ],
    learningSkills: [
      {
        id: '2',
        title: 'Тайм менеджмент',
        description: 'Хочу научиться управлять временем',
        type: 'learning' as const,
        category: 'business' as TagCategory,
        authorId: '6',
        createdAt: '2023-01-15',
      },
      {
        id: '3',
        title: 'Медитация',
        description: 'Интересуюсь медитацией',
        type: 'learning' as const,
        category: 'health' as TagCategory,
        authorId: '7',
        createdAt: '2023-01-15',
      },
      {
        id: '3',
        title: 'Медитация',
        description: 'Интересуюсь медитацией',
        type: 'learning' as const,
        category: 'health' as TagCategory,
        authorId: '7',
        createdAt: '2023-01-15',
      },
    ],
    onDetailsClick: () => {},
    onLikeClick: () => {},
    isLiked: false,
  },
  {
    user: {
      id: 'user-3',
      name: 'Максим',
      email: 'maxim@example.com',
      bio: 'Москва, 23 года',
      avatar:
        'https://i.ytimg.com/vi/O74CPWAINP8/maxresdefault.jpg?sqp=-oaymwEmCIAKENAF8quKqQMa8AEB-AH-CYAC0AWKAgwIABABGGUgTChFMA8=&rs=AOn4CLDzDCm3UkN-NMfoJZzSPf1W1DD1_A',
      createdAt: '2023-01-15',
      skills: ['Бизнес', 'Предпринимательство'],
    },
    teachingSkills: [
      {
        id: '6',
        title: 'Бизнес-план',
        description: 'Хочу научить строить бизнес-план',
        type: 'teaching' as const,
        category: 'business' as TagCategory,
        authorId: '8',
        createdAt: '2023-01-15',
      },
    ],
    learningSkills: [
      {
        id: '2',
        title: 'Тайм менеджмент',
        description: 'Хочу научиться управлять временем',
        type: 'learning' as const,
        category: 'business' as TagCategory,
        authorId: '9',
        createdAt: '2023-01-15',
      },
      {
        id: '3',
        title: 'Медитация',
        description: 'Интересуюсь медитацией',
        type: 'learning' as const,
        category: 'health' as TagCategory,
        authorId: '10',
        createdAt: '2023-01-15',
      },
      {
        id: '3',
        title: 'Медитация',
        description: 'Интересуюсь медитацией',
        type: 'learning' as const,
        category: 'health' as TagCategory,
        authorId: '10',
        createdAt: '2023-01-15',
      },
      {
        id: '3',
        title: 'Медитация',
        description: 'Интересуюсь медитацией',
        type: 'learning' as const,
        category: 'health' as TagCategory,
        authorId: '10',
        createdAt: '2023-01-15',
      },
    ],
    onDetailsClick: () => {},
    onLikeClick: () => {},
    isLiked: false,
  },
  {
    user: {
      id: 'user-1',
      name: 'Иван',
      email: 'ivan@example.com',
      bio: 'Санкт-Петербург, 34 года',
      avatar:
        'https://avatars.mds.yandex.net/i?id=9d47c46c416a58b98f5db0f8e631fd1e_l-12640276-images-thumbs&n=13',
      createdAt: '2023-01-15',
      skills: ['Барабаны', 'Музыка'],
    },
    teachingSkills: [
      {
        id: '1',
        title: 'Игра на барабанах',
        description: 'Научу играть на барабанах',
        type: 'teaching' as const,
        category: 'art' as TagCategory,
        authorId: '2',
        createdAt: '2023-01-15',
      },
    ],
    learningSkills: [
      {
        id: '2',
        title: 'Тайм менеджмент',
        description: 'Хочу научиться управлять временем',
        type: 'learning' as const,
        category: 'business' as TagCategory,
        authorId: '3',
        createdAt: '2023-01-15',
      },
      {
        id: '3',
        title: 'Медитация',
        description: 'Интересуюсь медитацией',
        type: 'learning' as const,
        category: 'health' as TagCategory,
        authorId: '4',
        createdAt: '2023-01-15',
      },
    ],
    onDetailsClick: () => {},
    onLikeClick: () => {},
    isLiked: false,
  },
  {
    user: {
      id: 'user-2',
      name: 'Анна',
      email: 'anna@example.com',
      bio: 'Казань, 26 лет',
      avatar:
        'https://avatars.mds.yandex.net/i?id=2796cd94b751e04a7f8c8bea0d1f8b39_sr-5882731-images-thumbs&n=13',
      createdAt: '2023-01-15',
      skills: ['Английский', 'Лингвистика'],
    },
    teachingSkills: [
      {
        id: '7',
        title: 'Английский язык',
        description: 'Научу английскому языку',
        type: 'teaching' as const,
        category: 'languages' as TagCategory,
        authorId: '5',
        createdAt: '2023-01-15',
      },
    ],
    learningSkills: [
      {
        id: '2',
        title: 'Тайм менеджмент',
        description: 'Хочу научиться управлять временем',
        type: 'learning' as const,
        category: 'business' as TagCategory,
        authorId: '6',
        createdAt: '2023-01-15',
      },
      {
        id: '3',
        title: 'Медитация',
        description: 'Интересуюсь медитацией',
        type: 'learning' as const,
        category: 'health' as TagCategory,
        authorId: '7',
        createdAt: '2023-01-15',
      },
    ],
    onDetailsClick: () => {},
    onLikeClick: () => {},
    isLiked: false,
  },
  {
    user: {
      id: 'user-3',
      name: 'Максим',
      email: 'maxim@example.com',
      bio: 'Москва, 23 года',
      avatar:
        'https://i.ytimg.com/vi/O74CPWAINP8/maxresdefault.jpg?sqp=-oaymwEmCIAKENAF8quKqQMa8AEB-AH-CYAC0AWKAgwIABABGGUgTChFMA8=&rs=AOn4CLDzDCm3UkN-NMfoJZzSPf1W1DD1_A',
      createdAt: '2023-01-15',
      skills: ['Бизнес', 'Предпринимательство'],
    },
    teachingSkills: [
      {
        id: '6',
        title: 'Бизнес-план',
        description: 'Хочу научить строить бизнес-план',
        type: 'teaching' as const,
        category: 'business' as TagCategory,
        authorId: '8',
        createdAt: '2023-01-15',
      },
    ],
    learningSkills: [
      {
        id: '2',
        title: 'Тайм менеджмент',
        description: 'Хочу научиться управлять временем',
        type: 'learning' as const,
        category: 'business' as TagCategory,
        authorId: '9',
        createdAt: '2023-01-15',
      },
      {
        id: '3',
        title: 'Медитация',
        description: 'Интересуюсь медитацией',
        type: 'learning' as const,
        category: 'health' as TagCategory,
        authorId: '10',
        createdAt: '2023-01-15',
      },
    ],
    onDetailsClick: () => {},
    onLikeClick: () => {},
    isLiked: false,
  },
];

export const Default: Story = {
  args: {
    title: 'Популярное',
    cards: mockCards,
    showAllCards: false,
    showButton: true,
  },
};

export const NewSection: Story = {
  args: {
    title: 'Новое',
    cards: mockCards,
    showAllCards: false,
    showButton: true,
  },
};

export const RecommendedSection: Story = {
  args: {
    title: 'Рекомендуем',
    cards: mockCards,
    showAllCards: true,
    showButton: false,
  },
};

export const EmptySection: Story = {
  args: {
    title: 'Пустая секция',
    cards: [],
    showButton: true,
  },
};
