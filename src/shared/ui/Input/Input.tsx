import React, { useMemo, useState } from 'react';
import type { InputProps } from './types';
import styles from './Input.module.scss';
import { Icon } from '../Icon/Icon';

export const Input: React.FC<InputProps> = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  disabled = false,
  error = false,
  size = 'medium',
  className = '',
  showPasswordToggle = true,
  ...props
}) => {
  const [show, setShow] = useState(false);
  const isPassword = type === 'password';
  const inputType = useMemo(() => (isPassword && show ? 'text' : type), [isPassword, show, type]);
  const inputClasses = [
    styles.input,
    styles[size],
    error ? styles.error : '',
    disabled ? styles.disabled : '',
    isPassword && showPasswordToggle ? styles.withSuffix : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (isPassword && showPasswordToggle) {
    return (
      <span className={styles.wrapper}>
        <input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={inputClasses}
          {...props}
        />
        <button
          type="button"
          aria-label={show ? 'Скрыть пароль' : 'Показать пароль'}
          className={styles.suffixBtn}
          onClick={() => setShow((s) => !s)}
          tabIndex={-1}
        >
          <Icon name={show ? 'eye-slash' : 'eye'} size={20} />
        </button>
      </span>
    );
  }

  return (
    <input
      type={inputType}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={inputClasses}
      {...props}
    />
  );
};
