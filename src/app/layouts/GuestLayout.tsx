import { Outlet } from 'react-router-dom';
import { useState, type ReactNode } from 'react';
import { GuestHeader } from '@widgets/GuestHeader/GuestHeader';
import { GuestLayoutProvider } from './GuestLayoutContext';
import { RegistrationCloseBridge } from '@features/registration/ui/RegistrationCloseBridge';

export function GuestLayout() {
  const [headerContent, setHeaderContent] = useState<ReactNode | null>(null);

  return (
    <GuestLayoutProvider value={{ setHeaderContent }}>
      <GuestHeader>{headerContent}</GuestHeader>
      <RegistrationCloseBridge />
      <main>
        <Outlet />
      </main>
    </GuestLayoutProvider>
  );
}
