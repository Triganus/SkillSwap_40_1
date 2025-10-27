import { Outlet } from 'react-router-dom';
import { FooterWidget } from '@widgets/Footer/Footer.tsx';
import { HeaderWidget } from '@widgets/Header';


export function Layout() {
  return (
    <>
      <HeaderWidget />
      <main>
        <Outlet />
      </main>
      <FooterWidget />
    </>
  );
}
