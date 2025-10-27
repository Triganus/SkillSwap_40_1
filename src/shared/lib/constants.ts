/**
 * Константы для категорий навыков
 */
export const SKILL_CATEGORIES = [
  'Бизнес и карьера',
  'Творчество и искусство',
  'Иностранные языки',
  'Образование и развитие',
  'Дом и уют',
  'Здоровье и образ жизни',
] as const;

export type SkillCategory = (typeof SKILL_CATEGORIES)[number];

/**
 * Константы для городов
 */
export const CITIES = [
  'Москва',
  'Санкт-Петербург',
  'Казань',
  'Екатеринбург',
  'Новосибирск',
  'Краснодар',
  'Кемерово',
  'Владивосток',
  'Сочи',
  'Красноярск',
  'Иркутск',
  'Абакан',
  'Пермь',
  'Ярославль',
  'Архангельск',
] as const;

export type City = (typeof CITIES)[number];

/**
 * Константы для гендера
 */
export const GENDERS = ['мужской', 'женский'] as const;

export type Gender = (typeof GENDERS)[number];

/**
 * Вспомогательные функции для валидации
 */
export const isValidSkillCategory = (category: string): category is SkillCategory => {
  return SKILL_CATEGORIES.includes(category as SkillCategory);
};

export const isValidCity = (city: string): city is City => {
  return CITIES.includes(city as City);
};

export const isValidGender = (gender: string): gender is Gender => {
  return GENDERS.includes(gender as Gender);
};

