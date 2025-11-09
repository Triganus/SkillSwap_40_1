/**
 * Фасад для работы с новой версией аутентификации
 */

import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@shared/hooks/redux';
import {
  loginSuccess,
  loginStart,
  loginFailure,
  logout as logoutAction,
  updateAuthUser,
  clearError,
  selectAuthV2State,
  selectAuthUser,
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthError,
  type AuthUser,
} from '@/entities/user/model-v2';

/**
 * Hook для работы с аутентификацией (V2)
 */
export function useAuthFacadeV2() {
  const dispatch = useAppDispatch();

  // Селекторы
  const authState = useAppSelector(selectAuthV2State);
  const user = useAppSelector(selectAuthUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isLoading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);

  // Actions
  const login = useCallback(
    (userData: AuthUser) => {
      dispatch(loginSuccess(userData));
    },
    [dispatch]
  );

  const startLogin = useCallback(() => {
    dispatch(loginStart());
  }, [dispatch]);

  const failLogin = useCallback(
    (errorMessage: string) => {
      dispatch(loginFailure(errorMessage));
    },
    [dispatch]
  );

  const logout = useCallback(() => {
    dispatch(logoutAction());
  }, [dispatch]);

  const updateUser = useCallback(
    (updates: Partial<AuthUser>) => {
      dispatch(updateAuthUser(updates));
    },
    [dispatch]
  );

  const clearAuthError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    // State
    auth: authState,
    user,
    isAuthenticated,
    isLoading,
    error,

    // Actions
    login,
    startLogin,
    failLogin,
    logout,
    updateUser,
    clearError: clearAuthError,
  } as const;
}
