// filepath: /Users/dcrawe/Projects/Corses/YPracticum/SkillSwap_40_11/src/shared/hooks/useKeyboardNavigation.ts
import { useCallback, useEffect, useRef, useState } from 'react';

export type NavigationOptions = {
  itemCount: number;
  /** индекс активного элемента по умолчанию */
  defaultActiveIndex?: number;
  /** цикл по кругу */
  loop?: boolean;
  /** отключить клавиатурную навигацию */
  disabled?: boolean;
};

export type NavigationApi = {
  activeIndex: number;
  setActiveIndex: (i: number) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  getItemId: (i: number) => string;
  listId: string;
};

export function useKeyboardNavigation({
  itemCount,
  defaultActiveIndex = -1,
  loop = true,
  disabled = false,
}: NavigationOptions): NavigationApi {
  const [activeIndex, setActiveIndex] = useState(defaultActiveIndex);
  const listIdRef = useRef(`list-${Math.random().toString(36).slice(2)}`);

  const clamp = useCallback(
    (i: number) => {
      if (itemCount === 0) return -1;
      if (!loop) return Math.max(0, Math.min(itemCount - 1, i));
      return (i + itemCount) % itemCount;
    },
    [itemCount, loop]
  );

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (disabled || itemCount === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((i) => clamp(i < 0 ? 0 : i + 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((i) => clamp(i < 0 ? itemCount - 1 : i - 1));
      }
    },
    [clamp, disabled, itemCount]
  );

  useEffect(() => {
    if (activeIndex >= itemCount) setActiveIndex(itemCount - 1);
  }, [activeIndex, itemCount]);

  const getItemId = useCallback((i: number) => `${listIdRef.current}-item-${i}`, []);

  return { activeIndex, setActiveIndex, onKeyDown, getItemId, listId: listIdRef.current };
}

export default useKeyboardNavigation;
