import React from 'react';
import { AvatarUI } from '@shared/ui/AvatarUI';
import type { UserBadgeProps } from '../type';
import styles from './user-block.module.scss';

/**
 * Логотип пользователя: имя + аватар.
 * Чистый презентационный компонент.
 */
export const UserBadge: React.FC<UserBadgeProps> = ({ name, avatarSrc, onClick, className }) => {
  return (
    <button
      type="button"
      className={`${styles.userBadge} ${className || ''}`}
      onClick={onClick}
      aria-label={`Открыть профиль пользователя ${name}`}
    >
      <span className={styles.userName}>{name}</span>
      <AvatarUI src={avatarSrc} fallback={name} size={40} />
    </button>
  );
};
