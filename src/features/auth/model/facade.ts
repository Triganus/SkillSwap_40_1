import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@shared/hooks/redux';
import { authActions } from './authSlice';
import { selectAuth } from './selectors';
import type { AuthUser } from '@entities/user/model/types/types';

export function useAuthFacade() {
  const dispatch = useAppDispatch();
  const auth = useAppSelector(selectAuth);

  const login = useCallback((user: AuthUser) => dispatch(authActions.login(user)), [dispatch]);
  const logout = useCallback(() => dispatch(authActions.logout()), [dispatch]);

  return { auth, login, logout } as const;
}

