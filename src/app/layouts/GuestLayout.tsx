import { useState, type ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import { GuestHeader } from '@widgets/GuestHeader';
import { GuestLayoutProvider } from './GuestLayoutContext';

export function GuestLayout() {
  const [headerContent, setHeaderContent] = useState<ReactNode>('');

  return (
    <GuestLayoutProvider value={{ setHeaderContent }}>
      <GuestHeader>{headerContent}</GuestHeader>
      <main>
        <Outlet />
      </main>
    </GuestLayoutProvider>
  );
}
