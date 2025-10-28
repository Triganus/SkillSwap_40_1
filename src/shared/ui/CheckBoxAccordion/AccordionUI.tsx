import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
  onSelectChange,
}: TAccordionUIProps) {
  // Состояние раскрытия
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const open = isOpen ?? internalOpen;

  const handleToggle = useCallback(() => {
    const next = !open;
    if (isOpen === undefined) setInternalOpen(next);
    onToggle?.(next);
  }, [open, isOpen, onToggle]);

  // Выбранные навыки
  const [selected, setSelected] = useState<(string | number)[]>([]);

  // При смене категории сбрасываем выбор
  useEffect(() => {
    setSelected([]);
  }, [data?.category]);

  const skillIds = useMemo(
    () => (data ? data.skills.map((s) => s.skill_id) : []),
    [data]
  );

  const total = skillIds.length;
  const selectedCount = selected.length;

  const headerChecked = total > 0 && selectedCount === total;
  const indeterminate = selectedCount > 0 && selectedCount < total;

  // Выбор одного навыка
  const handleSkillChange = useCallback(
    (_: React.ChangeEvent<HTMLInputElement>, checked: boolean, value?: string | number) => {
      if (!data || value == null) return;
      setSelected((prev) => {
        const next = checked
          ? [...new Set([...prev, value])]
          : prev.filter((v) => v !== value);
        onSelectChange?.(data.category, next);
        return next;
      });
    },
    [data, onSelectChange]
  );

  // Выбрать / снять все
  const handleSetAllChange = useCallback(
    (_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
      if (!data) return;
      setSelected(() => {
        const next = checked ? skillIds : [];
        onSelectChange?.(data.category, next);
        return next;
      });
    },
    [data, skillIds, onSelectChange]
  );

  return (
    <>
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
          className={styles.toggle}
          onClick={handleToggle}
          disabled={disabled}
        >
          <Icon
            name={open ? 'chevron-up' : 'chevron-down'}
            size={20}
            className={styles.icon}
          />
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
              checked={selected.includes(item.skill_id)}
              onChange={handleSkillChange}
            />
          ))}
        </div>
      )}
    </>
  );
}

export default AccordionUI;
