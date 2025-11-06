import './App.css';
import AppRouter from '@app/router/AppRouter.tsx';
import { NotificationPopup } from '@app/ui/NotificationPopup';

export default function App() {
  return (
    <>
      <AppRouter />
      <NotificationPopup />
    </>
  );
}
