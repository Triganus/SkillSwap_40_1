import type { Middleware } from '@reduxjs/toolkit';
import { saveState } from '../localStorage';

/**
 * Middleware для синхронизации выбранных срезов состояния с localStorage.
 * Пример использования: localStorageMiddleware({ auth: 1, 'directories_categories': { stateKey: 'categories', version: 1 } })
 */
export function createLocalStorageMiddleware(
  config: Record<string, number | { stateKey: string; version: number }>
): Middleware {
  return (storeApi) => (next) => (action) => {
    const result = next(action);

    try {
      const state = storeApi.getState() as Record<string, unknown>;

      for (const [localStorageKey, configValue] of Object.entries(config)) {
        if (!localStorageKey || localStorageKey.trim() === '') {
          if (import.meta.env.DEV) {
            console.warn('[LocalStorage Middleware] Empty key detected, skipping');
          }

          continue;
        }

        const stateKey = typeof configValue === 'number' ? localStorageKey : configValue.stateKey;
        const version = typeof configValue === 'number' ? configValue : configValue.version;
        const sliceState = state[stateKey as keyof typeof state];

        if (sliceState !== undefined) {
          saveState(localStorageKey, sliceState, version);
        }
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('[LocalStorage Middleware] Error:', error);
      }
    }

    return result;
  };
}
