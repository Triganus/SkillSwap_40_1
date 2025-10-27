import React, { useEffect, useRef } from 'react';
import type { TPopoverUIProps } from './TPopoverUIProps';
import styles from './PopoverUI.module.scss';

export const PopoverUI: React.FC<TPopoverUIProps> = ({
  isOpen,
  onClose,
  children,
  position = 'bottom',
  className,
}) => {
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div
        ref={popoverRef}
        className={`${styles.popover} ${styles[position]} ${className || ''}`}
        role="dialog"
        aria-modal="true"
      >
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
};
