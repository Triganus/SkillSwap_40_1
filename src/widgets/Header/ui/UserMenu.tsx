import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthV2 } from '@app/Provider';
import styles from './UserMenu.module.scss';
import { Icon } from '@shared/ui';

interface UserMenuProps {
  onClose?: () => void;
}

export const UserMenu: React.FC<UserMenuProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const { logout } = useAuthV2();

  const handleProfileClick = () => {
    navigate('/profile');
    onClose?.();
  };

  const handleLogoutClick = () => {
    logout();
    navigate('/');
    onClose?.();
  };

  return (
    <div className={styles.menu}>
      <button type="button" className={styles.menuItem} onClick={handleProfileClick}>
        Личный кабинет
      </button>
      <button type="button" className={styles.menuItem} onClick={handleLogoutClick}>
        <span>Выйти из аккаунта</span>
        <Icon name="logout" />
      </button>
    </div>
  );
};
