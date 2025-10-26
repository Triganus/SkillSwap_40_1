import { Outlet } from 'react-router-dom';

export function GuestLayout() {
  return (
    <>
      <header>Простой заголовок</header>
      <main>
        <Outlet />
      </main>
    </>
  );
}
