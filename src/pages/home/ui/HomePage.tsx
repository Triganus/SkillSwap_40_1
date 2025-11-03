import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@shared/hooks/redux';
import {
  // getPopularSkills, // TODO: будет использоваться после готовности API
  // getNewSkills, // TODO: будет использоваться после готовности API
  // getSearchResults, // TODO: будет использоваться после готовности API
  getSearchQuery,
  getSkillsLoading,
  setSearchQuery,
  filterSkills,
  // fetchSkills, // TODO: будет использоваться после готовности API
} from '@entities/skill/model';
import { CardSectionUI } from '@shared/ui/CardSection';
import { InfiniteGridUI } from '@shared/ui/InfiniteGrid';
import { SkillCard } from '@shared/ui/SkillCard';
import type { SkillCardProps } from '@shared/ui/SkillCard';
import { TitleUI } from '@shared/ui/Title';
import { FilterSideBar } from '@widgets/FilterSideBar/FilterSideBar';
import type { FilterPayload } from '@widgets/FilterSideBar/TFilterSideBarProps';
import type { SkillCategoriesData } from '@entities/Skill';
import styles from './HomePage.module.scss';

// Временные мок-данные для каталога навыков (фильтры)
const MOCK_SKILLS_CATALOG: SkillCategoriesData = {
  skill_categories: [
    {
      category: 'Бизнес и карьера',
      skills: [
        { skill_id: 'bus_001', skill_name: 'Управление командой', skill_image: '' },
        { skill_id: 'bus_002', skill_name: 'Маркетинг и реклама', skill_image: '' },
        { skill_id: 'bus_006', skill_name: 'Тайм-менеджмент', skill_image: '' },
        { skill_id: 'bus_008', skill_name: 'Предпринимательство', skill_image: '' },
      ],
    },
    {
      category: 'Творчество и искусство',
      skills: [
        { skill_id: 'art_001', skill_name: 'Рисование и иллюстрация', skill_image: '' },
        { skill_id: 'art_002', skill_name: 'Фотография', skill_image: '' },
        { skill_id: 'art_004', skill_name: 'Музыка и звук', skill_image: '' },
      ],
    },
    {
      category: 'Иностранные языки',
      skills: [
        { skill_id: 'lang_001', skill_name: 'Английский', skill_image: '' },
        { skill_id: 'lang_002', skill_name: 'Французский', skill_image: '' },
        { skill_id: 'lang_003', skill_name: 'Испанский', skill_image: '' },
      ],
    },
    {
      category: 'Образование и развитие',
      skills: [
        { skill_id: 'edu_001', skill_name: 'Личностное развитие', skill_image: '' },
        { skill_id: 'edu_002', skill_name: 'Навыки обучения', skill_image: '' },
      ],
    },
    {
      category: 'Дом и уют',
      skills: [
        { skill_id: 'home_001', skill_name: 'Уборка и организация', skill_image: '' },
        { skill_id: 'home_003', skill_name: 'Приготовление еды', skill_image: '' },
      ],
    },
    {
      category: 'Здоровье и образ жизни',
      skills: [
        { skill_id: 'hlth_001', skill_name: 'Йога и медитация', skill_image: '' },
        { skill_id: 'hlth_002', skill_name: 'Питание и ЗОЖ', skill_image: '' },
      ],
    },
  ],
};

