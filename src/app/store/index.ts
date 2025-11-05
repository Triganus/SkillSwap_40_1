import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from '@features/auth/model/authSlice';
import { usersReducer } from '@entities/user/model/userSlice';
import { skillsReducer } from '@entities/skill/model';
import { popupReducer } from './popupSlice';
import { createLocalStorageMiddleware } from '@shared/lib/redux/localStorageMiddleware';
import { loadState } from '@shared/lib/localStorage';

const PERSIST_VERSION = 1;
const PRELOADED = {
  auth: loadState('auth', { isAuthenticated: false, user: null }, PERSIST_VERSION),
};

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    skills: skillsReducer,
    popup: popupReducer,
  },
  preloadedState: PRELOADED as unknown,
  middleware: (getDefault) =>
    getDefault({ serializableCheck: false }).concat(
      createLocalStorageMiddleware({ auth: PERSIST_VERSION })
    ),
  devTools: import.meta?.env?.MODE !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
