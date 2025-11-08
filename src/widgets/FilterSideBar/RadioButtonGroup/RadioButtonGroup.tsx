import { useCallback, useEffect, useState, useMemo } from 'react';
import styles from './RadioButtonGroup.module.scss';
import type { TRadioButtonGroupProps, RadioButtonItem } from './TRadioButtonGroupProps';
import { TitleUI } from '@/shared/ui/Title';
import { RadioButtonUI } from '@/shared/ui';

export const RadioButtonGroup: React.FC<TRadioButtonGroupProps> = ({
  items,
  title,
  name = 'radio-group',
  defaultValue = null,
  value: externalValue,
  onChange,
}) => {
  // Нормализуем items в массив объектов {label, value}
  const normalizedItems = useMemo<RadioButtonItem[]>(() => {
    if (items.length === 0) return [];

    if (typeof items[0] === 'string') {
      return (items as string[]).map((item) => ({ label: item, value: item }));
    }

    return items as RadioButtonItem[];
  }, [items]);

  const [selected, setSelected] = useState<string | null>(defaultValue);

  const currentValue = externalValue !== undefined ? externalValue : selected;

  const handleRadioChange = useCallback(
    (_e: React.ChangeEvent<HTMLInputElement>, value?: unknown) => {
      const val = String(value ?? '');

      setSelected(val);

      onChange?.(val);
    },
    [onChange]
  );

  useEffect(() => {
    if (externalValue !== undefined) {
      setSelected(externalValue);
    }
  }, [externalValue]);

  return (
    <div className={styles.wrapper}>
      {title && (
        <div className={styles.header}>
          <TitleUI size="small" id={`${name}-label`}>
            {title}
          </TitleUI>
        </div>
      )}

      <div className={styles.list} aria-labelledby={title ? `${name}-label` : undefined}>
        {normalizedItems.map((item) => (
          <RadioButtonUI
            key={item.value}
            name={name}
            value={item.value}
            label={item.label}
            checked={currentValue === item.value}
            onChange={handleRadioChange}
            aria-checked={currentValue === item.value}
            size="md"
          />
        ))}
      </div>
    </div>
  );
};
