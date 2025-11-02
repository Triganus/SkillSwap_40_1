import { useState, type ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import { GuestHeader } from '@widgets/GuestHeader';
import { GuestLayoutProvider } from './GuestLayoutContext';
import styles from './GuestLayout.module.scss';

export function GuestLayout() {
  const [headerContent, setHeaderContent] = useState<ReactNode>(
    <h1 className={styles.title}>Вход</h1>
  );

  return (
    <GuestLayoutProvider value={{ setHeaderContent }}>
      <GuestHeader>{headerContent}</GuestHeader>
      <main>
        <Outlet />
      </main>
    </GuestLayoutProvider>
  );
}
