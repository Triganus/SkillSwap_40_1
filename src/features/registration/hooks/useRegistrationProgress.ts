import { useCallback, useEffect, useState } from 'react';
import {
  getRegistrationData,
  saveRegistrationData,
  clearRegistrationData,
  isStepAccessible,
  markStepCompleted,
  type RegistrationData,
} from '../lib/storage';
import { namespacedKey } from '@shared/lib/localStorage';
import {
  REGISTRATION_STORAGE_KEY,
  REGISTRATION_STORAGE_VERSION,
  REGISTRATION_BROADCAST_EVENT,
} from '../lib/storage';

export type RegistrationProgress = {
  currentStep: number;
  completedSteps: number[];
  data: RegistrationData['stepData'];
  goToStep: (step: number) => void;
  completeStep: (step: number, payload?: Partial<RegistrationData['stepData']>) => void;
  reset: () => void;
};

export function useRegistrationProgress(): RegistrationProgress {
  const [state, setState] = useState<RegistrationData>(() => getRegistrationData());

  const syncFromStorage = useCallback(() => {
    setState(getRegistrationData());
  }, []);

  useEffect(() => {
    const key = namespacedKey(REGISTRATION_STORAGE_KEY, REGISTRATION_STORAGE_VERSION);
    const storageHandler = (e: StorageEvent) => {
      if (e.key !== key) return;
      syncFromStorage();
    };
    const broadcastHandler = () => syncFromStorage();

    window.addEventListener('storage', storageHandler);
    window.addEventListener(REGISTRATION_BROADCAST_EVENT, broadcastHandler as EventListener);

    return () => {
      window.removeEventListener('storage', storageHandler);
      window.removeEventListener(REGISTRATION_BROADCAST_EVENT, broadcastHandler as EventListener);
    };
  }, [syncFromStorage]);

  const goToStep = useCallback((step: number) => {
    if (step < 1) step = 1;
    if (!isStepAccessible(step)) {
      step = 1;
    }

    const next = saveRegistrationData({ currentStep: step });
    setState(next);
  }, []);

  const completeStep = useCallback(
    (step: number, payload?: Partial<RegistrationData['stepData']>) => {
      const next = markStepCompleted(step, payload);
      setState(next);
    },
    []
  );

  const reset = useCallback(() => {
    clearRegistrationData();
    setState(getRegistrationData());
  }, []);

  return {
    currentStep: state.currentStep,
    completedSteps: state.completedSteps,
    data: state.stepData,
    goToStep,
    completeStep,
    reset,
  };
}
