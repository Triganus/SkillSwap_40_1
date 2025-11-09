import type { Meta, StoryObj } from '@storybook/react';

import type { User } from '@entities/user/model/types/types';
import type { Skill } from '@entities/skill/model/types/types';
import { SkillCard } from './SkillCard';

const meta: Meta<typeof SkillCard> = {
  title: 'Widgets/Cards/SkillCard',
  component: SkillCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockUser: User = {
  id: '1',
  name: 'Иван',
  email: 'ivan@example.com',
  avatar: '/avatars/ivan.png',
  bio: 'Санкт-Петербург, 34 года',
  skills: [],
  createdAt: '2023-01-15',
};

const mockTeachingSkills: Skill[] = [
  {
    id: '1',
    title: 'Игра на барабанах',
    description: 'Научу играть на барабанах',
    type: 'teaching',
    category: 'art',
    authorId: '1',
    createdAt: '2023-01-15',
  },
];

const mockLearningSkills: Skill[] = [
  {
    id: '2',
    title: 'Тайм менеджмент',
    description: 'Хочу научиться управлять временем',
    type: 'learning',
    category: 'business',
    authorId: '1',
    createdAt: '2023-01-15',
  },
  {
    id: '3',
    title: 'Медитация',
    description: 'Интересуюсь медитацией',
    type: 'learning',
    category: 'health',
    authorId: '1',
    createdAt: '2023-01-15',
  },
  {
    id: '5',
    title: 'Медитация',
    description: 'Интересуюсь медитацией',
    type: 'learning',
    category: 'health',
    authorId: '1',
    createdAt: '2023-01-15',
  },
  {
    id: '6',
    title: 'Медитация',
    description: 'Интересуюсь медитацией',
    type: 'learning',
    category: 'health',
    authorId: '1',
    createdAt: '2023-01-15',
  },
];

export const Compact: Story = {
  args: {
    user: mockUser,
    teachingSkills: mockTeachingSkills,
    learningSkills: mockLearningSkills,
    mode: 'compact',
  },
};

export const Full: Story = {
  args: {
    user: mockUser,
    teachingSkills: mockTeachingSkills,
    learningSkills: mockLearningSkills,
    mode: 'full',
    title: 'Игра на барабанах',
    category: 'art',
    description:
      'Привет! Я играю на барабанах уже больше 10 лет. Начал с простых репетиций в гараже, а теперь участвую в живых выступлениях. Готов поделиться своим опытом и научить тебя основам, правильной технике, игре разных ритмов и импровизации. Главное — почувствовать ритм и уверенно играть без нот.',
    images: [
      'https://images.unsplash.com/photo-1519892300165-cb5582e58f6f?w=800',
      'https://images.unsplash.com/photo-1586370434639-0fe43b2d32c6?w=800',
      'https://images.unsplash.com/photo-1511497584788-876760111969?w=800',
      'https://images.unsplash.com/photo-1514320291840-2e0a9bf29a8e?w=800',
    ],
    onExchangeClick: () => console.log('Exchange clicked'),
    onLikeClick: () => console.log('Like clicked'),
    onShareClick: () => console.log('Share clicked'),
    onMoreClick: () => console.log('More clicked'),
    isLiked: false,
  },
};

export const WithManyLearningSkills: Story = {
  args: {
    user: mockUser,
    teachingSkills: mockTeachingSkills,
    learningSkills: [
      ...mockLearningSkills,
      {
        id: '4',
        title: 'Программирование',
        category: 'education',
      },
      {
        id: '11',
        title: 'Дизайн',
        category: 'art',
      },
    ],
    mode: 'compact',
  },
};
