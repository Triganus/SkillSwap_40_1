import React, { useState } from 'react';
import type { TAvatarUIProps } from './TAvatarUIProps';
import styles from './AvatarUI.module.scss';

export const AvatarUI: React.FC<TAvatarUIProps> = ({
  src,
  alt = 'Avatar',
  fallback,
  className,
}) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const getInitials = (text: string): string => {
    const words = text.trim().split(' ');
    if (words.length >= 2) {
      return `${words[0][0]}${words[1][0]}`.toUpperCase();
    }
    return text.slice(0, 2).toUpperCase();
  };

  const showImage = src && !imageError;

  return (
    <div className={`${styles.avatar} ${className || ''}`}>
      {showImage ? (
        <img src={src} alt={alt} className={styles.avatarImage} onError={handleImageError} />
      ) : (
        <div className={styles.avatarFallback}>{fallback ? getInitials(fallback) : '?'}</div>
      )}
    </div>
  );
};
