import type { TagCategory } from '@/shared/ui/Tag';

/**
 * маппинг человекочитаемых названий категорий -> TagCategory
 */
export const categoryToTagCategory: Record<string, TagCategory> = {
  'Бизнес и карьера': 'business',
  'Творчество и искусство': 'art',
  'Иностранные языки': 'languages',
  'Образование и развитие': 'education',
  'Дом и уют': 'home',
  'Здоровье и образ жизни': 'health',
  Прочее: 'other',
};

/**
 * обратный маппинг: TagCategory -> человекочитаемые названия категорий
 */
export const tagCategoryToLabel: Record<TagCategory, string> = {
  business: 'Бизнес и карьера',
  art: 'Творчество и искусство',
  languages: 'Иностранные языки',
  education: 'Образование и развитие',
  home: 'Дом и уют',
  health: 'Здоровье и образ жизни',
  other: 'Прочее',
};

/**
 * преобразование строки категории из skills.json в TagCategory
 */
export const mapCategoryToTag = (categoryName: string): TagCategory => {
  return categoryToTagCategory[categoryName] ?? 'other';
};
