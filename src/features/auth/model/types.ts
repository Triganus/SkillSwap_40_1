import type { AuthUser } from '@entities/user/model/types/types';

export interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
}
