import type { Middleware } from '@reduxjs/toolkit';
import { saveState } from '../localStorage';

/**
 * Middleware для синхронизации выбранных срезов состояния с localStorage.
 * Пример использования: localStorageMiddleware({ auth: 1 })
 */
export function createLocalStorageMiddleware(config: Record<string, number> = {}): Middleware {
  return (storeApi) => (next) => (action) => {
    const result = next(action);

    try {
      const state = storeApi.getState() as Record<string, unknown>;

      for (const [sliceKey, version] of Object.entries(config)) {
        const sliceState = state[sliceKey as keyof typeof state];

        if (sliceState !== undefined) {
          saveState(sliceKey, sliceState, version);
        }
      }
    } catch {
      // ignore
    }

    return result;
  };
}

