import type { RootState } from '@app/Provider';

export const selectAuth = (s: RootState) => s.auth;
export const selectIsAuthenticated = (s: RootState) => s.auth.isAuthenticated;
export const selectAuthUser = (s: RootState) => s.auth.user;
