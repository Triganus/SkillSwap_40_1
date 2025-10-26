import React, { forwardRef, memo, useCallback, useId, useMemo } from 'react';
import type { TRadioButtonUIProps } from '@shared/ui';
import styles from './RadioButtonUI.module.scss';

/**
 * RadioButtonUI
 * Доступная радиокнопка, построенная на нативном input[type="radio"].
 *
 * Примечания:
 * - Используйте либо контролируемый (checked), либо неконтролируемый (defaultChecked) режим, но не оба.
 * - `label` обязателен, когда не предоставлен `ariaLabel`. В большинстве случаев предпочтительнее видимая метка.
 *
 * Пример использования:
 * <form>
 *   <RadioButtonUI name="level" value="all" label="Всё" defaultChecked onChange={(e, v) => {}} />
 *   <RadioButtonUI name="level" value="learn" label="Хочу научиться" />
 *   <RadioButtonUI name="level" value="teach" label="Могу научить" />
 * </form>
 */
const RadioButtonUINode = forwardRef<HTMLInputElement, TRadioButtonUIProps>(
  function RadioButtonUI(props, ref) {
    const {
      name,
      value,
      label,
      checked,
      defaultChecked,
      disabled = false,
      required = false,
      readOnly = false,
      id,
      ariaLabel,
      ariaDescribedBy,
      error = false,
      errorMessage,
      onChange,
      onFocus,
      onBlur,
      className,
      size = 'lg',
      fullWidth = false,
      tabIndex,
    } = props;

    const reactId = useId();
    const inputId = id ?? `rb-${reactId}`;

    const errorId = errorMessage ? `${inputId}-error` : undefined;
    const describedBy = useMemo(() => {
      const ids = [ariaDescribedBy, errorId].filter(Boolean).join(' ').trim();
      return ids.length ? ids : undefined;
    }, [ariaDescribedBy, errorId]);

    const isReadOnly = readOnly || disabled;

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        if (readOnly) {
          e.preventDefault();
          return;
        }
        onChange?.(e, value);
      },
      [onChange, readOnly, value]
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
          ref={ref}
          id={inputId}
          className={styles.input}
          type="radio"
          name={name}
          value={String(value)}
          checked={checked}
          defaultChecked={defaultChecked}
          disabled={disabled}
          required={required}
          readOnly={readOnly}
          aria-label={ariaLabelFinal}
          aria-invalid={error || undefined}
          aria-describedby={describedBy}
          tabIndex={tabIndex}
          onChange={handleChange}
          onFocus={onFocus}
          onBlur={onBlur}
        />
        <label htmlFor={inputId} className={`${styles.label} ${isReadOnly ? styles.readOnly : ''}`}>
          <span className={styles.content}>
            <span className={styles.control} aria-hidden="true" />
            {labelText && <span className={styles.text}>{labelText}</span>}
          </span>
        </label>
        {errorMessage && (
          <div id={errorId} className={styles.errorMessage} aria-live="assertive">
            {errorMessage}
          </div>
        )}
      </div>
    );
  }
);

export const RadioButtonUI = memo(RadioButtonUINode);

export default RadioButtonUI;
