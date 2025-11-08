import { useCallback, useEffect, useState } from 'react';
import styles from './RadioButtonGroup.module.scss';
import type { TRadioButtonGroupProps } from './TRadioButtonGroupProps';
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
        {items.map((item) => (
          <RadioButtonUI
            key={item}
            name={name}
            value={item}
            label={item}
            checked={currentValue === item}
            onChange={handleRadioChange}
            aria-checked={currentValue === item}
            size="md"
          />
        ))}
      </div>
    </div>
  );
};
