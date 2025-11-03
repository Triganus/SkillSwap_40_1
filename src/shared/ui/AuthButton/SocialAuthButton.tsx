import React from 'react';
import { Button } from '@shared/ui';
import type { AuthButtonProps } from './types';
import styles from './SocialAuthButton.module.scss';
import { Icon } from '../Icon/Icon';

export const AuthButton: React.FC<AuthButtonProps> = ({ provider, onClick, className }) => {
  const labels = {
    google: 'Продолжить с Google',
    apple: 'Продолжить с Apple',
  };

  const iconNames = {
    google: 'google',
    apple: 'apple',
  };

  return (
    <Button
      variant="secondary"
      onClick={onClick}
      className={`${styles.socialButton} ${className || ''}`}
      type="button"
    >
      <Icon
        name={iconNames[provider]}
        size={24}
        className={`${styles.socialButtonIcon} ${provider === 'apple' ? styles.appleIcon : ''}`}
        fill={provider === 'apple' ? '#253017' : undefined}
      />
      <span className={styles.label}>{labels[provider]}</span>
    </Button>
  );
};
