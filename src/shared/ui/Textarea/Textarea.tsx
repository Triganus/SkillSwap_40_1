import { forwardRef } from 'react';
import type { TextareaProps } from './types';
import styles from './Textarea.module.scss';

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      placeholder,
      value,
      onChange,
      disabled = false,
      error = false,
      size = 'medium',
      className = '',
      rows = 4,
      maxLength,
      showCounter = false,
      resize = 'vertical',
      ...props
    },
    ref
  ) => {
    const textareaClasses = [
      styles.textarea,
      styles[size],
      error ? styles.error : '',
      disabled ? styles.disabled : '',
      styles[`resize-${resize}`],
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const currentLength = typeof value === 'string' ? value.length : 0;
    const showCounterElement = showCounter && maxLength !== undefined;
    const counterError = maxLength !== undefined && currentLength > maxLength;

    const baseProps = {
      ref,
      placeholder,
      disabled,
      className: textareaClasses,
      rows,
      ...(maxLength !== undefined ? { maxLength } : {}),
      ...props,
      ...(onChange ? { onChange } : {}),
      ...(value !== undefined ? { value } : {}),
    } as const;

    if (showCounterElement) {
      return (
        <span className={styles.wrapper}>
          <textarea {...baseProps} />
          <span className={`${styles.counter} ${counterError ? styles.counterError : ''}`}>
            {currentLength}/{maxLength}
          </span>
        </span>
      );
    }

    return <textarea {...baseProps} />;
  }
);

Textarea.displayName = 'Textarea';

