import React from 'react';
import type { ButtonProps } from './types';
import styles from './Button.module.scss';

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  className = '',
  ...props
}) => {
  const buttonClasses = [styles.button, styles[variant], className].filter(Boolean).join(' ');

  return (
    <button className={buttonClasses} {...props}>
      {children}
    </button>
  );
};
