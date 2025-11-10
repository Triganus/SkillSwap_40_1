import styles from './NotificationItem.module.scss';
import type { TNotificationItemProps } from './TNotificationItemProps';
import { Button } from '../Button';
import { TextUI } from '../Text';
import { useState } from 'react';

export function NotificationItem({
  title,
  description,
  meta,
  icon,
  ctaLabel = 'Перейти',
  onCta,
  viewed = false,
  hideCtaAfterClick = true,
  className = '',
  style,
}: TNotificationItemProps) {
  const [ctaHidden, setCtaHidden] = useState(false);

  const handleClick = () => {
    onCta?.();
    if (hideCtaAfterClick) setCtaHidden(true);
  };

  const showCta = !viewed && !ctaHidden;

  return (
    <div className={[styles.wrapper, className].filter(Boolean).join(' ')} style={style}>
      <div className={styles.topRow}>
        {icon && <div className={styles.icon}>{icon}</div>}
        <div className={styles.texts}>
          <TextUI variant="body">{title}</TextUI>
          <TextUI variant="caption" color="secondary">
            {description}
          </TextUI>
        </div>
        {meta && (
          <div className={styles.meta}>
            <TextUI variant="caption" color="muted">
              {meta}
            </TextUI>
          </div>
        )}
      </div>

      {showCta && (
        <div className={styles.ctaRow}>
          <Button onClick={handleClick} variant="white">
            {ctaLabel}
          </Button>
        </div>
      )}
    </div>
  );
}

export default NotificationItem;