// Временные мок-данные для пользователей и их навыков
const MOCK_USERS_DATA: SkillCardProps[] = [
  {
    user: {
      id: 'user1',
      name: 'Иван',
      email: 'ivanivan@mail.ru',
      avatar: 'db/avatars/ivan.png',
      bio: 'Санкт-Петербург, 34 года',
      skills: [],
      createdAt: '2023-01-15',
    },
    teachingSkills: [
      {
        id: 'art_004',
        title: 'Игра на барабанах',
        description: 'Научу играть на барабанах',
        type: 'teaching',
        category: 'art',
        authorId: 'user1',
        createdAt: '2023-01-15',
      },
    ],
    learningSkills: [
      {
        id: 'bus_006',
        title: 'Тайм-менеджмент',
        description: 'Хочу научиться управлять временем',
        type: 'learning',
        category: 'business',
        authorId: 'user1',
        createdAt: '2023-01-15',
      },
      {
        id: 'hlth_001',
        title: 'Медитация',
        description: 'Интересуюсь медитацией',
        type: 'learning',
        category: 'health',
        authorId: 'user1',
        createdAt: '2023-01-15',
      },
    ],
    onDetailsClick: () => console.log('Details clicked for Иван'),
    onLikeClick: () => console.log('Like clicked for Иван'),
    isLiked: false,
  },
  {
    user: {
      id: 'user2',
      name: 'Анна',
      email: 'anna.english@mail.ru',
      avatar: 'db/avatars/anna.png',
      bio: 'Казань, 26 лет',
      skills: [],
      createdAt: '2023-02-20',
    },
    teachingSkills: [
      {
        id: 'lang_001',
        title: 'Английский язык',
        description: 'Преподаю английский',
        type: 'teaching',
        category: 'languages',
        authorId: 'user2',
        createdAt: '2023-02-20',
      },
    ],
    learningSkills: [
      {
        id: 'bus_006',
        title: 'Тайм-менеджмент',
        description: 'Хочу научиться управлять временем',
        type: 'learning',
        category: 'business',
        authorId: 'user2',
        createdAt: '2023-02-20',
      },
      {
        id: 'hlth_001',
        title: 'Медитация',
        description: 'Интересуюсь медитацией',
        type: 'learning',
        category: 'health',
        authorId: 'user2',
        createdAt: '2023-02-20',
      },
    ],
    onDetailsClick: () => console.log('Details clicked for Анна'),
    onLikeClick: () => console.log('Like clicked for Анна'),
    isLiked: false,
  },
  {
    user: {
      id: 'user3',
      name: 'Максим',
      email: 'maxim.business@mail.ru',
      avatar: 'db/avatars/maxim_new.png',
      bio: 'Москва, 23 года',
      skills: [],
      createdAt: '2023-03-10',
    },
    teachingSkills: [
      {
        id: 'bus_008',
        title: 'Бизнес-план',
        description: 'Помогу создать бизнес-план',
        type: 'teaching',
        category: 'business',
        authorId: 'user3',
        createdAt: '2023-03-10',
      },
    ],
    learningSkills: [
      {
        id: 'bus_006',
        title: 'Тайм-менеджмент',
        description: 'Хочу научиться управлять временем',
        type: 'learning',
        category: 'business',
        authorId: 'user3',
        createdAt: '2023-03-10',
      },
      {
        id: 'hlth_001',
        title: 'Медитация',
        description: 'Интересуюсь медитацией',
        type: 'learning',
        category: 'health',
        authorId: 'user3',
        createdAt: '2023-03-10',
      },
    ],
    onDetailsClick: () => console.log('Details clicked for Максим'),
    onLikeClick: () => console.log('Like clicked for Максим'),
    isLiked: false,
  },
  {
    user: {
      id: 'user4',
      name: 'Илона',
      email: 'ilona.english@mail.ru',
      avatar: 'db/avatars/ilona.png',
      bio: 'Екатеринбург, 33 года',
      skills: [],
      createdAt: '2024-03-15',
    },
    teachingSkills: [
      {
        id: 'lang_001',
        title: 'Английский язык',
        description: 'Преподаю английский',
        type: 'teaching',
        category: 'languages',
        authorId: 'user4',
        createdAt: '2024-03-15',
      },
    ],
    learningSkills: [
      {
        id: 'bus_006',
        title: 'Тайм-менеджмент',
        description: 'Хочу научиться управлять временем',
        type: 'learning',
        category: 'business',
        authorId: 'user4',
        createdAt: '2024-03-15',
      },
      {
        id: 'hlth_001',
        title: 'Медитация',
        description: 'Интересуюсь медитацией',
        type: 'learning',
        category: 'health',
        authorId: 'user4',
        createdAt: '2024-03-15',
      },
    ],
    onDetailsClick: () => console.log('Details clicked for Илона'),
    onLikeClick: () => console.log('Like clicked for Илона'),
    isLiked: false,
  },
  {
    user: {
      id: 'user5',
      name: 'Михаил',
      email: 'mikhail.english@mail.ru',
      avatar: 'db/avatars/mikhail.png',
      bio: 'Новосибирск, 29 лет',
      skills: [],
      createdAt: '2024-07-10',
    },
    teachingSkills: [
      {
        id: 'lang_001',
        title: 'Английский язык',
        description: 'Преподаю английский',
        type: 'teaching',
        category: 'languages',
        authorId: 'user5',
        createdAt: '2024-07-10',
      },
    ],
    learningSkills: [
      {
        id: 'bus_006',
        title: 'Тайм-менеджмент',
        description: 'Хочу научиться управлять временем',
        type: 'learning',
        category: 'business',
        authorId: 'user5',
        createdAt: '2024-07-10',
      },
      {
        id: 'hlth_001',
        title: 'Медитация',
        description: 'Интересуюсь медитацией',
        type: 'learning',
        category: 'health',
        authorId: 'user5',
        createdAt: '2024-07-10',
      },
    ],
    onDetailsClick: () => console.log('Details clicked for Михаил'),
    onLikeClick: () => console.log('Like clicked for Михаил'),
    isLiked: false,
  },
  {
    user: {
      id: 'user6',
      name: 'Мария',
      email: 'maria.english@mail.ru',
      avatar: 'db/avatars/maria_new.png',
      bio: 'Краснодар, 21 год',
      skills: [],
      createdAt: '2025-03-10',
    },
    teachingSkills: [
      {
        id: 'lang_001',
        title: 'Английский язык',
        description: 'Преподаю английский',
        type: 'teaching',
        category: 'languages',
        authorId: 'user6',
        createdAt: '2025-03-10',
      },
    ],
    learningSkills: [
      {
        id: 'bus_006',
        title: 'Тайм-менеджмент',
        description: 'Хочу научиться управлять временем',
        type: 'learning',
        category: 'business',
        authorId: 'user6',
        createdAt: '2025-03-10',
      },
      {
        id: 'hlth_001',
        title: 'Медитация',
        description: 'Интересуюсь медитацией',
        type: 'learning',
        category: 'health',
        authorId: 'user6',
        createdAt: '2025-03-10',
      },
    ],
    onDetailsClick: () => console.log('Details clicked for Мария'),
    onLikeClick: () => console.log('Like clicked for Мария'),
    isLiked: false,
  },
  {
    user: {
      id: 'user7',
      name: 'Виктория',
      email: 'victoria.drums@mail.ru',
      avatar: 'db/avatars/victoria_kemerovo.png',
      bio: 'Кемерово, 30 лет',
      skills: [],
      createdAt: '2025-04-09',
    },
    teachingSkills: [
      {
        id: 'art_004',
        title: 'Игра на барабанах',
        description: 'Научу играть на барабанах',
        type: 'teaching',
        category: 'art',
        authorId: 'user7',
        createdAt: '2025-04-09',
      },
    ],
    learningSkills: [
      {
        id: 'bus_006',
        title: 'Тайм-менеджмент',
        description: 'Хочу научиться управлять временем',
        type: 'learning',
        category: 'business',
        authorId: 'user7',
        createdAt: '2025-04-09',
      },
      {
        id: 'hlth_001',
        title: 'Медитация',
        description: 'Интересуюсь медитацией',
        type: 'learning',
        category: 'health',
        authorId: 'user7',
        createdAt: '2025-04-09',
      },
    ],
    onDetailsClick: () => console.log('Details clicked for Виктория'),
    onLikeClick: () => console.log('Like clicked for Виктория'),
    isLiked: false,
  },
  {
    user: {
      id: 'user8',
      name: 'Елизавета',
      email: 'elizaveta.drums@mail.ru',
      avatar: 'db/avatars/elizaveta.png',
      bio: 'Владивосток, 25 лет',
      skills: [],
      createdAt: '2023-02-05',
    },
    teachingSkills: [
      {
        id: 'art_004',
        title: 'Игра на барабанах',
        description: 'Научу играть на барабанах',
        type: 'teaching',
        category: 'art',
        authorId: 'user8',
        createdAt: '2023-02-05',
      },
    ],
    learningSkills: [
      {
        id: 'bus_006',
        title: 'Тайм-менеджмент',
        description: 'Хочу научиться управлять временем',
        type: 'learning',
        category: 'business',
        authorId: 'user8',
        createdAt: '2023-02-05',
      },
      {
        id: 'hlth_001',
        title: 'Медитация',
        description: 'Интересуюсь медитацией',
        type: 'learning',
        category: 'health',
        authorId: 'user8',
        createdAt: '2023-02-05',
      },
    ],
    onDetailsClick: () => console.log('Details clicked for Елизавета'),
    onLikeClick: () => console.log('Like clicked for Елизавета'),
    isLiked: false,
  },
  {
    user: {
      id: 'user9',
      name: 'Виктория',
      email: 'victoria.sochi@mail.ru',
      avatar: 'db/avatars/victoria_sochi.png',
      bio: 'Сочи, 31 год',
      skills: [],
      createdAt: '2024-05-10',
    },
    teachingSkills: [
      {
        id: 'art_004',
        title: 'Игра на барабанах',
        description: 'Научу играть на барабанах',
        type: 'teaching',
        category: 'art',
        authorId: 'user9',
        createdAt: '2024-05-10',
      },
    ],
    learningSkills: [
      {
        id: 'bus_006',
        title: 'Тайм-менеджмент',
        description: 'Хочу научиться управлять временем',
        type: 'learning',
        category: 'business',
        authorId: 'user9',
        createdAt: '2024-05-10',
      },
      {
        id: 'hlth_001',
        title: 'Медитация',
        description: 'Интересуюсь медитацией',
        type: 'learning',
        category: 'health',
        authorId: 'user9',
        createdAt: '2024-05-10',
      },
    ],
    onDetailsClick: () => console.log('Details clicked for Виктория'),
    onLikeClick: () => console.log('Like clicked for Виктория'),
    isLiked: false,
  },
  {
    user: {
      id: 'user10',
      name: 'Елена',
      email: 'elena.drums@mail.ru',
      avatar: 'db/avatars/elena_krasnoyarsk.png',
      bio: 'Красноярск, 28 лет',
      skills: [],
      createdAt: '2023-01-10',
    },
    teachingSkills: [
      {
        id: 'art_004',
        title: 'Игра на барабанах',
        description: 'Научу играть на барабанах',
        type: 'teaching',
        category: 'art',
        authorId: 'user10',
        createdAt: '2023-01-10',
      },
    ],
    learningSkills: [
      {
        id: 'bus_006',
        title: 'Тайм-менеджмент',
        description: 'Хочу научиться управлять временем',
        type: 'learning',
        category: 'business',
        authorId: 'user10',
        createdAt: '2023-01-10',
      },
      {
        id: 'hlth_001',
        title: 'Медитация',
        description: 'Интересуюсь медитацией',
        type: 'learning',
        category: 'health',
        authorId: 'user10',
        createdAt: '2023-01-10',
      },
    ],
    onDetailsClick: () => console.log('Details clicked for Елена'),
    onLikeClick: () => console.log('Like clicked for Елена'),
    isLiked: false,
  },
  {
    user: {
      id: 'user11',
      name: 'Константин',
      email: 'konstantin.drums@mail.ru',
      avatar: 'db/avatars/konstantin.png',
      bio: 'Иркутск, 36 лет',
      skills: [],
      createdAt: '2024-03-23',
    },
    teachingSkills: [
      {
        id: 'art_004',
        title: 'Игра на барабанах',
        description: 'Научу играть на барабанах',
        type: 'teaching',
        category: 'art',
        authorId: 'user11',
        createdAt: '2024-03-23',
      },
    ],
    learningSkills: [
      {
        id: 'bus_006',
        title: 'Тайм-менеджмент',
        description: 'Хочу научиться управлять временем',
        type: 'learning',
        category: 'business',
        authorId: 'user11',
        createdAt: '2024-03-23',
      },
      {
        id: 'hlth_001',
        title: 'Медитация',
        description: 'Интересуюсь медитацией',
        type: 'learning',
        category: 'health',
        authorId: 'user11',
        createdAt: '2024-03-23',
      },
    ],
    onDetailsClick: () => console.log('Details clicked for Константин'),
    onLikeClick: () => console.log('Like clicked for Константин'),
    isLiked: false,
  },
  {
    user: {
      id: 'user12',
      name: 'София',
      email: 'sofia.drums@mail.ru',
      avatar: 'db/avatars/sofia.png',
      bio: 'Абакан, 24 года',
      skills: [],
      createdAt: '2025-03-12',
    },
    teachingSkills: [
      {
        id: 'art_004',
        title: 'Игра на барабанах',
        description: 'Научу играть на барабанах',
        type: 'teaching',
        category: 'art',
        authorId: 'user12',
        createdAt: '2025-03-12',
      },
    ],
    learningSkills: [
      {
        id: 'bus_006',
        title: 'Тайм-менеджмент',
        description: 'Хочу научиться управлять временем',
        type: 'learning',
        category: 'business',
        authorId: 'user12',
        createdAt: '2025-03-12',
      },
      {
        id: 'hlth_001',
        title: 'Медитация',
        description: 'Интересуюсь медитацией',
        type: 'learning',
        category: 'health',
        authorId: 'user12',
        createdAt: '2025-03-12',
      },
    ],
    onDetailsClick: () => console.log('Details clicked for София'),
    onLikeClick: () => console.log('Like clicked for София'),
    isLiked: false,
  },
  {
    user: {
      id: 'user13',
      name: 'Екатерина',
      email: 'ekaterina.drums@mail.ru',
      avatar: 'db/avatars/ekaterina.png',
      bio: 'Пермь, 33 года',
      skills: [],
      createdAt: '2024-03-24',
    },
    teachingSkills: [
      {
        id: 'art_004',
        title: 'Игра на барабанах',
        description: 'Научу играть на барабанах',
        type: 'teaching',
        category: 'art',
        authorId: 'user13',
        createdAt: '2024-03-24',
      },
    ],
    learningSkills: [
      {
        id: 'bus_006',
        title: 'Тайм-менеджмент',
        description: 'Хочу научиться управлять временем',
        type: 'learning',
        category: 'business',
        authorId: 'user13',
        createdAt: '2024-03-24',
      },
      {
        id: 'hlth_001',
        title: 'Медитация',
        description: 'Интересуюсь медитацией',
        type: 'learning',
        category: 'health',
        authorId: 'user13',
        createdAt: '2024-03-24',
      },
    ],
    onDetailsClick: () => console.log('Details clicked for Екатерина'),
    onLikeClick: () => console.log('Like clicked for Екатерина'),
    isLiked: false,
  },
  {
    user: {
      id: 'user14',
      name: 'Дарья',
      email: 'darya.drums@mail.ru',
      avatar: 'db/avatars/darya.png',
      bio: 'Ярославль, 26 лет',
      skills: [],
      createdAt: '2025-06-10',
    },
    teachingSkills: [
      {
        id: 'art_004',
        title: 'Игра на барабанах',
        description: 'Научу играть на барабанах',
        type: 'teaching',
        category: 'art',
        authorId: 'user14',
        createdAt: '2025-06-10',
      },
    ],
    learningSkills: [
      {
        id: 'bus_006',
        title: 'Тайм-менеджмент',
        description: 'Хочу научиться управлять временем',
        type: 'learning',
        category: 'business',
        authorId: 'user14',
        createdAt: '2025-06-10',
      },
      {
        id: 'hlth_001',
        title: 'Медитация',
        description: 'Интересуюсь медитацией',
        type: 'learning',
        category: 'health',
        authorId: 'user14',
        createdAt: '2025-06-10',
      },
    ],
    onDetailsClick: () => console.log('Details clicked for Дарья'),
    onLikeClick: () => console.log('Like clicked for Дарья'),
    isLiked: false,
  },
  {
    user: {
      id: 'user15',
      name: 'Алла',
      email: 'alla.drums@mail.ru',
      avatar: 'db/avatars/alla.png',
      bio: 'Архангельск, 22 года',
      skills: [],
      createdAt: '2025-08-08',
    },
    teachingSkills: [
      {
        id: 'art_004',
        title: 'Игра на барабанах',
        description: 'Научу играть на барабанах',
        type: 'teaching',
        category: 'art',
        authorId: 'user15',
        createdAt: '2025-08-08',
      },
    ],
    learningSkills: [
      {
        id: 'bus_006',
        title: 'Тайм-менеджмент',
        description: 'Хочу научиться управлять временем',
        type: 'learning',
        category: 'business',
        authorId: 'user15',
        createdAt: '2025-08-08',
      },
      {
        id: 'hlth_001',
        title: 'Медитация',
        description: 'Интересуюсь медитацией',
        type: 'learning',
        category: 'health',
        authorId: 'user15',
        createdAt: '2025-08-08',
      },
    ],
    onDetailsClick: () => console.log('Details clicked for Алла'),
    onLikeClick: () => console.log('Like clicked for Алла'),
    isLiked: false,
  },
];

