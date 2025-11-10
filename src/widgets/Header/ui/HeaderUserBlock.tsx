import React, { useState } from 'react';
import { GuestActions } from './GuestActions';
import { UserBadge } from './UserBadge';
import { UserMenu } from './UserMenu';
import { useHeaderUserV2 } from '../model/useHeaderUserV2';
import { Popover } from '@shared/ui/Popover';
import styles from './user-block.module.scss';
import { useNavigate } from 'react-router-dom';

export const HeaderUserBlock: React.FC<{ className?: string }> = ({ className }) => {
  const { user, isGuest } = useHeaderUserV2();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

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
    <Popover
      trigger={
        <UserBadge
          className={`${styles.container} ${className || ''}`}
          name={user.name}
          avatarSrc={user.avatarSrc}
        />
      }
      content={<UserMenu onClose={() => setIsOpen(false)} />}
      isOpen={isOpen}
      onOpenChange={setIsOpen}
    />
  );
};
