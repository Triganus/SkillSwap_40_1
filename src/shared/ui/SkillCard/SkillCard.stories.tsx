import type { Meta, StoryObj } from '@storybook/react';
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

// Моки данных
const mockUser = {
  id: '1',
  name: 'Иван',
  email: 'ivan@example.com',
  avatar: '/avatars/ivan.png',
  location: 'Санкт-Петербург',
  age: 34,
  bio: '',
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
  {
    id: '2',
    title: 'Основы фотографии',
    description: 'Научу основам фотографии и обработки снимков',
    type: 'teaching',
    category: 'Творчество',
    tags: ['фотография', 'творчество'],
    authorId: '1',
    createdAt: '2023-01-15',
  },
];

const mockLearningSkills: Skill[] = [
  {
    id: '3',
    title: 'Тайм менеджмент',
    description: 'Хочу научиться управлять временем',
    type: 'learning',
    category: 'Бизнес',
    tags: ['время', 'продуктивность'],
    authorId: '1',
    createdAt: '2023-01-15',
  },
  {
    id: '4',
    title: 'Медитация',
    description: 'Интересуюсь медитацией',
    type: 'learning',
    category: 'Здоровье',
    tags: ['медитация', 'здоровье'],
    authorId: '1',
    createdAt: '2023-01-15',
  },
  {
    id: '5',
    title: 'Программирование',
    description: 'Хочу изучить программирование',
    type: 'learning',
    category: 'IT',
    tags: ['программирование'],
    authorId: '1',
    createdAt: '2023-01-15',
  },
];

// Стори 1: Компактный режим (по умолчанию)
export const Default: Story = {
  args: {
    user: mockUser,
    teachingSkills: mockTeachingSkills,
    learningSkills: mockLearningSkills,
    variant: 'compact',
  },
  name: 'Компактный режим',
};

// Стори 2: Детальный режим
export const Detailed: Story = {
  args: {
    user: mockUser,
    teachingSkills: mockTeachingSkills,
    learningSkills: mockLearningSkills,
    variant: 'detailed',
  },
  name: 'Детальный режим (с био)',
};

// Стори 3: Без навыков (только профиль)
export const NoSkills: Story = {
  args: {
    user: mockUser,
    teachingSkills: [],
    learningSkills: [],
    variant: 'compact',
  },
  name: 'Без навыков',
};

// Стори 4: Только навыки для обучения (много)
export const ManyLearningSkills: Story = {
  args: {
    user: mockUser,
    teachingSkills: [],
    learningSkills: [
      ...mockLearningSkills,
      {
        id: '6',
        title: 'Дизайн',
        description: 'Интересуюсь дизайном',
        type: 'learning',
        category: 'Творчество',
        tags: ['дизайн'],
        authorId: '1',
        createdAt: '2023-01-15',
      },
      {
        id: '7',
        title: 'Английский язык',
        description: 'Хочу выучить английский',
        type: 'learning',
        category: 'Языки',
        tags: ['английский'],
        authorId: '1',
        createdAt: '2023-01-15',
      },
    ],
    variant: 'compact',
  },
  name: 'Много навыков для обучения',
};

// Стори 5: С обработчиками действий
export const WithActions: Story = {
  args: {
    user: mockUser,
    teachingSkills: mockTeachingSkills,
    learningSkills: mockLearningSkills,
    variant: 'compact',
    onViewDetails: () => alert('Подробнее'),
    onOfferExchange: () => alert('Обмен предложен'),
    onToggleFavorite: () => alert('Избранное обновлено'),
    isFavorite: true,
  },
  name: 'С кнопками действий',
};

// Стори 6: Пользователь без локации и возраста
export const MinimalUser: Story = {
  args: {
    user: {
      id: '2',
      name: 'Анна',
      avatar: '/avatars/anna.png',
      bio: '',
    },
    teachingSkills: mockTeachingSkills.slice(0, 1),
    learningSkills: mockLearningSkills.slice(0, 2),
    variant: 'compact',
  },
  name: 'Минимальный профиль пользователя',
};
