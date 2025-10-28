import React from 'react';
import { GuestActions } from './GuestActions';
import { UserBadge } from './UserBadge';
import { useHeaderUser } from '../model/useHeaderUser';
import styles from './user-block.module.scss';
import { useNavigate } from 'react-router-dom';

export const HeaderUserBlock: React.FC<{ className?: string }> = ({ className }) => {
  const { user, isGuest } = useHeaderUser();
  const navigate = useNavigate();

  if (isGuest) {
    return (
      <GuestActions
        className={className}
        onLogin={() => navigate('/login')}
        onRegister={() => navigate('/register')}
      />
    );
  }

  if (!user) {
    return;
  }

  return (
    <UserBadge
      className={`${styles.container} ${className || ''}`}
      name={user.name}
      avatarSrc={user.avatarSrc}
      onClick={() => navigate('/profile')}
    />
  );
};
