import React from 'react';
import type { INotification } from '@/entities/notification/model/types/types';
import { NotificationItem } from '@/shared/ui/NotificationItem';
import IdeaIcon from '@/shared/assets/icons/idea.svg?react';
import { formatNotification } from '@/features/notifications/lib/formatNotification';
import styles from './NotificationsList.module.scss';

interface NotificationsListProps {
  notifications: INotification[];
  onNotificationClick: (notification: INotification) => void;
  emptyMessage: string;
}

export const NotificationsList: React.FC<NotificationsListProps> = ({
  notifications,
  onNotificationClick,
  emptyMessage,
}) => {
  if (notifications.length === 0) {
    return <p className={styles.empty}>{emptyMessage}</p>;
  }

  return (
    <ul className={styles.list}>
      {notifications.map((notification) => {
        const formatted = formatNotification(notification);
        return (
          <li key={notification.id} className={styles.item}>
            <NotificationItem
              title={formatted.title}
              description={formatted.description}
              meta={formatted.meta}
              icon={<IdeaIcon width={24} height={24} />}
              ctaLabel="Перейти"
              onCta={() => onNotificationClick(notification)}
              viewed={notification.isViewed}
            />
          </li>
        );
      })}
    </ul>
  );
};
