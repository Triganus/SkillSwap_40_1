import { store } from '@/app/store';
import { selectAllCategories, selectAllSubcategories, selectAllCities, selectAllGenders } from '../model/selectors';
import type { Category, Subcategory, City, Gender } from '../model/types';

/**
 * Получает категории из Redux store синхронно
 * @returns Массив категорий
 */
export function getCategoriesFromStore(): Category[] {
  const state = store.getState();
  return selectAllCategories(state);
}

/**
 * Получает подкатегории из Redux store синхронно
 * @returns Массив подкатегорий
 */
export function getSubcategoriesFromStore(): Subcategory[] {
  const state = store.getState();
  return selectAllSubcategories(state);
}

/**
 * Получает города из Redux store синхронно
 * @returns Массив городов
 */
export function getCitiesFromStore(): City[] {
  const state = store.getState();
  return selectAllCities(state);
}

/**
 * Получает пола из Redux store синхронно
 * @returns Массив полов
 */
export function getGendersFromStore(): Gender[] {
  const state = store.getState();
  return selectAllGenders(state);
}

