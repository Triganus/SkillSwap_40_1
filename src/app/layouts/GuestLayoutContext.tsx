import { createContext, useContext, type ReactNode } from 'react';

interface GuestLayoutContextValue {
  setHeaderContent: (content: ReactNode) => void;
}

const GuestLayoutContext = createContext<GuestLayoutContextValue | null>(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useGuestLayout = () => {
  const context = useContext(GuestLayoutContext);

  if (!context) {
    throw new Error('useGuestLayout must be used within GuestLayout');
  }

  return context;
};

export const GuestLayoutProvider = GuestLayoutContext.Provider;
