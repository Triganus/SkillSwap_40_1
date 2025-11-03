import React from 'react';
import { Button } from '@shared/ui/Button';
import type { GuestActionsProps } from '../type';
import styles from './user-block.module.scss';

export const GuestActions: React.FC<GuestActionsProps> = ({ onLogin, onRegister, className }) => {
  return (
    <div className={`${styles.container} ${className || ''}`}>
      <Button variant="secondary" onClick={onLogin}>
        Войти
      </Button>
      <Button variant="primary" onClick={onRegister}>
        Зарегистрироваться
      </Button>
    </div>
  );
};