export default function HomePage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();

  // Redux селекторы
  const searchQuery = useAppSelector(getSearchQuery);
  const loading = useAppSelector(getSkillsLoading);

  // Локальное состояние для бесконечного скролла
  const [displayedRecommendedCount, setDisplayedRecommendedCount] = useState(9);
  const [hasMoreRecommended, setHasMoreRecommended] = useState(true);

  // Состояние фильтров
  const [appliedFilters, setAppliedFilters] = useState<FilterPayload | null>(null);

  // Режим поиска
  const searchFromUrl = searchParams.get('search') || '';
  const isSearching = searchFromUrl.trim().length > 0;

  // Синхронизация URL параметра поиска с Redux
  useEffect(() => {
    if (searchFromUrl !== searchQuery) {
      dispatch(setSearchQuery(searchFromUrl));
      dispatch(filterSkills());
    }
  }, [searchFromUrl, searchQuery, dispatch]);

  // Загрузка навыков при монтировании (можно будет использовать после готовности API)
  useEffect(() => {
    // dispatch(fetchSkills());
  }, [dispatch]);

  // Обработчик изменения фильтров
  const handleFiltersChange = useCallback((filters: FilterPayload) => {
    setAppliedFilters(filters);
    console.log('Filters applied:', filters);
    // TODO: применить фильтры к данным после готовности API
  }, []);

  // Обработчики для CardSection
  const handleViewAllPopular = useCallback(() => {
    navigate('/search?sort=popular');
  }, [navigate]);

  const handleViewAllNew = useCallback(() => {
    navigate('/search?sort=new');
  }, [navigate]);

  // Обработчик для бесконечного скролла
  const handleLoadMoreRecommended = useCallback(() => {
    if (displayedRecommendedCount >= MOCK_USERS_DATA.length) {
      setHasMoreRecommended(false);
      return;
    }

    // Имитация загрузки
    setTimeout(() => {
      setDisplayedRecommendedCount((prev) => Math.min(prev + 9, MOCK_USERS_DATA.length));
    }, 500);
  }, [displayedRecommendedCount]);

  // Данные для отображения
  const popularCards = MOCK_USERS_DATA.slice(0, 3); // Первые 3
  const newCards = MOCK_USERS_DATA.slice(3, 6); // Следующие 3
  const recommendedCards = MOCK_USERS_DATA.slice(0, displayedRecommendedCount);

  // Для поиска - фильтруем по имени или навыкам
  const searchResultCards = isSearching
    ? MOCK_USERS_DATA.filter(
        (card) =>
          card.user.name.toLowerCase().includes(searchFromUrl.toLowerCase()) ||
          card.teachingSkills.some((skill) =>
            skill.title.toLowerCase().includes(searchFromUrl.toLowerCase())
          ) ||
          card.learningSkills.some((skill) =>
            skill.title.toLowerCase().includes(searchFromUrl.toLowerCase())
          )
      )
    : [];

  // Режим поиска - отображаем только результаты
  if (isSearching) {
    return (
      <div className={styles.container}>
        <aside className={styles.sidebar}>
          <FilterSideBar skillsCatalog={MOCK_SKILLS_CATALOG} onChange={handleFiltersChange} />
        </aside>
        <main className={styles.content}>
          <div className={styles.searchResults}>
            <TitleUI size="large" className={styles.searchTitle}>
              Подходящие предложения: {searchResultCards.length}
            </TitleUI>
            <InfiniteGridUI
              hasMore={false}
              loading={false}
              columns={{ mobile: 1, tablet: 2, desktop: 3 }}
              gap="24px"
              className={styles.searchGrid}
            >
              {searchResultCards.map((card) => (
                <SkillCard
                  key={card.user.id}
                  user={card.user}
                  teachingSkills={card.teachingSkills}
                  learningSkills={card.learningSkills}
                  onDetailsClick={card.onDetailsClick}
                  onLikeClick={card.onLikeClick}
                  isLiked={card.isLiked}
                />
              ))}
            </InfiniteGridUI>
          </div>
        </main>
      </div>
    );
  }

  // Обычный режим - отображаем все блоки
  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <FilterSideBar skillsCatalog={MOCK_SKILLS_CATALOG} onChange={handleFiltersChange} />
      </aside>
      <main className={styles.content}>
        {/* Блок "Популярное" */}
        <CardSectionUI
          title="Популярное"
          cards={popularCards}
          onLookClick={handleViewAllPopular}
          maxCards={3}
          showButton={true}
        />

        {/* Блок "Новое" */}
        <CardSectionUI
          title="Новое"
          cards={newCards}
          onLookClick={handleViewAllNew}
          maxCards={3}
          showButton={true}
          className={styles.newSection}
        />

        {/* Блок "Рекомендуем" с бесконечным скроллом */}
        <section className={styles.recommendedSection}>
          <TitleUI size="large" className={styles.sectionTitle}>
            Рекомендуем
          </TitleUI>
          <InfiniteGridUI
            onLoadMore={handleLoadMoreRecommended}
            hasMore={hasMoreRecommended}
            loading={loading}
            columns={{ mobile: 1, tablet: 2, desktop: 3 }}
            gap="24px"
          >
            {recommendedCards.map((card) => (
              <SkillCard
                key={card.user.id}
                user={card.user}
                teachingSkills={card.teachingSkills}
                learningSkills={card.learningSkills}
                onDetailsClick={card.onDetailsClick}
                onLikeClick={card.onLikeClick}
                isLiked={card.isLiked}
              />
            ))}
          </InfiniteGridUI>
        </section>
      </main>
    </div>
  );
}
