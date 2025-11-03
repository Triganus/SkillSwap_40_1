import type { CSSProperties, ReactNode } from 'react';

/**
 * Свойства компонента TwoColumnLayout
 */
export interface TwoColumnLayoutProps {
  /**
   * Контент для левого блока
   */
  leftContent: ReactNode;

  /**
   * Контент для правого блока
   */
  rightContent: ReactNode;

  /**
   * Дополнительный CSS класс для контейнера
   */
  className?: string;

  /**
   * Расстояние между блоками (gap)
   * @default 0
   */
  gap?: number | string;

  /**
   * Padding для каждого блока
   * @default '24px'
   */
  columnPadding?: number | string;

  /**
   * Цвет фона блоков
   * @default '#ffffff'
   */
  columnBackground?: string;

  /**
   * Цвет фона контейнера
   * @default 'transparent'
   */
  containerBackground?: string;

  /**
   * Padding контейнера
   * @default 0
   */
  containerPadding?: number | string;

  /**
   * Минимальная высота контейнера
   */
  minHeight?: number | string;

  /**
   * Breakpoint для адаптивности (в пикселях)
   * @default 768
   */
  breakpoint?: number;

  /**
   * Border radius для блоков
   * @default 0
   */
  borderRadius?: number | string;

  /**
   * Выравнивание контента по вертикали внутри блоков
   * @default 'flex-start'
   */
  columnJustify?: CSSProperties['justifyContent'];

  /**
   * Выравнивание контента по горизонтали внутри блоков
   * @default 'stretch'
   */
  columnAlign?: CSSProperties['alignItems'];

  /**
   * Дополнительный CSS класс для левого блока
   */
  leftColumnClassName?: string;

  /**
   * Дополнительный CSS класс для правого блока
   */
  rightColumnClassName?: string;
}
