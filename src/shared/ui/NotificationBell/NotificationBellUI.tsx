import React from 'react';
import type { TNotificationBellUIProps } from './TNotificationBellUIProps';
import { Icon } from '../Icon';
import styles from './NotificationBellUI.module.scss';

/**
 * Отображает иконку колокольчика и красный бейдж с количеством непрочитанных уведомлений.
 * Бейдж показывается только если count > 0.
 * Если count > 9, отображается "9+".
 */
export const NotificationBellUI: React.FC<TNotificationBellUIProps> = ({ count, onClick }) => {
  // Определяем, нужно ли показывать бейдж
  const shouldShowBadge = count !== undefined && count > 0;

  // Форматируем текст для бейджа: если больше 9, показываем "9+"
  const badgeText = count && count > 9 ? '9+' : count?.toString() || '';

  // Определяем, нужен ли класс для большого бейджа (когда текст "9+")
  const badgeClasses = [styles.badge, badgeText === '9+' ? styles.badgeLarge : '']
    .filter(Boolean)
    .join(' ');

  return (
    <button
      className={styles.notificationBell}
      onClick={onClick}
      type="button"
      aria-label={shouldShowBadge ? `Уведомления: ${count} непрочитанных` : 'Уведомления'}
    >
      {/* Иконка колокольчика через компонент Icon */}
      <Icon name="shared-notification" size={24} className={styles.icon} title="Уведомления" />

      {/* Бейдж с количеством непрочитанных уведомлений, виден только если shouldShowBadge === true */}
      {shouldShowBadge && (
        <span className={badgeClasses} aria-hidden="true">
          {badgeText}
        </span>
      )}
    </button>
  );
};
