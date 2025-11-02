import type React from 'react';

export interface InputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'size' | 'type' | 'onChange' | 'value' | 'className'
  > {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  placeholder?: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  error?: boolean;
  size?: 'small' | 'medium' | 'large';
  className?: string;
  id?: string;
  showPasswordToggle?: boolean;
}
