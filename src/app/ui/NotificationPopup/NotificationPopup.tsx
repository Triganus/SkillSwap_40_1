import { useCallback } from 'react';
import { usePopup } from '@app/hooks/usePopup';
import { ModalUI, Button } from '@shared/ui';
import styles from './NotificationPopup.module.scss';

/**
 * Глобальный компонент для отображения notification попапов.
 * Управляется через Redux store, можно вызвать из любого места через usePopup hook.
 *
 * @example
 * const { showPopup } = usePopup();
 *
 * showPopup({
 *   icon: <CheckIcon />,
 *   title: 'Успешно!',
 *   message: 'Ваше действие выполнено',
 *   buttonText: 'Готово',
 * });
 */
export function NotificationPopup() {
  const { activePopup, hidePopup } = usePopup();
  const handleClose = useCallback(() => {
    if (activePopup?.onClose) {
      activePopup.onClose();
    }
    hidePopup();
  }, [activePopup, hidePopup]);

  if (!activePopup) {
    return null;
  }

  return (
    <ModalUI isOpen={true} onClose={handleClose} title="" className={styles.notificationModal}>
      <div className={styles.notificationContent}>
        {activePopup.icon && (
          <div className={styles.iconWrapper}>
            <div className={styles.icon}>{activePopup.icon}</div>
          </div>
        )}

        <h2 className={styles.title}>{activePopup.title}</h2>

        <p className={styles.message}>{activePopup.message}</p>

        <Button type="button" variant="primary" className={styles.button} onClick={handleClose}>
          {activePopup.buttonText || 'Готово'}
        </Button>
      </div>
    </ModalUI>
  );
}
