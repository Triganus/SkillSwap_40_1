import { memo } from 'react';
import type { INotification } from '@/entities/notification/model/types/types';
import { formatNotification } from '@/features/notifications/lib/formatNotification';
import IdeaIcon from '@/shared/assets/icons/idea.svg?react';
import { Icon } from '@/shared/ui/Icon';
import styles from './NotificationToastList.module.scss';

interface NotificationToastListProps {
  notifications: INotification[];
  onNotificationClick: (notification: INotification) => void;
  onNotificationDismiss: (notification: INotification) => void;
}

export const NotificationToastList = memo(
  ({ notifications, onNotificationClick, onNotificationDismiss }: NotificationToastListProps) => {
    if (notifications.length === 0) {
      return null;
    }

    return (
      <div className={styles.container} role="status" aria-live="polite">
        {notifications.map((notification) => {
          const formatted = formatNotification(notification);

          return (
            <div key={notification.id} className={styles.toast}>
              <button
                type="button"
                className={styles.close}
                onClick={() => onNotificationDismiss(notification)}
                aria-label="Закрыть уведомление"
              >
                <Icon name="close" size={16} />
              </button>

              <div className={styles.content}>
                <span className={styles.icon}>
                  <IdeaIcon />
                </span>

                <span className={styles.text}>{formatted.title}</span>
              </div>

              <button
                type="button"
                className={styles.cta}
                onClick={() => onNotificationClick(notification)}
              >
                Перейти
              </button>
            </div>
          );
        })}
      </div>
    );
  }
);

NotificationToastList.displayName = 'NotificationToastList';

