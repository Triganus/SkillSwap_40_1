import { AccordionUI } from '../CheckBoxAccordeon/AccordionUI';
import styles from './SkillsSideBarUI.module.scss';
import type { TSkillsSideBarUIprops } from './TSkillsSideBarUIProps';
import { TextUI } from '../Text';
import { Icon } from '../Icon';
import { useState, useCallback, useMemo, useEffect } from 'react';
import type { SkillCategoriesData, SkillListItem } from '@/entities/Skill';
import { TitleUI } from '../Title';

type SelectedByCategory = Record<string, string[]>;

const VISIBLE_LIMIT = 6;

export const SkillsSideBarUI: React.FC<TSkillsSideBarUIprops> = ({
  data,
  title,
  onChange,
}: TSkillsSideBarUIprops) => {
  const [sideBarOpened, setSideBarOpened] = useState(false);

  const [selected, setSelected] = useState<SelectedByCategory>({});
  const handleSelectChange = useCallback((category: string, selectedIds: (string | number)[]) => {
    setSelected((prev) => ({
      ...prev,
      [category]: selectedIds.map(String),
    }));
  }, []);

  const aggregatedJson: SkillCategoriesData = useMemo(() => {
    const dict: Record<string, Record<string, SkillListItem>> = {};
    for (const cat of data.skill_categories) {
      dict[cat.category] = {};
      for (const s of cat.skills) dict[cat.category][s.skill_id] = s;
    }
    return {
      skill_categories: Object.entries(selected).map(([category, ids]) => ({
        category,
        skills: ids.map(
          (id) => dict[category]?.[id] ?? { skill_id: id, skill_name: id, skill_image: '' }
        ),
      })),
    };
  }, [selected, data]);

  useEffect(() => {
    if (onChange) onChange(aggregatedJson);
  }, [aggregatedJson, onChange]);

  const handleToggle = () => setSideBarOpened((v) => !v);

  const isCollapsed = !sideBarOpened;

  return (
    <div className={styles.wrapper}>
      <div className={styles.skillsSideBarHeader}>
        <TitleUI size="small">{title}</TitleUI>
      </div>

      <div className={styles.skillsList}>
        {data.skill_categories.map((item, idx) => {
          const hidden = isCollapsed && idx >= VISIBLE_LIMIT;
          return (
            //  обрнул в  div, чтобы можно было применить display:none, но не размонтировать
            <div
              key={item.category}
              className={hidden ? styles.hiddenItem : undefined}
              aria-hidden={hidden}
            >
              <AccordionUI data={item} title={item.category} onSelectChange={handleSelectChange} />
            </div>
          );
        })}

        <button
          type="button"
          className={styles.toggle}
          onClick={handleToggle}
          aria-expanded={sideBarOpened}
          aria-controls="skills-list"
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
