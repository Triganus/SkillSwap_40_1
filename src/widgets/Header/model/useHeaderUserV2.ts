import { useMemo } from 'react';
import type { HeaderUser } from '../type';
import { useAuthUserV2 } from '@shared/hooks/useAuthUserV2';

export function useHeaderUserV2(): { user: HeaderUser | null; isGuest: boolean } {
  const { user: authUser, isAuthenticated } = useAuthUserV2();

  return useMemo(() => {
    if (!isAuthenticated || !authUser) return { user: null, isGuest: true } as const;

    const mapped: HeaderUser = {
      id: authUser.id,
      name: authUser.name,
      avatarSrc: authUser.avatar || undefined,
    };

    return { user: mapped, isGuest: false } as const;
  }, [isAuthenticated, authUser]);
}
