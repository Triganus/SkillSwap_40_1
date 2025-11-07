import categoriesReducer from './categoriesSlice';
import subcategoriesReducer from './subcategoriesSlice';
import citiesReducer from './citiesSlice';
import { gendersReducer } from './gendersSlice';

export { categoriesReducer, subcategoriesReducer, citiesReducer, gendersReducer };

export { fetchCategories, resetCategories } from './categoriesSlice';
export { fetchSubcategories, resetSubcategories } from './subcategoriesSlice';
export { fetchCities, resetCities } from './citiesSlice';
export { fetchGenders, setGenders, clearGenders } from './gendersSlice';

export * from './selectors';
export * from './types';
