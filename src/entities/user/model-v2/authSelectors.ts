/**
 * Селекторы для аутентификации (v2)
 */

import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@app/store';

/**
 * ========== Базовые селекторы ==========
 */

export const selectAuthV2State = (state: RootState) => state.authV2 || state.auth;

export const selectAuthUser = (state: RootState) => {
  const authState = selectAuthV2State(state);
  return authState?.user || null;
};

export const selectIsAuthenticated = (state: RootState) => {
  const authState = selectAuthV2State(state);
  return authState?.isAuthenticated || false;
};

export const selectAuthLoading = (state: RootState) => {
  const authState = selectAuthV2State(state);
  return authState?.isLoading || false;
};

export const selectAuthError = (state: RootState) => {
  const authState = selectAuthV2State(state);
  return authState?.error || null;
};

/**
 * ========== Производные селекторы ==========
 */

/**
 * Получить ID авторизованного пользователя
 */
export const selectAuthUserId = createSelector([selectAuthUser], (user) => user?.id || null);

/**
 * Получить имя авторизованного пользователя для Header
 */
export const selectAuthUserName = createSelector([selectAuthUser], (user) => user?.name || '');

/**
 * Получить аватар авторизованного пользователя для Header
 */
export const selectAuthUserAvatar = createSelector(
  [selectAuthUser],
  (user) => user?.avatar || null
);

/**
 * Получить email авторизованного пользователя
 */
export const selectAuthUserEmail = createSelector([selectAuthUser], (user) => user?.email || '');

/**
 * Получить токен авторизации
 */
export const selectAuthToken = createSelector([selectAuthUser], (user) => user?.token || null);

/**
 * Проверка, есть ли активная сессия с токеном
 */
export const selectHasValidSession = createSelector(
  [selectIsAuthenticated, selectAuthToken],
  (isAuthenticated, token) => isAuthenticated && !!token
);
