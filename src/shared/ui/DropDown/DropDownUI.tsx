import React, { useId } from 'react';
import type { TDropDownUIProps } from './types';
import { Icon } from '@shared/ui/Icon';
import styles from './DropDownUI.module.scss';

export const DropDownUI: React.FC<TDropDownUIProps> = ({
  options = [],
  value,
  defaultValue,
  onChange,
  placeholder = 'Выберите значение',
  label,
  hint,
  error = false,
  errorMessage,
  size = 'medium',
  disabled = false,
  required = false,
  id,
  ariaLabel,
  className = '',
  fullWidth = false,
  isOpen = false,
  onToggle,
}) => {
  const reactId = useId();
  const dropdownId = id ?? `dropdown-${reactId}`;
  const triggerId = `${dropdownId}-trigger`;
  const menuId = `${dropdownId}-menu`;

  const displayValue = value ?? defaultValue ?? '';
  const selectedOption = options.find((opt) => opt.value === displayValue);
  const displayText = selectedOption?.label || placeholder;
  const showPlaceholder = !selectedOption;

  const rootClasses = [styles.dropdown, fullWidth ? styles.fullWidth : '', className]
    .filter(Boolean)
    .join(' ');

  const triggerClasses = [
    styles.trigger,
    styles[size],
    showPlaceholder ? styles.placeholder : '',
    error ? styles.error : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={rootClasses}>
      {label && (
        <label htmlFor={triggerId} className={`${styles.label} ${required ? styles.required : ''}`}>
          {label}
        </label>
      )}

      <button
        id={triggerId}
        type="button"
        className={triggerClasses}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={menuId}
        aria-label={ariaLabel || label}
        aria-invalid={error || undefined}
        onClick={onToggle}
      >
        <span className={styles.triggerContent}>{displayText}</span>
        <Icon
          name="chevron-down"
          size={20}
          className={`${styles.icon} ${isOpen ? styles.open : ''}`}
          aria-hidden="true"
        />
      </button>

      {isOpen && !disabled && (
        <div id={menuId} className={styles.dropdownMenu} role="listbox" aria-labelledby={triggerId}>
          {options.map((option) => {
            const isSelected = option.value === displayValue;

            return (
              <div
                key={option.value}
                role="option"
                aria-selected={isSelected}
                className={`${styles.option} ${isSelected ? styles.selected : ''}`}
                onClick={() => !disabled && onChange?.(option.value)}
              >
                {option.label}
              </div>
            );
          })}
        </div>
      )}

      {hint && !error && <div className={styles.hint}>{hint}</div>}

      {error && errorMessage && (
        <div className={styles.errorMessage} role="alert">
          {errorMessage}
        </div>
      )}
    </div>
  );
};

export default DropDownUI;
