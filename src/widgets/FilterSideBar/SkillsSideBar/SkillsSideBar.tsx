import { AccordionUI } from '@shared/ui/CheckBoxAccordeon/AccordionUI.tsx';
import styles from './SkillsSideBar.module.scss';
import type { TSkillsSideBarProps } from './TSkillsSideBarProps';
import { TextUI, Icon } from '@/shared/ui';
import { useState, useCallback, useMemo } from 'react';
import type { SkillCategoriesData, SkillListItem } from '@/entities/Skill';
import { TitleUI } from '@/shared/ui/Title';

type SelectedByCategory = Record<string, string[]>;

const VISIBLE_LIMIT = 6;

export const SkillsSideBar: React.FC<TSkillsSideBarProps> = ({
  data,
  title,
  value,
  onChange,
}: TSkillsSideBarProps) => {
  const [sideBarOpened, setSideBarOpened] = useState(false);

  const selected: SelectedByCategory = useMemo(() => {
    if (!value) return {};

    const result: SelectedByCategory = {};

    value.skill_categories.forEach((cat) => {
      result[cat.category] = cat.skills.map((s) => s.skill_id);
    });

    return result;
  }, [value]);

  const handleSelectChange = useCallback(
    (category: string, selectedIds: (string | number)[]) => {
      if (!onChange) return;

      const newSelected = {
        ...selected,
        [category]: selectedIds.map(String),
      };

      const dict: Record<string, Record<string, SkillListItem>> = {};
      for (const cat of data.skill_categories) {
        dict[cat.category] = {};

        for (const s of cat.skills) dict[cat.category][s.skill_id] = s;
      }

      const aggregatedJson: SkillCategoriesData = {
        skill_categories: Object.entries(newSelected)
          .filter(([, ids]) => ids.length > 0) // Фильтруем пустые категории
          .map(([category, ids]) => ({
            category,
            skills: ids.map(
              (id) => dict[category]?.[id] ?? { skill_id: id, skill_name: id, skill_image: '' }
            ),
          })),
      };

      onChange(aggregatedJson);
    },
    [selected, data, onChange]
  );

  const handleToggle = () => setSideBarOpened((v) => !v);

  const isCollapsed = !sideBarOpened;

  return (
    <div
      className={styles.wrapper}
      role="region"
      aria-label={`${title}. Выберите навыки по категориям.`}
    >
      <div className={styles.skillsSideBarHeader}>
        <TitleUI size="small">{title}</TitleUI>
      </div>

      <div className={styles['skills-list']} aria-labelledby="skills-sidebar-title">
        {data.skill_categories.map((item, idx) => {
          const hidden = isCollapsed && idx >= VISIBLE_LIMIT;
          return (
            //  обрнул в  div, чтобы можно было применить display:none, но не размонтировать
            <div
              key={item.category}
              className={hidden ? styles['hidden-item'] : undefined}
              aria-hidden={hidden}
            >
              <AccordionUI
                data={item}
                title={item.category}
                selectedValues={selected[item.category] || []}
                onSelectChange={handleSelectChange}
                aria-label={`Категория ${item.category}`}
              />
            </div>
          );
        })}

        <button
          type="button"
          className={styles.toggle}
          onClick={handleToggle}
          aria-expanded={sideBarOpened}
          aria-controls="skills-list"
          aria-label={sideBarOpened ? 'Свернуть категории' : 'Показать все категории'}
        >
          <TextUI color="link" variant="body">
            {sideBarOpened ? 'Свернуть' : 'Все категории'}
          </TextUI>
          <Icon
            name={sideBarOpened ? 'chevron-up' : 'chevron-down'}
            size={20}
            className={styles.icon}
          />
        </button>
      </div>
    </div>
  );
};
