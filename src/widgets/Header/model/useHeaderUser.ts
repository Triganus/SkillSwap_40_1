import { useMemo } from 'react';
import type { HeaderUser } from '../type';
import { useAuthUser } from '@shared/hooks';

export function useHeaderUser(): { user: HeaderUser | null; isGuest: boolean } {
  const { user: authUser, isAuthenticated } = useAuthUser();

  return useMemo(() => {
    if (!isAuthenticated || !authUser) return { user: null, isGuest: true } as const;

    const mapped: HeaderUser = {
      id: authUser.id,
      name: authUser.name,
      avatarSrc: authUser.avatar_image,
    };

    return { user: mapped, isGuest: false } as const;
  }, [isAuthenticated, authUser]);
}
