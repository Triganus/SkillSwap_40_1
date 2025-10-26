import React, { forwardRef, memo, useCallback, useEffect, useId, useMemo, useRef } from 'react';
import type { TCheckBoxUIProps } from '@shared/ui';
import { Icon } from '@shared/ui/Icon';
import styles from './CheckBoxUI.module.scss';

/**
 * CheckBoxUI
 * Доступный чекбокс на базе нативного input[type="checkbox"].
 *
 * Примечания:
 * - Используйте либо контролируемый (checked), либо неконтролируемый (defaultChecked) режим, но не оба.
 * - `label` обязателен, когда не предоставлен `ariaLabel`. В большинстве случаев предпочтительнее видимая метка.
 */
const CheckBoxUINode = forwardRef<HTMLInputElement, TCheckBoxUIProps>(
  function CheckBoxUI(props, ref) {
    const {
      name,
      value,
      label,
      checked,
      defaultChecked,
      indeterminate = false,
      disabled = false,
      required = false,
      readOnly = false,
      id,
      ariaLabel,
      ariaDescribedBy,
      error = false,
      errorMessage,
      hint,
      onChange,
      onFocus,
      onBlur,
      className,
      size = 'lg',
      fullWidth = false,
      tabIndex,
      checkedMark = 'done',
    } = props;

    const reactId = useId();
    const inputId = id ?? `cb-${reactId}`;

    const errorId = errorMessage ? `${inputId}-error` : undefined;
    const hintId = hint ? `${inputId}-hint` : undefined;
    const describedBy = useMemo(() => {
      const ids = [ariaDescribedBy, hintId, errorId].filter(Boolean).join(' ').trim();
      return ids.length ? ids : undefined;
    }, [ariaDescribedBy, hintId, errorId]);

    const isReadOnly = readOnly || false;

    const localInputRef = useRef<HTMLInputElement | null>(null);

    // Сливаем внешний ref с локальным
    useEffect(() => {
      if (!ref) return;
      const node = localInputRef.current;
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref && 'current' in ref) {
        (ref as unknown as { current: HTMLInputElement | null }).current = node;
      }
    }, [ref]);

    // Выставляем indeterminate на DOM-элемент
    useEffect(() => {
      if (localInputRef.current) {
        localInputRef.current.indeterminate = Boolean(indeterminate);
        localInputRef.current.setAttribute('data-indeterminate', String(Boolean(indeterminate)));
      }
    }, [indeterminate]);

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        if (isReadOnly) {
          e.preventDefault();
          e.stopPropagation();

          return;
        }
        onChange?.(e, e.target.checked, value);
      },
      [isReadOnly, onChange, value]
    );

    const handleClick = useCallback(
      (e: React.MouseEvent<HTMLInputElement>) => {
        if (isReadOnly) {
          e.preventDefault();
          e.stopPropagation();
        }
      },
      [isReadOnly]
    );

    const rootClass = useMemo(() => {
      const arr = [styles.container];
      const sizeClass = styles[size as 'sm' | 'md' | 'lg'];

      if (sizeClass) arr.push(sizeClass);
      if (fullWidth) arr.push(styles.fullWidth);
      if (error) arr.push(styles.isError);
      if (className) arr.push(className);

      return arr.join(' ');
    }, [size, fullWidth, error, className]);

    const labelText = label ?? null;
    const ariaLabelFinal = labelText ? undefined : ariaLabel;

    return (
      <div className={rootClass} data-readonly={isReadOnly || undefined}>
        <input
          ref={localInputRef}
          id={inputId}
          className={styles.input}
          type="checkbox"
          name={name}
          value={value == null ? undefined : String(value)}
          checked={checked}
          defaultChecked={defaultChecked}
          disabled={disabled}
          required={required}
          readOnly={readOnly}
          aria-label={ariaLabelFinal}
          aria-invalid={error || undefined}
          aria-describedby={describedBy}
          tabIndex={tabIndex}
          data-checked-mark={checkedMark}
          onChange={handleChange}
          onClick={handleClick}
          onFocus={onFocus}
          onBlur={onBlur}
        />
        <label htmlFor={inputId} className={`${styles.label} ${isReadOnly ? styles.readOnly : ''}`}>
          <span className={styles.content}>
            <span className={styles.control} aria-hidden="true">
              <Icon name="checkbox-empty" size="100%" className={styles.iconEmpty} />
              <Icon name="checkbox-done" size="100%" className={styles.iconDone} />
              <Icon name="checkbox-remove" size="100%" className={styles.iconRemove} />
            </span>
            {labelText && <span className={styles.text}>{labelText}</span>}
          </span>
        </label>
        {hint && (
          <div id={hintId} className={styles.hint} aria-live="polite">
            {hint}
          </div>
        )}
        {errorMessage && (
          <div id={errorId} className={styles.errorMessage} aria-live="assertive">
            {errorMessage}
          </div>
        )}
      </div>
    );
  }
);

export const CheckBoxUI = memo(CheckBoxUINode);

export default CheckBoxUI;
