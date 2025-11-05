import { lazy, Suspense, useEffect, useRef } from 'react';
import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { useAuth } from '../Provider';
import { Layout } from '@app/layouts/Layout.tsx';
import { GuestLayout } from '@app/layouts/GuestLayout.tsx';
import { clearRegistrationData, setEntryPath } from '@features/registration';

const HomePage = lazy(() => import('@pages/home/ui/HomePage'));
const LoginPage = lazy(() => import('@pages/login/ui/LoginPage'));
const RegisterPage = lazy(() => import('@pages/register/ui/RegisterPage'));
const ProfilePage = lazy(() => import('@pages/profile/ui/ProfilePage'));
const FavoritesPage = lazy(() => import('@pages/favorites/ui/FavoritesPage'));
const PopupTestPage = lazy(() =>
  import('@pages/popup-test').then((m) => ({ default: m.PopupTestPage }))
);
const SkillPage = lazy(() => import('@pages/skill-page'));
const PopularSkillsPage = lazy(() => import('@pages/popular-skills'));
const NewSkillsPage = lazy(() => import('@pages/new-skills'));
const NotFoundPage = lazy(() =>
  import('@pages/not-found404').then((m) => ({ default: m.NotFoundPage }))
);
const ServerErrorPage = lazy(() =>
  import('@pages/server-error500').then((m) => ({ default: m.ServerErrorPage }))
);
const NotificationsPage = lazy(() => import('@pages/notifications/ui/NotificationsPage'));

function RequireAuth() {
  const { auth } = useAuth();
  const location = useLocation();

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}

function GuestOnly() {
  const { auth } = useAuth();
  if (auth.isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}

export default function AppRouter() {
  const location = useLocation();
  const prevPathRef = useRef<string>(location.pathname);

  useEffect(() => {
    const prev = prevPathRef.current;
    const curr = location.pathname;

    const wasRegister = prev.startsWith('/register');
    const nowRegister = curr.startsWith('/register');

    if (!wasRegister && nowRegister) {
      setEntryPath(prev);
    }

    if (wasRegister && !nowRegister) {
      clearRegistrationData();
    }

    prevPathRef.current = curr;
  }, [location.pathname]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route element={<GuestLayout />}>
          <Route element={<GuestOnly />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/register/:step" element={<RegisterPage />} />
          </Route>
        </Route>

        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/skill/:id" element={<SkillPage />} />
          <Route path="/popular-skills" element={<PopularSkillsPage />} />
          <Route path="/new-skills" element={<NewSkillsPage />} />
          <Route path="/popup-test" element={<PopupTestPage />} />

          <Route element={<RequireAuth />}>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
          </Route>

          {/* Страницы ошибок */}
          <Route path="/500" element={<ServerErrorPage />} />
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
