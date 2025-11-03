import { useAppSelector } from '@shared/hooks/redux';
import type { RootState } from '@app/Provider';
import type { AuthUser } from '@entities/user/model/types/types.ts';

export type UseAuthUserResult = {
  user: AuthUser | null;
  isAuthenticated: boolean;
};

export function useAuthUser(): UseAuthUserResult {
  const isAuthenticated = useAppSelector((s: RootState) => s.auth.isAuthenticated);
  const user = useAppSelector((s: RootState) => s.auth.user ?? null);

  return { user, isAuthenticated };
}
