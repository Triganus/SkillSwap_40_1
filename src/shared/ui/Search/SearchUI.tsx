import React from 'react';
import type { SearchUIProps } from './type';
import styles from './SearchUI.module.scss';

export const SearchUI: React.FC<SearchUIProps> = ({
  placeholder = 'Искать навык',
  value = '',
  onChange,
  onKeyDown,
  onClick,
  className = '',
  disabled = false,
}) => {
  const containerClasses = [styles.searchContainer, disabled ? styles.disabled : '', className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={containerClasses}>
      <div className={styles.searchIcon}>
        <div>[Иконка "Поиск"]</div>
      </div>
      <input
        type="text"
        className={styles.searchInput}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        disabled={disabled}
        aria-label="Поиск навыков"
      />
      <button
        className={styles.searchButton}
        onClick={onClick}
        disabled={disabled}
        aria-label="Выполнить поиск"
      >
        <div>[Иконка "Поиск"]</div>
      </button>
    </div>
  );
};
