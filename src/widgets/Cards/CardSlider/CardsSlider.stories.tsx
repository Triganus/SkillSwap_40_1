import type { Meta, StoryObj } from '@storybook/react';

import React from 'react';
import type { SkillCardProps } from '@widgets/Cards/SkillCard';
import type { TagCategory } from '@/shared/ui/Tag';
import { CardSlider } from './CardsSlider';
import type { CardsSliderProps } from './types';

const meta: Meta<typeof CardSlider> = {
  title: 'widgets/CardsSlider',
  component: CardSlider,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'Заголовок секции',
    },
    loading: {
      control: 'boolean',
      description: 'Состояние загрузки',
    },
    skillsList: {
      control: 'object',
      description: 'Массив карточек навыков для отображения',
    },
  },
};

export default meta;
type Story = StoryObj<typeof CardSlider>;

// Базовые мок-данные для SkillCard
/*const mockSkillCard: SkillCardProps = {
  user: {
    id: '1',
    name: 'Иван',
    email: 'ivan@example.com',
    avatar: '/db/avatars/ivan.png',
    bio: 'Санкт-Петербург, 34 года',
    skills: ['ударные'],
    createdAt: new Date().toISOString(),
  },
  teachingSkills: [{ id: '1', name: 'Игра на барабанах' } as any],
  learningSkills: [
    { id: '2', name: 'Тайм менеджмент' } as any,
    { id: '3', name: 'Медитация' } as any,
  ],
  onDetailsClick: () => console.log('Подробнее'),
  onLikeClick: () => console.log('Лайк'),
  isLiked: false,
};*/

// Мок-данные для нескольких карточек
const generateMockSkills = (count: number): SkillCardProps[] => {
  const names = [
    'Илона',
    'Михаил',
    'Мария',
    'Виктория',
    'Елизавета',
    'Константин',
    'София',
    'Екатерина',
  ];
  const cities = [
    'Екатеринбург',
    'Новосибирск',
    'Краснодар',
    'Кемерово',
    'Владивосток',
    'Сочи',
    'Красноярск',
    'Иркутск',
  ];
  const ages = [33, 29, 21, 30, 25, 36, 24, 33];
  const teachingSkills = [
    'Английский язык',
    'Фотография',
    'Актерское мастерство',
    'Графический дизайн',
    'Йога',
    'Кулинария',
    'Программирование',
    'Дизайн интерьера',
  ];
  const learningSkills = [
    ['Тайм менеджмент', 'Медитация'],
    ['Английский', 'Фотография'],
    ['Тайм менеджмент', 'Медитация', 'Дизайн'],
    ['Фотография', 'Йога'],
    ['Кулинария', 'Дизайн'],
    ['Английский', 'Программирование'],
    ['Йога', 'Медитация'],
    ['Дизайн интерьера', 'Кулинария'],
  ];

  // Маппинг навыков на категории
  const getCategory = (skillName: string): TagCategory => {
    const lower = skillName.toLowerCase();
    if (lower.includes('английск') || lower.includes('язык')) return 'languages';
    if (lower.includes('фотограф') || lower.includes('дизайн') || lower.includes('актер'))
      return 'art';
    if (lower.includes('йога') || lower.includes('медитац')) return 'health';
    if (lower.includes('кулинар') || lower.includes('дом')) return 'home';
    if (
      lower.includes('программирование') ||
      lower.includes('тайм') ||
      lower.includes('менеджмент')
    )
      return 'business';
    return 'other';
  };

  return Array.from({ length: count }, (_, idx) => ({
    user: {
      id: `user-${idx + 1}`,
      name: names[idx % names.length],
      email: `${names[idx % names.length].toLowerCase()}@example.com`,
      avatar: '/db/avatars/ivan.png',
      bio: `${cities[idx % cities.length]}, ${ages[idx % ages.length]} года`,
      skills: [teachingSkills[idx % teachingSkills.length]],
      createdAt: new Date().toISOString(),
    },
    teachingSkills: [
      {
        id: `t-${idx}`,
        title: teachingSkills[idx % teachingSkills.length],
        description: `Могу научить ${teachingSkills[idx % teachingSkills.length].toLowerCase()}`,
        type: 'teaching' as const,
        category: getCategory(teachingSkills[idx % teachingSkills.length]),
        authorId: `user-${idx + 1}`,
        createdAt: new Date().toISOString(),
      },
    ],
    learningSkills: learningSkills[idx % learningSkills.length].map((skill, i) => ({
      id: `l-${idx}-${i}`,
      title: skill,
      description: `Хочу научиться ${skill.toLowerCase()}`,
      type: 'learning' as const,
      category: getCategory(skill),
      authorId: `user-${idx + 1}`,
      createdAt: new Date().toISOString(),
    })),
    onDetailsClick: () => console.log(`Подробнее о ${names[idx % names.length]}`),
    onLikeClick: () => console.log(`Лайк ${names[idx % names.length]}`),
    isLiked: idx % 3 === 0, // Каждая третья карточка в избранном
  }));
};

