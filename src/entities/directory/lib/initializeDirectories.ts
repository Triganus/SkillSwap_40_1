import type { AppDispatch } from '@/app/store';
import { fetchCategories, fetchSubcategories, fetchCities, fetchGenders } from '../model';

let directoriesInitialized = false;

/**
 * Инициализация справочников.
 * Вызывается ОДИН РАЗ при создании store.
 * Загружает категории, подкатегории, города и пола если их нет в store.
 */
export function initializeDirectories(dispatch: AppDispatch) {
  if (directoriesInitialized) {
    if (import.meta.env.DEV) {
      console.log('[initializeDirectories] Already initialized, skipping');
    }
    return;
  }

  directoriesInitialized = true;

  if (import.meta.env.DEV) {
    console.log('[initializeDirectories] Dispatching fetch actions');
  }

  dispatch(fetchCategories());
  dispatch(fetchSubcategories());
  dispatch(fetchCities());
  dispatch(fetchGenders());
}

/**
 * Сброс флага инициализации (для тестов или hot reload)
 */
export function resetDirectoriesInitialization() {
  directoriesInitialized = false;
}
