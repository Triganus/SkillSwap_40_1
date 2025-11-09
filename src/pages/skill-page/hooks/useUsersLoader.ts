import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@app/Provider';
import { usersActions } from '@entities/user/model/usersSlice';
import type { DbUser } from '@entities/user/model';

/**
 * Хук для загрузки пользователей из /db/users.json
 */
export function useUsersLoader() {
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const response = await fetch('/db/users.json');
        if (!response.ok) {
          console.warn('[useUsersLoader] Failed to fetch users');
          return;
        }
        const data: { users: DbUser[] } = await response.json();
        const normalized = data.users.reduce<Record<string, DbUser>>((acc, u) => {
          acc[u.id] = u;
          return acc;
        }, {});
        dispatch(usersActions.upsertMany(normalized));
      } catch (error) {
        console.error('[useUsersLoader] Error loading users:', error);
      } finally {
        setLoading(false);
      }
    })();
  }, [dispatch]);

  return { loading };
}
