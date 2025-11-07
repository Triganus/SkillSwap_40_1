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
import { categoriesReducer, subcategoriesReducer, citiesReducer } from '@/entities/directory/model';

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

const PRELOADED = {
  auth: loadState('auth', { isAuthenticated: false, user: null }, PERSIST_VERSION),
  authV2: validAuthV2,
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

    // Справочники
    categories: categoriesReducer,
    subcategories: subcategoriesReducer,
    cities: citiesReducer,
  },
  preloadedState: PRELOADED as unknown,
  middleware: (getDefault) =>
    getDefault({ serializableCheck: false }).concat(
      createLocalStorageMiddleware({ auth: PERSIST_VERSION, authV2: PERSIST_VERSION })
    ),
  devTools: import.meta?.env?.MODE !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
