import React from 'react';
import styles from './PreloaderUI.module.scss';
import type { TPreloaderUIProps } from './TPreloaderUIProps';

export const PreloaderUI: React.FC<TPreloaderUIProps> = ({
  size = 'medium',
  ariaLabel = 'Loading',
  className,
}) => {
  return (
    <div
      className={`${styles.preloader} ${styles[size]} ${className || ''}`}
      role="status"
      aria-label={ariaLabel}
      aria-live="polite"
    />
  );
}; 