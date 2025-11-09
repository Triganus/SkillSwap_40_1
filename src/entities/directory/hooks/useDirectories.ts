import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@shared/hooks/redux';
import {
  fetchCategories,
  fetchSubcategories,
  fetchCities,
  fetchGenders,
  selectAllCategories,
  selectAllSubcategories,
  selectAllCities,
  selectAllGenders,
  selectCategoriesLoading,
  selectSubcategoriesLoading,
  selectCitiesLoading,
  selectGendersLoading,
  selectCategoriesError,
  selectSubcategoriesError,
  selectCitiesError,
  selectGendersError,
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
  const genders = useAppSelector(selectAllGenders);

  const categoriesLoading = useAppSelector(selectCategoriesLoading);
  const subcategoriesLoading = useAppSelector(selectSubcategoriesLoading);
  const citiesLoading = useAppSelector(selectCitiesLoading);
  const gendersLoading = useAppSelector(selectGendersLoading);

  const categoriesError = useAppSelector(selectCategoriesError);
  const subcategoriesError = useAppSelector(selectSubcategoriesError);
  const citiesError = useAppSelector(selectCitiesError);
  const gendersError = useAppSelector(selectGendersError);

  const isReady = useAppSelector(selectDirectoriesReady);
  const categoriesWithSubcategories = useAppSelector(selectAllCategoriesWithSubcategories);

  const isLoading = categoriesLoading || subcategoriesLoading || citiesLoading || gendersLoading;
  const error = categoriesError || subcategoriesError || citiesError || gendersError;

  useEffect(() => {
    if (options.autoLoad) {
      // Загружаем все справочники параллельно
      dispatch(fetchCategories());
      dispatch(fetchSubcategories());
      dispatch(fetchCities());
      dispatch(fetchGenders());
    }
  }, [dispatch, options.autoLoad]);

  return {
    // Данные
    categories,
    subcategories,
    cities,
    genders,
    categoriesWithSubcategories,

    // Статусы
    isLoading,
    isReady,
    error,

    // Отдельные статусы для каждого справочника
    categoriesLoading,
    subcategoriesLoading,
    citiesLoading,
    gendersLoading,
    categoriesError,
    subcategoriesError,
    citiesError,
    gendersError,

    // Методы для ручной загрузки
    loadCategories: () => dispatch(fetchCategories()),
    loadSubcategories: () => dispatch(fetchSubcategories()),
    loadCities: () => dispatch(fetchCities()),
    loadGenders: () => dispatch(fetchGenders()),
  };
}
