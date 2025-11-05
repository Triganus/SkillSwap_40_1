import type { ReactNode } from 'react';

export interface ModalAction {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

/**
 * Пропсы для компонента ModalUI
 */
export interface TModalUIProps {
  /** Флаг открытия/закрытия модального окна */
  isOpen: boolean;
  /** Обработчик закрытия модального окна */
  onClose: () => void;
  /** Заголовок модального окна */
  title?: string;
  /** Содержимое модального окна */
  children: ReactNode;
  /** Массив действий (кнопок) в футере модального окна */
  actions?: ModalAction[];
  /** Дополнительный CSS класс для кастомизации */
  className?: string;
  /** Иконка, отображаемая перед заголовком. Если не передана, блок с иконкой будет скрыт */
  icon?: ReactNode;
}
