import type { ReactNode, InputHTMLAttributes, HTMLAttributes } from 'react';

export interface SearchUIProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'prefix' | 'suffix'> {
  /** Дополнительный класс для контейнера */
  className?: string;
  /** Слот слева от поля (иконка) */
  prefix?: ReactNode;
  /** Слот справа от поля (иконка/кнопка) */
  suffix?: ReactNode;
  /** Пропсы для контейнера */
  containerProps?: HTMLAttributes<HTMLDivElement>;
  /** Дополнительный класс для инпута */
  inputClassName?: string;
  /** Показывать кнопку очистки, когда есть значение (по умолчанию: true) */
  allowClear?: boolean;
  /** Колбэк при очистке поля (срабатывает после очистки) */
  onClear?: () => void;
  /** ARIA-лейбл для кнопки очистки */
  clearAriaLabel?: string;
}
