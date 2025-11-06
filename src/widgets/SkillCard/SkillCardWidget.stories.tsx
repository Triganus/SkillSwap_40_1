import type { Meta, StoryObj } from '@storybook/react';
import type { Skill } from '@entities/skill/model/types/types';
import SkillCardWidget from '@widgets/SkillCard/SkillCardWidget';

const meta: Meta<typeof SkillCardWidget> = {
  title: 'Widgets/SkillCardWidget',
  component: SkillCardWidget,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockUser = {
  id: '1',
  name: 'Иван',
  email: 'ivan@example.com',
  avatar: '/avatars/ivan.png',
  location: 'Санкт-Петербург',
  age: 34,
  bio: 'Люблю учить и учиться',
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
];

export const Default: Story = {
  args: {
    user: mockUser,
    teachingSkills: mockTeachingSkills,
    learningSkills: mockLearningSkills,
    onOffer: (payload: { toUserId: string }) => {
      alert(`Offer to: ${payload.toUserId}`);
    },
  },
};

export const WithInitialOpen: Story = {
  args: {
    user: mockUser,
    teachingSkills: mockTeachingSkills,
    learningSkills: mockLearningSkills,
    onOffer: async () => {
      // имитация задержки
      await new Promise((r) => setTimeout(r, 800));

      console.log('offer sent');
    },
    initialOpen: true,
  },
};
