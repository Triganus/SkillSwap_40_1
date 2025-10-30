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
  onChange,
}) => {
  const [selected, setSelected] = useState<string | null>(defaultValue);

  const handleRadioChange = useCallback(
    (_e: React.ChangeEvent<HTMLInputElement>, value?: unknown) => {
      const val = String(value ?? '');
      setSelected(val);
    },
    []
  );

  useEffect(() => {
    if (selected !== null) onChange?.(selected);
  }, [selected, onChange]);

  return (
    <div className={styles.wrapper}>
      {title && (
        <div className={styles.header}>
          <TitleUI size="small">{title}</TitleUI>
        </div>
      )}

      <div className={styles.list}>
        {items.map((item) => (
          <RadioButtonUI
            key={item}
            name={name}
            value={item}
            label={item}
            checked={selected === item}
            onChange={handleRadioChange}
            size="md"
          />
        ))}
      </div>
    </div>
  );
};
