import { useEffect, useMemo, useState, useCallback } from 'react';
import styles from './CitiesSideBar.module.scss';
import type { TCitiesSideBarProps } from './TCitiesSideBarProps';
import { TextUI, Icon, CheckBoxUI } from '@/shared/ui';
import { TitleUI } from '@/shared/ui/Title';
const VISIBLE_LIMIT = 6;

export const CitiesSideBar: React.FC<TCitiesSideBarProps> = ({
  cities,
  title,
  onChange,
  defaultSelected = [],
  resetToken,
}: TCitiesSideBarProps) => {
  const [opened, setOpened] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(() => new Set(defaultSelected));

  const handleToggle = useCallback(() => setOpened((v) => !v), []);

  const selectedList = useMemo(() => Array.from(selected), [selected]);

  useEffect(() => {
    onChange?.(selectedList);
    if (resetToken) {
      setSelected(new Set());
    }
  }, [selectedList, onChange, resetToken]);

  const handleCityToggle = useCallback(
    (_e: React.ChangeEvent<HTMLInputElement>, checked: boolean, value?: unknown) => {
      const city = String(value ?? '');
      setSelected((prev) => {
        const next = new Set(prev);
        if (checked) next.add(city);
        else next.delete(city);
        return next;
      });
    },
    []
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
          const checked = selected.has(city);

          return (
            <div
              key={city}
              className={hidden ? styles['hidden-item'] : undefined}
              aria-hidden={hidden || undefined}
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
