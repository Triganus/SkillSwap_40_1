import { useCallback, useEffect, useState } from 'react';

/**
 * Утилиты безопасной работы с localStorage.
 * - serialize/deserialize: надёжная (де)сериализация с fallback
 * - saveState/loadState: сохранение/загрузка с префиксом ключа и версией
 */
export type PersistOptions = {
  key: string;
  version?: number;
};

const DEFAULT_VERSION = 1;

export function serialize<T>(value: T): string {
  try {
    return JSON.stringify(value);
  } catch {
    return 'null';
  }
}

export function deserialize<T>(raw: string | null, fallback: T): T {
  if (!raw) {
    return fallback;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function namespacedKey(key: string, version = DEFAULT_VERSION): string {
  return `app:${key}:v${version}`;
}

export function saveState<T>(key: string, state: T, version = DEFAULT_VERSION): void {
  try {
    const k = namespacedKey(key, version);

    localStorage.setItem(k, serialize(state));
  } catch {
    // ignore
  }
}

export function loadState<T>(key: string, fallback: T, version = DEFAULT_VERSION): T {
  try {
    const k = namespacedKey(key, version);
    const raw = localStorage.getItem(k);

    return deserialize<T>(raw, fallback);
  } catch {
    return fallback;
  }
}

/** Хук для работы с localStorage как с состоянием React */
export function useLocalStorage<T>(key: string, initialValue: T, version = DEFAULT_VERSION) {
  const [value, setValue] = useState<T>(() => loadState<T>(key, initialValue, version));

  useEffect(() => {
    saveState<T>(key, value, version);
  }, [key, value, version]);

  const set = useCallback((updater: T | ((prev: T) => T)) => {
    setValue((prev) => (typeof updater === 'function' ? (updater as (p: T) => T)(prev) : updater));
  }, []);

  return [value, set] as const;
}

