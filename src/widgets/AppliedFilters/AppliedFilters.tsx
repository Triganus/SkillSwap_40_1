import React from 'react';
import { TextUI, Icon } from '@/shared/ui';
import type { TAppliedFiltersProps, FilterType } from './type';
import styles from './AppliedFilters.module.scss';

export const AppliedFilters: React.FC<TAppliedFiltersProps> = ({ filters, onRemoveFilter }) => {
  if (!filters.filtersApplied) {
    return null;
  }

  // Формируем массив фильтров для отображения
  const filterTags: Array<{ type: FilterType; label: string; value: string }> = [];

  if (filters.general && filters.general !== 'Всё') {
    filterTags.push({
      type: 'general',
      label: filters.general,
      value: filters.general,
    });
  }

  // Навыки (извлекаем все названия навыков из категорий)
  if (filters.skills?.skill_categories) {
    filters.skills.skill_categories.forEach((category) => {
      category.skills.forEach((skill) => {
        filterTags.push({
          type: 'skill',
          label: skill.skill_name,
          value: skill.skill_id,
        });
      });
    });
  }

  // Города
  if (filters.cities && filters.cities.length > 0) {
    filters.cities.forEach((city) => {
      filterTags.push({
        type: 'city',
        label: city,
        value: city,
      });
    });
  }

  //Пол автора (если выбран не "Не имеет значения")
  if (filters.gender && filters.gender !== 'Не имеет значения') {
    filterTags.push({
      type: 'gender',
      label: filters.gender,
      value: filters.gender,
    });
  }

  // Если нет активных фильтров, не отображаем
  if (filterTags.length === 0) {
    return null;
  }

  const handleRemove = (type: FilterType, value: string) => {
    onRemoveFilter(type, value);
  };

  return (
    <div className={styles.container} role="region" aria-label="Примененные фильтры">
      <div className={styles.tags}>
        {filterTags.map((tag, index) => (
          <div key={`${tag.type}-${tag.value}-${index}`} className={styles.tag}>
            <TextUI variant="caption" color="primary" className={styles.tagText}>
              {tag.label}
            </TextUI>
            <button
              type="button"
              className={styles.removeButton}
              onClick={() => handleRemove(tag.type, tag.value)}
              aria-label={`Удалить фильтр ${tag.label}`}
            >
              <Icon name="cross" size={16} className={styles.removeIcon} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
