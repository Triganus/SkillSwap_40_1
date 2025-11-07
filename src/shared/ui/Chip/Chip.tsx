import React from 'react';
import styles from './Chip.module.scss';
import { Icon } from '@/shared/ui/Icon';

export interface ChipProps {
  label: string;
  onRemove?: () => void;
  className?: string;
  title?: string;
}

export const Chip: React.FC<ChipProps> = ({ label, onRemove, className = '', title }) => {
  return (
    <span className={[styles.chip, className].filter(Boolean).join(' ')} title={title || label}>
      <span className={styles.label}>{label}</span>
      {onRemove && (
        <button
          type="button"
          className={styles.remove}
          aria-label={`Убрать фильтр ${label}`}
          onClick={onRemove}
        >
          <Icon name="cross" size={16} />
        </button>
      )}
    </span>
  );
};
