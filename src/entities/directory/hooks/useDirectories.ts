import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@shared/hooks/redux';
import {
  fetchCategories,
  fetchSubcategories,
  fetchCities,
  selectAllCategories,
  selectAllSubcategories,
  selectAllCities,
  selectCategoriesLoading,
  selectSubcategoriesLoading,
  selectCitiesLoading,
  selectCategoriesError,
  selectSubcategoriesError,
  selectCitiesError,
  selectDirectoriesReady,
  selectAllCategoriesWithSubcategories,
} from '../model';

/**
 * Хук для работы со справочниками
 * Автоматически загружает данные при монтировании компонента
 */
export function useDirectories(options: { autoLoad?: boolean } = { autoLoad: true }) {
  const dispatch = useAppDispatch();

  const categories = useAppSelector(selectAllCategories);
  const subcategories = useAppSelector(selectAllSubcategories);
  const cities = useAppSelector(selectAllCities);

  const categoriesLoading = useAppSelector(selectCategoriesLoading);
  const subcategoriesLoading = useAppSelector(selectSubcategoriesLoading);
  const citiesLoading = useAppSelector(selectCitiesLoading);

  const categoriesError = useAppSelector(selectCategoriesError);
  const subcategoriesError = useAppSelector(selectSubcategoriesError);
  const citiesError = useAppSelector(selectCitiesError);

  const isReady = useAppSelector(selectDirectoriesReady);
  const categoriesWithSubcategories = useAppSelector(selectAllCategoriesWithSubcategories);

  const isLoading = categoriesLoading || subcategoriesLoading || citiesLoading;
  const error = categoriesError || subcategoriesError || citiesError;

  useEffect(() => {
    if (options.autoLoad) {
      // Загружаем все справочники параллельно
      dispatch(fetchCategories());
      dispatch(fetchSubcategories());
      dispatch(fetchCities());
    }
  }, [dispatch, options.autoLoad]);

  return {
    // Данные
    categories,
    subcategories,
    cities,
    categoriesWithSubcategories,

    // Статусы
    isLoading,
    isReady,
    error,

    // Отдельные статусы для каждого справочника
    categoriesLoading,
    subcategoriesLoading,
    citiesLoading,
    categoriesError,
    subcategoriesError,
    citiesError,

    // Методы для ручной загрузки
    loadCategories: () => dispatch(fetchCategories()),
    loadSubcategories: () => dispatch(fetchSubcategories()),
    loadCities: () => dispatch(fetchCities()),
  };
}
