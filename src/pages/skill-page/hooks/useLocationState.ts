import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Хук для безопасного получения userId и timestamp из location.state
 */
export function useLocationState() {
  const location = useLocation();

  const stateUserId = useMemo(() => {
    const state = location.state as { userId?: string; timestamp?: number } | null;
    return state?.userId;
  }, [location.state]);

  const stateTimestamp = useMemo(() => {
    const state = location.state as { timestamp?: number } | null;
    return state?.timestamp;
  }, [location.state]);

  return { stateUserId, stateTimestamp };
}
