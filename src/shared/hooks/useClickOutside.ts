import { useEffect } from 'react';

/**
 * Вызывает handler при клике/тачу вне указанных элементов.
 *
 * @param refs - один ref или массив ref'ов, границы которых считаются «внутри»
 * @param handler - обработчик закрытия
 * @param enabled - флаг активности слушателей (по умолчанию true)
 */
export function useClickOutside(
  refs: Array<React.RefObject<HTMLElement | null>> | React.RefObject<HTMLElement | null>,
  handler: (event: MouseEvent | TouchEvent) => void,
  enabled: boolean = true
) {
  useEffect(() => {
    if (!enabled) return;

    const refArray = Array.isArray(refs) ? refs : [refs];

    const listener = (event: MouseEvent | TouchEvent) => {
      // Игнорируем клики правой кнопкой
      if (event instanceof MouseEvent && event.button === 2) return;

      const target = event.target as Node | null;
      const clickedInside = refArray.some((r) => r.current && target && r.current.contains(target));

      if (!clickedInside) handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener, { passive: true });

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [enabled, handler, refs]);
}

export default useClickOutside;
