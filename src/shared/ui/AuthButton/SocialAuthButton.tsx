import React from 'react';
import { Button } from '../Button/Button';
import type { AuthButtonProps } from './types';
import styles from './SocialAuthButton.module.scss';
import { Icon } from '../Icon/Icon';

export const AuthButton: React.FC<AuthButtonProps> = ({
  provider,
  onClick,
  disabled = false,
  className,
}) => {
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
      size="large"
      onClick={onClick}
      disabled={disabled}
      className={`${styles['social-button']} ${className || ''}`}
      type="button"
    >
      <Icon
        name={iconNames[provider]}
        size={24}
        className={`${styles['social-button-icon']} ${
          provider === 'apple' ? styles['apple-icon'] : ''
        }`}
        fill={provider === 'apple' ? '#253017' : undefined}
      />
      <span className={styles.label}>{labels[provider]}</span>
    </Button>
  );
};
