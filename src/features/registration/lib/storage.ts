import { loadState, saveState, namespacedKey } from '@shared/lib/localStorage';
import type { NavigateFunction } from 'react-router-dom';
import type { TagCategory } from '@shared/ui/Tag';

export type RegistrationStep1Data = {
  email: string;
  passwordHash: string;
};

export type RegistrationStep2Data = {
  avatarDataUrl: string | null;
  name: string;
  birthDate: string; // формат: дд.мм.гггг
  gender: string; // см. константы GENDER_OPTIONS
  city: string; // см. константы CITIES
  categories: TagCategory[]; // идентификаторы категорий
  subcategories: string[]; // названия навыков/подкатегорий
};

export type RegistrationData = {
  currentStep: number;
  completedSteps: number[];
  stepData: {
    step1?: RegistrationStep1Data;
    step2?: RegistrationStep2Data;
  };
  expiresAt: number;
};

const KEY = 'registration';
const VERSION = 1;
export const REGISTRATION_BROADCAST_EVENT = 'app:registration:changed';
const ENTRY_KEY = 'registration_entry';
const TTL_MS = 24 * 60 * 60 * 1000; // 24 часа

const EMPTY: RegistrationData = {
  currentStep: 1,
  completedSteps: [],
  stepData: {},
  expiresAt: Date.now() + TTL_MS,
};

export function getRegistrationData(): RegistrationData {
  const data = loadState<RegistrationData>(KEY, EMPTY, VERSION);

  if (!data?.expiresAt || data.expiresAt < Date.now()) {
    clearRegistrationData();

    return { ...EMPTY, expiresAt: Date.now() + TTL_MS };
  }

  return data;
}

function broadcastChange() {
  try {
    window.dispatchEvent(new Event(REGISTRATION_BROADCAST_EVENT));
  } catch {
    // ignore
  }
}

export function saveRegistrationData(
  updater: Partial<RegistrationData> | ((prev: RegistrationData) => RegistrationData)
): RegistrationData {
  const prev = getRegistrationData();
  const next =
    typeof updater === 'function'
      ? (updater as (p: RegistrationData) => RegistrationData)(prev)
      : { ...prev, ...updater };

  // продлеваем TTL при каждом сохранении
  next.expiresAt = Date.now() + TTL_MS;

  saveState(KEY, next, VERSION);
  broadcastChange();

  return next;
}

export function clearRegistrationData(): void {
  try {
    const k = namespacedKey(KEY, VERSION);

    localStorage.removeItem(k);

    broadcastChange();
  } catch {
    // ignore
  }
}

export function isStepAccessible(stepNumber: number): boolean {
  if (stepNumber <= 1) {
    return true;
  }

  const data = getRegistrationData();

  return data.completedSteps.includes(stepNumber - 1);
}

export function markStepCompleted(
  stepNumber: number,
  stepPayload?: Partial<RegistrationData['stepData']>
): RegistrationData {
  return saveRegistrationData((prev) => {
    const completed = new Set(prev.completedSteps);

    completed.add(stepNumber);

    const stepData = { ...prev.stepData, ...(stepPayload ?? {}) };

    return {
      ...prev,
      currentStep: Math.max(prev.currentStep, stepNumber + 1),
      completedSteps: Array.from(completed).sort((a, b) => a - b),
      stepData,
    };
  });
}

export function getEntryPath(): string | null {
  try {
    return loadState<string | null>(ENTRY_KEY, null, VERSION);
  } catch {
    return null;
  }
}

export function setEntryPath(path: string): void {
  try {
    if (path.startsWith('/register')) {
      return;
    }

    saveState(ENTRY_KEY, path, VERSION);
  } catch {
    // ignore
  }
}

export function clearEntryPath(): void {
  try {
    const k = namespacedKey(ENTRY_KEY, VERSION);

    localStorage.removeItem(k);
  } catch {
    // ignore
  }
}

export function exitRegistration(navigate: NavigateFunction) {
  const to = getEntryPath() ?? '/';

  clearRegistrationData();
  clearEntryPath();

  try {
    navigate(to, { replace: true });
  } catch {
    navigate(-1);
  }
}

export function getFirstIncompleteStep(totalSteps: number): number {
  const data = getRegistrationData();

  for (let i = 1; i <= totalSteps; i += 1) {
    if (!data.completedSteps.includes(i)) return i;
  }

  return totalSteps;
}

export { KEY as REGISTRATION_STORAGE_KEY, VERSION as REGISTRATION_STORAGE_VERSION };
