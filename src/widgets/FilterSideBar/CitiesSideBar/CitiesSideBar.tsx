import { useMemo, useState, useCallback } from 'react';
import styles from './CitiesSideBar.module.scss';
import type { TCitiesSideBarProps } from './TCitiesSideBarProps';
import { TextUI, Icon, CheckBoxUI } from '@/shared/ui';
import { TitleUI } from '@/shared/ui/Title';
const VISIBLE_LIMIT = 5;

export const CitiesSideBar: React.FC<TCitiesSideBarProps> = ({
  cities,
  title,
  value = [],
  onChange,
}: TCitiesSideBarProps) => {
  const [opened, setOpened] = useState(false);

  const handleToggle = useCallback(() => setOpened((v) => !v), []);

  const currentSelected = useMemo(() => new Set(value), [value]);

  const handleCityToggle = useCallback(
    (_e: React.ChangeEvent<HTMLInputElement>, checked: boolean, val?: unknown) => {
      const city = String(val ?? '');

      const newSelected = new Set(currentSelected);

      if (checked) {
        newSelected.add(city);
      } else {
        newSelected.delete(city);
      }

      onChange?.(Array.from(newSelected));
    },
    [currentSelected, onChange]
  );

  const isCollapsed = !opened;

  return (
    <div className={styles.wrapper} role="group" aria-label={title ?? 'Выбор городов'}>
      <div className={styles.header}>
        <TitleUI size="small" id="cities-label">
          {title}
        </TitleUI>
      </div>

      <div className={styles.list} id="cities-list">
        {cities.map((city, idx) => {
          const hidden = isCollapsed && idx >= VISIBLE_LIMIT;
          const checked = currentSelected.has(city);

          return (
            <div
              key={city}
              className={hidden ? styles['hidden-item'] : undefined}
              aria-hidden={hidden || undefined}
              style={hidden ? { display: 'none' } : undefined}
            >
              <CheckBoxUI
                name="cities"
                value={city}
                label={city}
                checked={checked}
                onChange={handleCityToggle}
                size="lg"
                aria-checked={checked}
              />
            </div>
          );
        })}

        {cities.length > VISIBLE_LIMIT && (
          <button
            type="button"
            className={styles.toggle}
            onClick={handleToggle}
            aria-expanded={opened}
            aria-controls="cities-list"
            aria-label={opened ? 'Свернуть список городов' : 'Показать все города'}
          >
            <TextUI color="link" variant="body">
              {opened ? 'Свернуть' : 'Все города'}
            </TextUI>
            <Icon
              name={opened ? 'chevron-up' : 'chevron-down'}
              size={20}
              className={styles.icon}
              aria-hidden="true"
            />
          </button>
        )}
      </div>
    </div>
  );
};
