/**
 * Конфигурация цветов и иконок для категорий навыков
 */

import { SKILL_CATEGORIES } from './skillCategories';

export interface CategoryConfig {
  color: string; // CSS переменная для цвета
  iconName: string;
}

/**
 * Маппинг категорий на их конфигурацию (цвет и иконка)
 * Использует приглушенные цвета из CSS переменных темы
 */
const CATEGORY_CONFIGS: Record<string, CategoryConfig> = {
  'Бизнес и карьера': {
    color: 'var(--tag-business, #eee7f7)', // приглушенный фиолетовый
    iconName: 'briefcase',
  },
  'Иностранные языки': {
    color: 'var(--tag-languages, #e8e5c5)', // приглушенный бежевый
    iconName: 'global',
  },
  'Дом и уют': {
    color: 'var(--tag-home, #f7ebf5)', // приглушенный розовый
    iconName: 'home',
  },
  'Творчество и искусство': {
    color: 'var(--tag-art, #f7e7f2)', // приглушенный розовый
    iconName: 'palette',
  },
  'Образование и развитие': {
    color: 'var(--tag-education, #e7f2f6)', // приглушенный голубой
    iconName: 'book',
  },
  'Здоровье и образ жизни': {
    color: 'var(--tag-health, #e9f7e7)', // приглушенный зеленый
    iconName: 'lifestyle',
  },
};

// Проверяем, что все категории из skillCategories имеют конфигурацию
Object.keys(SKILL_CATEGORIES).forEach((category) => {
  if (!CATEGORY_CONFIGS[category]) {
    console.warn(`Category "${category}" has no color/icon configuration`);
  }
});

/**
 * Получить конфигурацию категории по её названию
 * @param categoryName - название категории
 * @returns конфигурация категории или null, если категория не найдена
 */
export function getCategoryConfigByName(categoryName: string): CategoryConfig | null {
  return CATEGORY_CONFIGS[categoryName] || null;
}

/**
 * Получить цвет категории по её названию
 * @param categoryName - название категории
 * @returns цвет категории или null, если категория не найдена
 */
export function getCategoryColor(categoryName: string): string | null {
  const config = getCategoryConfigByName(categoryName);
  return config?.color || null;
}

/**
 * Получить название иконки категории по её названию
 * @param categoryName - название категории
 * @returns название иконки или null, если категория не найдена
 */
export function getCategoryIconName(categoryName: string): string | null {
  const config = getCategoryConfigByName(categoryName);
  return config?.iconName || null;
}
