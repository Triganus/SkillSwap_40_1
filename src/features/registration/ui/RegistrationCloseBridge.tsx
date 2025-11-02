import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { exitRegistration } from '../lib/storage';
import { GUEST_HEADER_CLOSE_EVENT } from '@widgets/GuestHeader/GuestHeader';

/**
 * Подписывается на клик по кнопке "Закрыть" в гостевой шапке
 * только на маршрутах /register* и выполняет exitRegistration
 */
export function RegistrationCloseBridge() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const isRegister = location.pathname.startsWith('/register');

    if (!isRegister) {
      return;
    }

    const handler = (e: Event) => {
      if (e.cancelable) {
        e.preventDefault?.();
      }

      exitRegistration(navigate as any);
    };

    window.addEventListener(GUEST_HEADER_CLOSE_EVENT, handler as EventListener);

    return () => window.removeEventListener(GUEST_HEADER_CLOSE_EVENT, handler as EventListener);
  }, [location.pathname, navigate]);

  return null;
}
