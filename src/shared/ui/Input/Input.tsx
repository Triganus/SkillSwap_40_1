import { useMemo, useState, forwardRef } from 'react';
import type { InputProps } from './types';
import styles from './Input.module.scss';
import { Icon } from '../Icon/Icon';

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
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
    },
    ref
  ) => {
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

    const baseProps = {
      ref,
      type: inputType,
      placeholder,
      disabled,
      className: inputClasses,
      ...props,
      ...(onChange ? { onChange } : {}),
      ...(value !== undefined ? { value } : {}),
    } as const;

    if (isPassword && showPasswordToggle) {
      return (
        <span className={styles.wrapper}>
          <input {...baseProps} />
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

    return <input {...baseProps} />;
  }
);

Input.displayName = 'Input';
