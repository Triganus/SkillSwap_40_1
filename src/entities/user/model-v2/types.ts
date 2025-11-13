import type { EntityState } from '@reduxjs/toolkit';

/**
 * Базовые типы для Gender и SearchType
 * Используем string literal types вместо enum для erasableSyntaxOnly
 */
export type Gender = 'male' | 'female' | 'not_specified';
export type SearchType = 'all' | 'want_to_learn' | 'can_teach';

// Константы для удобного использования (с префиксом чтобы избежать конфликта)
export const GenderValue = {
  MALE: 'male' as const,
  FEMALE: 'female' as const,
  NOT_SPECIFIED: 'not_specified' as const,
};

export const SearchTypeValue = {
  ALL: 'all' as const,
  WANT_TO_LEARN: 'want_to_learn' as const,
  CAN_TEACH: 'can_teach' as const,
};

/**
 * 1.1. UserRegistrationData
 * Данные для регистрации нового пользователя
 */
export interface UserRegistrationData {
  email: string;
  password: string;
  name: string;
  birthDate: string; // ISO format
  gender: Gender;
  cityId: string; // ID города из справочника
  avatar: File | null;
  learnCategoryIds: string[];
  learnSubcategoryIds: string[];
}

/**
 * 1.2. UserListItem
 * Компактная модель пользователя для отображения в каталоге
 */
export interface UserListItem {
  id: string;
  name: string;
  cityId: string; // ID города из справочника
  age: number;
  gender: Gender;
  avatar: string | null;
  canTeachSkills: string[]; // Массив названий навыков, которым может научить
  wantsToLearnSkills: string[]; // Массив названий навыков, которым хочет научиться
  createdAt: number; // timestamp для сортировки
  // Информация о первом навыке для лайков
  primarySkillId?: string; // ID первого навыка для обучения
  primarySkillLikesCount?: number; // Количество лайков первого навыка
  isLikedByCurrentUser?: boolean; // Лайкнул ли текущий пользователь этот навык
}

/**
 * UserListItemWithMatches
 * UserListItem с вычисляемым полем matchedSkills (через селектор)
 */
export interface UserListItemWithMatches extends UserListItem {
  matchedSkills: string[]; // Вычисляется в зависимости от searchType
}

/**
 * TeachingSkill - ОТДЕЛЬНАЯ сущность навыка (не входит в UserProfile!)
 * Содержит ВСЕ данные о навыке, которые вводятся на 3-м шаге регистрации
 * Связь с пользователем через userId
 */
export interface TeachingSkill {
  id: string; // Уникальный ID навыка
  userId: string; // ID пользователя-владельца
  title: string; // Название навыка (вводится пользователем)
  description: string; // Описание навыка (НЕ bio профиля!)
  categoryId: string; // ID категории из справочника
  subcategoryId: string; // ID подкатегории из справочника
  images: string[]; // Массив URL изображений навыка
  createdAt: string; // Дата создания
  likesCount: number; // Количество лайков
  likedByUserIds: string[]; // Массив ID пользователей, которые лайкнули
}

/**
 * UserProfile - данные пользователя
 * canTeachSkills и wantsToLearnSkills - только ID подкатегорий из справочника!
 */
export interface UserProfile {
  id: string;
  name: string;
  cityId: string;
  age: number;
  gender: Gender;
  avatar: string | null;
  bio: string; // Описание ПРОФИЛЯ пользователя
  canTeachSkills: string[]; // Массив ID подкатегорий, которым может научить
  wantsToLearnSkills: string[]; // Массив ID подкатегорий для изучения
  likedSkillIds: string[];
}

/**
 * 1.4. AuthUser
 * Данные авторизованного пользователя
 */
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatar: string | null;
  token: string;
}

/**
 * 1.5. AuthState
 * Состояние аутентификации
 */
export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

/**
 * UsersState
 * Состояние для управления пользователями
 */
export interface UsersState {
  listItems: EntityState<UserListItem, string>; // Нормализованное хранилище для каталога
  profiles: EntityState<UserProfile, string>; // Нормализованное хранилище для профилей
  loading: boolean;
  error: string | null;
  total: number;
  popularIds?: string[]; // топ популярных
  newIds?: string[]; // топ новых
  // TODO: Для совместимости со старым кодом HomePage - будет удалено после рефакторинга
  // Используем any чтобы избежать циклических зависимостей с SkillCardProps
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  skillCards?: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  popularCards?: any[]; // Топ-3 популярных для блока "Популярное"
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  newCards?: any[]; // Топ-3 новых для блока "Новое"
}
