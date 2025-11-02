import { useEffect, type ReactNode } from 'react';
import { useGuestLayout } from './GuestLayoutContext';

/**
 * Хук для установки контента в заголовок GuestLayout
 * Автоматически очищает контент при размонтировании компонента
 *
 * @example
 * ```tsx
 * function LoginPage() {
 *   useGuestHeaderContent(<h1>Вход</h1>);
 *   // ...
 * }
 * ```
 */
export const useGuestHeaderContent = (content: ReactNode) => {
  const { setHeaderContent } = useGuestLayout();

  useEffect(() => {
    setHeaderContent(content);
  }, [content, setHeaderContent]);
};
