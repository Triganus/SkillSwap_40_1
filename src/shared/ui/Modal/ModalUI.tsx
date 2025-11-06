import React, { useEffect } from 'react';
import type { TModalUIProps } from '@shared/ui';
import styles from './ModalUI.module.scss';

export const ModalUI: React.FC<TModalUIProps> = ({
  isOpen,
  onClose,
  title,
  children,
  actions,
  className,
  icon,
}) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={`${styles.modal} ${className || ''}`} role="dialog" aria-modal="true">
        <div className={styles.content}>
          {icon && <div className={styles.icon}>{icon}</div>}

          <div className={styles.textContent}>
            {title && <h2 className={styles.title}>{title}</h2>}
            <div className={styles.body}>{children}</div>
          </div>

          {actions && actions.length > 0 && (
            <div className={styles.actions}>
              {actions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.onClick}
                  className={`${styles.actionButton} ${
                    action.variant === 'secondary' ? styles.secondaryButton : styles.primaryButton
                  }`}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
