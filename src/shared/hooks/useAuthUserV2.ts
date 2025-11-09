import { useAppSelector } from '@shared/hooks/redux';
import type { RootState } from '@app/store';
import type { AuthUser } from '@/entities/user/model-v2';

export type UseAuthUserV2Result = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
};

export function useAuthUserV2(): UseAuthUserV2Result {
  const isAuthenticated = useAppSelector((s: RootState) => s.authV2?.isAuthenticated ?? false);
  const user = useAppSelector((s: RootState) => s.authV2?.user ?? null);
  const isLoading = useAppSelector((s: RootState) => s.authV2?.isLoading ?? false);
  const error = useAppSelector((s: RootState) => s.authV2?.error ?? null);

  return { user, isAuthenticated, isLoading, error };
}
