import { createContext, useContext } from 'react';

export type StepperContextValue = {
  currentStep: number;
  totalSteps: number;
};

const StepperContext = createContext<StepperContextValue>({ currentStep: 1, totalSteps: 1 });

export function useStepper() {
  return useContext(StepperContext);
}

export const StepperProvider = StepperContext.Provider;
