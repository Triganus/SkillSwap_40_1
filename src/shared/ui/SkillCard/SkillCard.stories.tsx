import type { Meta, StoryObj } from '@storybook/react';

import type { User } from '@entities/user/model/types/types';
import type { Skill } from '@entities/skill/model/types/types';
import { SkillCard } from '@shared/ui/SkillCard/SkillCard';

const meta: Meta<typeof SkillCard> = {
  title: 'Shared/UI/SkillCard',
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
    category: 'Музыка',
    tags: ['музыка', 'барабаны'],
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
    category: 'Бизнес',
    tags: ['время', 'продуктивность'],
    authorId: '1',
    createdAt: '2023-01-15',
  },
  {
    id: '3',
    title: 'Медитация',
    description: 'Интересуюсь медитацией',
    type: 'learning',
    category: 'Здоровье',
    tags: ['медитация', 'здоровье'],
    authorId: '1',
    createdAt: '2023-01-15',
  },
  {
    id: '3',
    title: 'Медитация',
    description: 'Интересуюсь медитацией',
    type: 'learning',
    category: 'Здоровье',
    tags: ['медитация', 'здоровье'],
    authorId: '1',
    createdAt: '2023-01-15',
  },
  {
    id: '3',
    title: 'Медитация',
    description: 'Интересуюсь медитацией',
    type: 'learning',
    category: 'Здоровье',
    tags: ['медитация', 'здоровье'],
    authorId: '1',
    createdAt: '2023-01-15',
  },
];

export const Default: Story = {
  args: {
    user: mockUser,
    teachingSkills: mockTeachingSkills,
    learningSkills: mockLearningSkills,
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
        description: 'Хочу изучить программирование',
        type: 'learning',
        category: 'IT',
        tags: ['программирование'],
        authorId: '1',
        createdAt: '2023-01-15',
      },
      {
        id: '5',
        title: 'Дизайн',
        description: 'Интересуюсь дизайном',
        type: 'learning',
        category: 'Творчество',
        tags: ['дизайн'],
        authorId: '1',
        createdAt: '2023-01-15',
      },
    ],
  },
};
