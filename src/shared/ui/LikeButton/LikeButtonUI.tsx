import React from 'react';
import type { TLikeButtonUIProps } from './TLikeButtonUIProps';
import styles from './LikeButtonUI.module.scss';

export const LikeButtonUI: React.FC<TLikeButtonUIProps> = ({
  isActive = false,
  onClick,
  ariaLabel = 'Нравится',
  disabled = false,
}) => {
  const handleClick = () => {
    if (!disabled && onClick) {
      onClick();
    }
  };

  return (
    <button
      className={styles.likeButton}
      onClick={handleClick}
      disabled={disabled}
      aria-label={ariaLabel}
      type="button"
    >
      {isActive ? (
        <svg className={styles.heartIcon} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path
            className={styles.heartIconFilled}
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
          />
        </svg>
      ) : (
        <svg className={styles.heartIcon} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path
            className={styles.heartIconOutline}
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      )}
    </button>
  );
};
