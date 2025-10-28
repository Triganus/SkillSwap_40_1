import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@app/Provider';
import type { HeaderUser } from '../type';
import { fetchHeaderUsers } from './usersAdapter';

export function useHeaderUser(): { user: HeaderUser | null; isGuest: boolean } {
  const { auth } = useAuth();
  const [list, setList] = useState<HeaderUser[] | null>(null);

  useEffect(() => {
    let mounted = true;
    fetchHeaderUsers()
      .then((u) => {
        if (mounted) setList(u);
      })
      .catch(() => {
        if (mounted) setList([]);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return useMemo(() => {
    if (!auth.isAuthenticated) return { user: null, isGuest: true } as const;

    const user =
      (list ?? []).find((u) => u.id === auth.user?.id) ?? (list && list.length > 0 ? list[0] : null);

    return { user, isGuest: false } as const;
  }, [auth.isAuthenticated, auth.user?.id, list]);
}
