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
  const wrapperClassNames = [styles.wrapper, viewed ? styles.viewed : styles.newItem, className]
    .filter(Boolean)
    .join(' ');

  const handleClick = () => {
    onCta?.();
    if (hideCtaAfterClick) setCtaHidden(true);
  };

  const showCta = !viewed && !ctaHidden;

  return (
    <div className={wrapperClassNames} style={style}>
      <div className={styles.topRow}>
        {icon && <div className={styles.icon}>{icon}</div>}
        <div className={styles.texts}>
          <TextUI variant="body" className={styles.title}>
            {title}
          </TextUI>
          <TextUI variant="caption" color="secondary" className={styles.description}>
            {description}
          </TextUI>
        </div>
        {meta && (
          <div className={styles.meta}>
            <TextUI variant="caption" color="muted" className={styles.metaText}>
              {meta}
            </TextUI>
          </div>
        )}
      </div>

      {showCta && (
        <div className={styles.ctaRow}>
          <Button onClick={handleClick} variant="primary" className={styles.ctaButton}>
            {ctaLabel}
          </Button>
        </div>
      )}
    </div>
  );
}

export default NotificationItem;
