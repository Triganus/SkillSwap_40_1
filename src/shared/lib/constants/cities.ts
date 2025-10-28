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

/**
 * Типы
 */
export type City = (typeof CITIES)[number];

/**
 * Валидация
 */
export const isValidCity = (city: string): city is City => {
  return CITIES.includes(city as City);
};
