import React from 'react';
import type { ButtonProps } from './types';
import styles from './Button.module.scss';

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  onClick,
  type = 'button',
  className = '',
  ...props
}) => {
  const buttonClasses = [styles.button, styles[variant], className].filter(Boolean).join(' ');

  return (
    <button type={type} className={buttonClasses} onClick={onClick} {...props}>
      {children}
    </button>
  );
};
