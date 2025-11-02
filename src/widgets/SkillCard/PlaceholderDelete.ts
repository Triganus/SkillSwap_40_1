import type { Skill } from '@entities/skill/model/types/types';
import type { User } from '@/entities/user/model';

// Удалить после создания настоящих данных
export const user: User = {
  id: '1',
  name: 'Иван',
  email: 'ivan@example.com',
  avatar: '/avatars/ivan.png',
  bio: 'Санкт-Петербург, 34 года',
  skills: [],
  createdAt: '2023-01-15',
};

export const teachingSkills: Skill[] = [
  {
    id: 'skill-2',
    title: 'Игра на барабанах',
    description: 'Научу играть на барабанах',
    type: 'teaching',
    category: 'art',
    authorId: '1',
    createdAt: '2023-01-15',
  },
];

export const learningSkills: Skill[] = [
  {
    id: '2',
    title: 'Тайм менеджмент',
    description: 'Хочу научиться управлять временем',
    type: 'learning',
    category: 'business',
    authorId: '1',
    createdAt: '2023-01-15',
  },
];
