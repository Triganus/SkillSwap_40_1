import type { FC } from 'react';
import { Chip } from '@shared/ui/Chip/Chip';
import type { FilterChip } from '@/entities/filtered-content';
import styles from './ActiveFilters.module.scss';

export interface ActiveFiltersProps {
  /** Массив активных фильтров */
  filters: FilterChip[];
  /** Обработчик удаления конкретного фильтра */
  onRemove: (chipId: string) => void;
  /** Дополнительный CSS класс */
  className?: string;
}

/**
 * Компонент для отображения активных фильтров в виде чипсов
 */
export const ActiveFilters: FC<ActiveFiltersProps> = ({ filters, onRemove, className = '' }) => {
  if (filters.length === 0) {
    return null;
  }

  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles.chips}>
        {filters.map((filter) => (
          <Chip
            key={filter.id}
            label={filter.label}
            onRemove={() => onRemove(filter.id)}
            title={`Убрать фильтр: ${filter.label}`}
          />
        ))}
      </div>
    </div>
  );
};
