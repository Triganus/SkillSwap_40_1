/**
 * Константы для гендера
 */
export const GENDER_OPTIONS = [
  { label: 'Не указан', value: '' },
  { label: 'Мужской', value: 'Мужской' },
  { label: 'Женский', value: 'Женский' },
] as const;

/**
 * Типы
 */

// Тип для значения гендера в фильтрах и формах
export type GenderValue = (typeof GENDER_OPTIONS)[number]['value']; // '' | 'Мужской' | 'Женский'

// Алиас для обратной совместимости
export type Gender = GenderValue;

/**
 * Валидация
 */
export const isValidGender = (gender: string): gender is GenderValue => {
  return GENDER_OPTIONS.some((option) => option.value === gender);
};
