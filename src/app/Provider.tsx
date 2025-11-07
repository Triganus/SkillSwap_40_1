import type { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider as ReduxProvider } from 'react-redux';
import { store, type RootState, type AppDispatch } from './store';
import { useAuthFacade } from '@features/auth/model/facade';
import { useAuthFacadeV2 } from '@features/auth/model/facade-v2';

export type { RootState, AppDispatch };

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useAuthFacade();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuthV2 = () => useAuthFacadeV2();

export function Provider({ children }: { children: ReactNode }) {
  return (
    <BrowserRouter>
      <ReduxProvider store={store}>{children}</ReduxProvider>
    </BrowserRouter>
  );
}
