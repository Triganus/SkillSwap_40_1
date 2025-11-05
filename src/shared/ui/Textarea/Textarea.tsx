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

    return <textarea {...baseProps} />;
  }
);

Textarea.displayName = 'Textarea';
