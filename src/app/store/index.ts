import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from '@features/auth/model/authSlice';
import { usersReducer } from '@/entities/user/model/usersSlice';
import { skillsReducer } from '@entities/skill/model';
import { filterSideBarReducer } from '@/entities/filterSideBar/model/filterSideBarSlice';
import { popupReducer } from './popupSlice';
import { createLocalStorageMiddleware } from '@shared/lib/redux/localStorageMiddleware';
import { loadState } from '@shared/lib/localStorage';
import userReducer from '@/entities/user/model/userSlice';
import notificationsReducer from '@/features/notifications/model/notificationsSlice';

import { authReducerV2, usersReducerV2 } from '@/entities/user/model-v2';
import {
  categoriesReducer,
  subcategoriesReducer,
  citiesReducer,
  gendersReducer,
} from '@/entities/directory/model';
import { filtersReducer } from '@/features/user-search/model/filtersSlice';
import { paginationReducer } from '@/features/user-search/model/paginationSlice';
import favoritesSlice from '@features/favorites/model/favoritesSlice';

const PERSIST_VERSION = 1;

function validateAuthV2State(state: unknown): boolean {
  if (!state || typeof state !== 'object') return false;

  const s = state as Record<string, unknown>;

  return (
    typeof s.isAuthenticated === 'boolean' &&
    typeof s.isLoading === 'boolean' &&
    (s.user === null || (typeof s.user === 'object' && s.user !== null))
  );
}

const loadedAuthV2 = loadState(
  'authV2',
  { isAuthenticated: false, user: null, isLoading: false, error: null },
  PERSIST_VERSION
);
const validAuthV2 = validateAuthV2State(loadedAuthV2)
  ? loadedAuthV2
  : { isAuthenticated: false, user: null, isLoading: false, error: null };

// Загрузка справочников из localStorage (браузерное хранилище)
// Эти данные будут использованы как preloadedState при создании Redux store
const loadedCategories = loadState(
  'directories_categories',
  { entities: {}, ids: [], loading: false, error: null },
  PERSIST_VERSION
);
const loadedSubcategories = loadState(
  'directories_subcategories',
  { entities: {}, ids: [], loading: false, error: null },
  PERSIST_VERSION
);
const loadedCities = loadState(
  'directories_cities',
  { entities: {}, ids: [], loading: false, error: null },
  PERSIST_VERSION
);
const loadedGenders = loadState(
  'directories_genders',
  { entities: {}, ids: [], loading: false, error: null },
  PERSIST_VERSION
);

if (import.meta.env.DEV) {
  console.log('[Store Init] Directories from localStorage:', {
    categoriesCount: loadedCategories.ids.length,
    subcategoriesCount: loadedSubcategories.ids.length,
    citiesCount: loadedCities.ids.length,
    gendersCount: loadedGenders.ids.length,
  });
}

const PRELOADED = {
  auth: loadState('auth', { isAuthenticated: false, user: null }, PERSIST_VERSION),
  authV2: validAuthV2,
  categories: loadedCategories,
  subcategories: loadedSubcategories,
  cities: loadedCities,
  genders: loadedGenders,
};

export const store = configureStore({
  reducer: {
    // TODO: Старые редьюсеры (будут удалены после полной миграции)
    auth: authReducer,
    users: usersReducer,
    user: userReducer,

    // Новые редьюсеры V2 (используем для авторизации и регистрации)
    authV2: authReducerV2,
    usersV2: usersReducerV2,

    // Общие редьюсеры
    skills: skillsReducer,
    filterSideBar: filterSideBarReducer,
    notifications: notificationsReducer,
    popup: popupReducer,
    favorites: favoritesSlice,

    // Справочники
    genders: gendersReducer,
    categories: categoriesReducer,
    subcategories: subcategoriesReducer,
    cities: citiesReducer,

    // Фильтры каталога пользователей
    filters: filtersReducer,

    // Пагинация секций пользователей
    pagination: paginationReducer,
  },
  preloadedState: PRELOADED as unknown,
  middleware: (getDefault) =>
    getDefault({ serializableCheck: false }).concat(
      createLocalStorageMiddleware({
        auth: PERSIST_VERSION,
        authV2: PERSIST_VERSION,
        directories_genders: { stateKey: 'genders', version: PERSIST_VERSION },
        directories_categories: { stateKey: 'categories', version: PERSIST_VERSION },
        directories_subcategories: { stateKey: 'subcategories', version: PERSIST_VERSION },
        directories_cities: { stateKey: 'cities', version: PERSIST_VERSION },
      })
    ),
  devTools: import.meta?.env?.MODE !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
