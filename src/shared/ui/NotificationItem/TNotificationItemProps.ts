import type { CSSProperties } from 'react';

export interface TNotificationItemProps {
  /** Первая строка — заголовок уведомления */
  title: string;
  /** Вторая строка — пояснение */
  description: string;
  /** Метка справа ("сегодня", "вчера" и т.д.) */
  meta?: string;
  /** Кастомная иконка слева */
  icon?: React.ReactNode;

  /** Текст кнопки CTA (по умолчанию — "Перейти") */
  ctaLabel?: string;
  /** Обработчик клика по CTA */
  onCta?: () => void;
  /** Если true — кнопка скрыта (уведомление просмотрено) */
  viewed?: boolean;
  /** Скрывать кнопку после клика (локально). По умолчанию — true */
  hideCtaAfterClick?: boolean;

  className?: string;
  style?: CSSProperties;
}
