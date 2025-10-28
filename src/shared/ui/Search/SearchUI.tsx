import type { InputHTMLAttributes, ChangeEvent } from 'react';
import { useCallback, useRef, useState, useMemo } from 'react';
import type { SearchUIProps } from './type';
import styles from './SearchUI.module.scss';
import { Icon } from '@shared/ui/Icon';

type NativeInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'prefix' | 'suffix' | 'disabled' | 'className' | 'type'
>;

const computeHasValue = (v: unknown): boolean => {
  if (typeof v === 'string') return v.length > 0;
  if (typeof v === 'number') return true;
  if (Array.isArray(v)) return v.length > 0;
  return false;
};

export const SearchUI = (props: SearchUIProps) => {
  const {
    className = '',
    prefix,
    suffix,
    containerProps,
    inputClassName,
    disabled,
    type,
    allowClear = true,
    onClear,
    clearAriaLabel = 'Очистить поиск',
    ...rest
  } = props;
  const inputProps: NativeInputProps = rest;
  const isControlled = inputProps.value !== undefined;

  const inputRef = useRef<HTMLInputElement>(null);

  const initialHasValue = useMemo(
    () => computeHasValue(inputProps.value ?? inputProps.defaultValue),
    [inputProps.value, inputProps.defaultValue]
  );

  const [internalHasValue, setInternalHasValue] = useState<boolean>(initialHasValue);

  const controlledHasValue = computeHasValue(inputProps.value);
  const hasValue = isControlled ? controlledHasValue : internalHasValue;

  const containerClasses = [
    styles.searchContainer,
    prefix ? styles.withPrefix : '',
    suffix || (allowClear && hasValue) ? styles.withSuffix : '',
    allowClear && hasValue ? styles.withClear : '',
    disabled ? styles.disabled : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const inputClasses = [styles.searchInput, inputClassName].filter(Boolean).join(' ');

  const ariaLabel = (inputProps as Record<string, unknown>)['aria-label'];

  const handleClear = useCallback(() => {
    if (inputRef.current) {
      const nativeInputEvent = new Event('input', { bubbles: true });

      inputRef.current.value = '';
      inputRef.current.dispatchEvent(nativeInputEvent);
    }

    const onChange = inputProps.onChange;

    if (onChange) {
      const syntheticEvent = {
        target: { value: '' },
      } as unknown as ChangeEvent<HTMLInputElement>;

      onChange(syntheticEvent);
    }

    if (!isControlled) {
      setInternalHasValue(false);
    }
    if (onClear) {
      onClear();
    }
  }, [inputProps.onChange, onClear, isControlled]);

  const handleChange = useCallback<NonNullable<NativeInputProps['onChange']>>(
    (e) => {
      if (!isControlled) {
        setInternalHasValue((e.target as HTMLInputElement).value.length > 0);
      }

      inputProps.onChange?.(e as ChangeEvent<HTMLInputElement>);
    },
    [isControlled, inputProps]
  );

  const showClearButton = allowClear && hasValue && !disabled;

  return (
    <div className={containerClasses} {...containerProps}>
      {prefix ? <span className={styles.prefix}>{prefix}</span> : null}
      <input
        {...inputProps}
        ref={inputRef}
        onChange={handleChange}
        type={type || 'search'}
        className={inputClasses}
        disabled={disabled}
        aria-label={typeof ariaLabel === 'string' ? ariaLabel : 'Поиск навыков'}
      />
      {showClearButton ? (
        <button
          type="button"
          aria-label={clearAriaLabel}
          className={styles.clearButton}
          onClick={handleClear}
        >
          <Icon name="cross" size={24} />
        </button>
      ) : null}
      {suffix ? <span className={styles.suffix}>{suffix}</span> : null}
    </div>
  );
};
