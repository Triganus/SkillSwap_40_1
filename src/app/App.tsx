import { useEffect } from 'react';
import './App.css';
import AppRouter from '@app/router/AppRouter.tsx';
import { NotificationPopup } from '@app/ui/NotificationPopup';
import { useAppDispatch } from '@shared/hooks/redux';
import { initializeDirectories } from '@/entities/directory';

export default function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    initializeDirectories(dispatch);
  }, [dispatch]);

  return (
    <>
      <AppRouter />
      <NotificationPopup />
    </>
  );
}
