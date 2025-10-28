/**
 * Центральная точка экспорта всех констант
 */

// Категории навыков
export {
  SKILL_CATEGORIES,
  getAllCategories,
  getSkillsByCategory,
  isSkillInCategory,
  getAllSkills,
  isValidSkillCategory,
  isValidSkillName,
} from './skillCategories';

export type { SkillCategoryName, SkillName } from './skillCategories';

// Города
export { CITIES, isValidCity } from './cities';
export type { City } from './cities';

// Гендер
export { GENDER_OPTIONS, isValidGender } from './gender';
export type { GenderValue, Gender } from './gender';