// Базовые данные для примеров
const defaultSkills = generateMockSkills(8);

// Вариант 1: Похожие предложения (как на макете)
export const SimilarOffers: Story = {
  args: {
    title: 'Похожие предложения',
    skillsList: defaultSkills,
    loading: false,
  },
};

// Вариант 2: Популярное (как на главной странице)
export const Popular: Story = {
  args: {
    title: 'Популярное',
    skillsList: defaultSkills.slice(0, 6),
    loading: false,
  },
};

// Вариант 3: Новое
export const New: Story = {
  args: {
    title: 'Новое',
    skillsList: defaultSkills.slice(2, 8),
    loading: false,
  },
};

// Вариант 4: Рекомендуем
export const Recommended: Story = {
  args: {
    title: 'Рекомендуем',
    skillsList: defaultSkills,
    loading: false,
  },
};

// Состояние загрузки
export const Loading: Story = {
  args: {
    title: 'Похожие предложения',
    skillsList: [],
    loading: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Состояние загрузки данных. Показывается плейсхолдер.',
      },
    },
  },
};

// Пустой список
export const Empty: Story = {
  args: {
    title: 'Похожие предложения',
    skillsList: [],
    loading: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Пустой список карточек. Показывается сообщение об отсутствии предложений.',
      },
    },
  },
};

// Мало карточек (1-2 штуки)
export const FewCards: Story = {
  args: {
    title: 'Похожие предложения',
    skillsList: generateMockSkills(2),
    loading: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Слайдер с небольшим количеством карточек. Навигационные кнопки могут быть отключены, если карточек меньше видимых.',
      },
    },
  },
};

// Много карточек (более 10)
export const ManyCards: Story = {
  args: {
    title: 'Похожие предложения',
    skillsList: generateMockSkills(15),
    loading: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Слайдер с большим количеством карточек. Навигация позволяет прокручивать весь список.',
      },
    },
  },
};

// Вариант с другим заголовком (для других секций)
export const OtherSection: Story = {
  args: {
    title: 'Подходящие предложения',
    skillsList: defaultSkills.slice(0, 6),
    loading: false,
  },
};

// Вариант для главной страницы - "Смотреть все"
export const HomePageSection: Story = {
  args: {
    title: 'Популярное',
    skillsList: defaultSkills.slice(0, 4),
    loading: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Пример использования на главной странице в секции "Популярное". Обычно показывает 3-4 карточки с возможностью прокрутки.',
      },
    },
  },
};

// Компонент для интерактивного примера (может использовать хуки)
const InteractiveCardSlider: React.FC<CardsSliderProps> = (args) => {
  const [loading, setLoading] = React.useState(args.loading);
  const [skills, setSkills] = React.useState(args.skillsList);

  React.useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => {
        setLoading(false);
        setSkills(defaultSkills);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  return (
    <div>
      <div style={{ marginBottom: '16px', display: 'flex', gap: '8px' }}>
        <button onClick={() => setLoading(true)}>Загрузить</button>
        <button onClick={() => setSkills([])}>Очистить</button>
        <button onClick={() => setSkills(defaultSkills)}>Заполнить</button>
      </div>
      <CardSlider {...args} loading={loading} skillsList={skills} />
    </div>
  );
};

// Интерактивный пример с переключением состояний
export const Interactive: Story = {
  render: (args) => <InteractiveCardSlider {...args} />,
  args: {
    title: 'Похожие предложения',
    skillsList: [],
    loading: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Интерактивный пример для тестирования разных состояний компонента.',
      },
    },
  },
};
