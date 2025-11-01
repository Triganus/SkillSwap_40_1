import { Outlet } from 'react-router-dom';
import { GuestHeader } from '@widgets/GuestHeader';
import styles from './GuestLayout.module.scss';

export function GuestLayout() {
  return (
    <>
      <GuestHeader>
        <h1 className={styles.title}>Вход</h1>
      </GuestHeader>
      <main>
        <Outlet />
      </main>
    </>
  );
}
