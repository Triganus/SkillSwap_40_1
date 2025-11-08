import React, { useCallback, useMemo, useState } from 'react';
import { Icon } from '../Icon';
import { CheckBoxUI } from '../CheckBox';
import styles from './AccordionUI.module.scss';
import type { TAccordionUIProps } from './TAccordionUIProps';

export function AccordionUI({
  data,
  defaultOpen = false,
  isOpen,
  onToggle,
  checkboxProps,
  disabled = false,
  selectedValues = [],
  onSelectChange,
}: TAccordionUIProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const open = isOpen ?? internalOpen;
  const currentSelected = selectedValues;

  const handleToggle = useCallback(() => {
    const next = !open;
    if (isOpen === undefined) setInternalOpen(next);
    onToggle?.(next);
  }, [open, isOpen, onToggle]);

  const skillIds = useMemo(() => (data ? data.skills.map((s) => s.skill_id) : []), [data]);

  const total = skillIds.length;
  const selectedCount = currentSelected.length;

  const headerChecked = total > 0 && selectedCount === total;
  const indeterminate = selectedCount > 0 && selectedCount < total;

  // Выбор одного навыка
  const handleSkillChange = useCallback(
    (_: React.ChangeEvent<HTMLInputElement>, checked: boolean, value?: string | number) => {
      if (!data || value == null) return;

      const next = checked
        ? [...new Set([...currentSelected, value])]
        : currentSelected.filter((v) => v !== value);
      const categoryIdentifier = data.categoryId || data.category;

      onSelectChange?.(categoryIdentifier, next);
    },
    [data, currentSelected, onSelectChange]
  );

  // Выбрать / снять все
  const handleSetAllChange = useCallback(
    (_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
      if (!data) return;

      const next = checked ? skillIds : [];
      const categoryIdentifier = data.categoryId || data.category;

      onSelectChange?.(categoryIdentifier, next);
    },
    [data, skillIds, onSelectChange]
  );

  return (
    <>
      {' '}
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <CheckBoxUI
            {...checkboxProps}
            label={data?.category}
            disabled={disabled || checkboxProps?.disabled}
            onChange={handleSetAllChange}
            indeterminate={indeterminate}
            checked={headerChecked}
          />

          <button
            type="button"
            className={`${styles.toggle} ${indeterminate || open ? styles['show-chevron'] : ''}`}
            onClick={handleToggle}
            disabled={disabled}
          >
            <Icon name={open ? 'chevron-up' : 'chevron-down'} size={20} />
          </button>
        </div>

        {open && data && (
          <div className={styles.panel}>
            {data.skills.map((item) => (
              <CheckBoxUI
                key={item.skill_id}
                name={`${data.category}-${item.skill_id}`}
                value={item.skill_id}
                label={item.skill_name}
                checked={currentSelected.includes(item.skill_id)}
                onChange={handleSkillChange}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default AccordionUI;
