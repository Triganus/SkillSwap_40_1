/**
 * Redux slice для аутентификации
 * Управление состоянием авторизованного пользователя
 */

import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, AuthUser } from './types';

/**
 * Начальное состояние
 */
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

/**
 * Slice для управления аутентификацией
 */
export const authSliceV2 = createSlice({
  name: 'authV2',
  initialState,
  reducers: {
    /**
     * Успешная авторизация
     */
    loginSuccess: (state, action: PayloadAction<AuthUser>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
    },

    /**
     * Начало процесса авторизации
     */
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },

    /**
     * Ошибка авторизации
     */
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
      state.user = null;
      state.isAuthenticated = false;
    },

    /**
     * Выход из системы
     */
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
    },

    /**
     * Обновление данных авторизованного пользователя
     */
    updateAuthUser: (state, action: PayloadAction<Partial<AuthUser>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },

    /**
     * Сброс ошибки
     */
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { loginSuccess, loginStart, loginFailure, logout, updateAuthUser, clearError } =
  authSliceV2.actions;

export default authSliceV2.reducer;
