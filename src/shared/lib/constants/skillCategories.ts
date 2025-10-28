/**
 * Константы для категорий навыков и их списков
 */
export const SKILL_CATEGORIES: Record<string, string[]> = {
  'Бизнес и карьера': [
    'Управление командой',
    'Маркетинг и реклама',
    'Продажи и переговоры',
    'Личный бренд',
    'Резюме и собеседование',
    'Тайм-менеджмент',
    'Проектное управление',
    'Предпринимательство',
  ],
  'Творчество и искусство': [
    'Рисование и живопись',
    'Графический дизайн',
    'Фотография',
    'Видеомонтаж',
    'Музыка и вокал',
    'Танцы',
    'Писательское мастерство',
    'Рукоделие',
  ],
  'Иностранные языки': [
    'Английский',
    'Французский',
    'Испанский',
    'Немецкий',
    'Китайский',
    'Японский',
    'Итальянский',
    'Подготовка к экзаменам',
  ],
  'Образование и развитие': [
    'Репетиторство математика',
    'Репетиторство русский язык',
    'Подготовка к ЕГЭ',
    'Программирование',
    'Веб-разработка',
    'Аналитика данных',
    'Ораторское мастерство',
    'Скорочтение',
  ],
  'Дом и уют': [
    'Ремонт и отделка',
    'Дизайн интерьера',
    'Кулинария',
    'Выпечка',
    'Садоводство',
    'Уход за растениями',
    'Организация пространства',
    'Рукоделие для дома',
  ],
  'Здоровье и образ жизни': [
    'Йога',
    'Фитнес и тренировки',
    'Правильное питание',
    'Медитация',
    'Массаж',
    'Растяжка',
    'Бег и кардио',
    'Психология и самопознание',
  ],
};

/**
 * Типы
 */

// Тип для названия категории (строка)
export type SkillCategoryName = keyof typeof SKILL_CATEGORIES;

// Тип для названия навыка (строка)
export type SkillName = (typeof SKILL_CATEGORIES)[SkillCategoryName][number];

/**
 * Вспомогательные функции
 */

/**
 * Получить список всех категорий
 */
export const getAllCategories = (): string[] => {
  return Object.keys(SKILL_CATEGORIES);
};

/**
 * Получить список навыков для конкретной категории
 */
export const getSkillsByCategory = (category: string): string[] => {
  return SKILL_CATEGORIES[category] || [];
};

/**
 * Проверить, существует ли навык в указанной категории
 */
export const isSkillInCategory = (skill: string, category: string): boolean => {
  const skills = SKILL_CATEGORIES[category];
  return skills ? skills.includes(skill) : false;
};

/**
 * Получить плоский список всех навыков из всех категорий
 */
export const getAllSkills = (): string[] => {
  return Object.values(SKILL_CATEGORIES).flat();
};

/**
 * Валидация
 */

export const isValidSkillCategory = (category: string): category is SkillCategoryName => {
  return category in SKILL_CATEGORIES;
};

export const isValidSkillName = (skillName: string): skillName is SkillName => {
  return Object.values(SKILL_CATEGORIES).some((skills) => skills.includes(skillName));
};
