import type { ReactNode } from 'react';

export interface GuestHeaderProps {
  /**
   * Контент для центральной части заголовка (слот)
   * Можно передать текст, компонент или любой ReactNode
   */
  centerContent?: ReactNode;
  /**
   * Альтернативный способ передачи контента через children
   */
  children?: ReactNode;
}
