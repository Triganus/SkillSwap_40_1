import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@/app/store';
import { fetchNotifications } from '../model/notificationsSlice';

interface UseNotificationsPollingOptions {
  enabled?: boolean;
  interval?: number;
  runImmediately?: boolean;
}

const DEFAULT_INTERVAL = 60_000;

export const useNotificationsPolling = ({
  enabled = true,
  interval = DEFAULT_INTERVAL,
  runImmediately = true,
}: UseNotificationsPollingOptions = {}) => {
  const dispatch = useDispatch<AppDispatch>();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!enabled) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return undefined;
    }

    if (runImmediately) {
      dispatch(fetchNotifications());
    }

    timerRef.current = setInterval(() => {
      dispatch(fetchNotifications());
    }, interval);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [dispatch, enabled, interval, runImmediately]);
};

export default useNotificationsPolling;

