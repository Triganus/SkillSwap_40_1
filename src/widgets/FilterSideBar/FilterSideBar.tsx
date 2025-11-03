import React, { useEffect } from 'react';
import { TextUI } from '@/shared/ui/Text';
import { Icon } from '@/shared/ui';
import { useState, useCallback } from 'react';
import type { TFilterSideBarProps } from './TFilterSideBarProps';
import styles from './FilterSideBar.module.scss';
import { TitleUI } from '@/shared/ui/Title';
import { SkillsSideBar } from './SkillsSideBar/SkillsSideBar';
import { CitiesSideBar } from './CitiesSideBar/CitiesSideBar';
import type { SkillCategoriesData } from '@/entities/Skill';
import { RadioButtonGroup } from './RadioButtonGroup';
import { GENDER_OPTIONS } from '@/shared/lib';
import { GENERAL_RB_FILTER_OPTIONS } from '@/shared/lib/constants/GeneralRbFilter';
import { CITIES } from '@/shared/lib';
export const FilterSideBar: React.FC<TFilterSideBarProps> = ({ skillsCatalog, onChange }) => {
  const [resetFilters, setResetFilters] = useState(false);
  const [filtersApplied, setFiltersApplied] = useState(false);
  const [resetToken, setResetToken] = useState(0);
  const [skillsData, setSkillsData] = useState<SkillCategoriesData | null>(null);
  const [generalFilterValue, setGeneralFilterValue] = useState<string>('Всё');
  const [genderValue, setGenderValue] = useState<string>('Не имеет значения');
  const [citiesSelected, setCitiesSelected] = useState<string[]>([]);
  const [filterCount, setFilterCount] = useState(0);
  const handleGeneralChange = useCallback((val: string) => setGeneralFilterValue(val), []);
  const handleGenderChange = useCallback((val: string) => setGenderValue(val), []);
  const handleCitiesChange = useCallback((val: string[]) => setCitiesSelected(val), []);
  const handleSkillsChange = useCallback((val: SkillCategoriesData) => setSkillsData(val), []);

  const EMPTY_SKILLS: SkillCategoriesData = { skill_categories: [] };

  const handleReset = () => {
    setResetFilters(true);
    setGeneralFilterValue('');
    setGenderValue('');
    setSkillsData(null);
    setCitiesSelected([]);
    setFiltersApplied(false);
    setFilterCount(0);
    setResetToken((t) => t + 1);
    onChange?.({
      general: null,
      gender: null,
      skills: null,
      cities: [],
      filtersApplied: false,
    });
  };

  useEffect(() => {
    const nextApplied =
      generalFilterValue !== 'Всё' ||
      genderValue !== 'Не имеет значения' ||
      skillsData?.skill_categories?.some((cat) => cat.skills.length > 0) ||
      citiesSelected.length > 0;

    setFiltersApplied(nextApplied);
    setFilterCount(
      (generalFilterValue !== 'Всё' ? 1 : 0) +
        (genderValue !== 'Не имеет значения' ? 1 : 0) +
        (skillsData?.skill_categories?.some((cat) => cat.skills.length > 0) ? 1 : 0) +
        (citiesSelected.length > 0 ? 1 : 0)
    );
    onChange?.({
      general: generalFilterValue || null,
      gender: genderValue || null,
      skills: skillsData,
      cities: citiesSelected,
      filtersApplied: nextApplied,
    });
  }, [generalFilterValue, genderValue, skillsData, citiesSelected, onChange]); // 🔴 зависимостями управляем тут

  return (
    <div className={styles.wrapper} role="region" aria-label="Боковая панель фильтров">
      <div
        className={styles['sidebar-header']}
        role="banner"
        aria-label="Заголовок боковой панели фильтров и кнопка сброса фильтров"
      >
        <TitleUI size="small">Фильтры {filterCount ? `(${filterCount})` : ''} </TitleUI>
        <button
          type="button"
          className={styles.toggle}
          onClick={handleReset}
          aria-expanded={resetFilters}
          aria-controls="skills-list"
        >
          {filtersApplied && (
            <>
              <span
                className={styles['button-bundle']}
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <TextUI color="link" variant="body">
                  Сбросить
                </TextUI>
                <Icon name="cross" size={20} className={styles.icon} />{' '}
              </span>
            </>
          )}
        </button>
      </div>

      <div className={styles.content}>
        <RadioButtonGroup
          items={GENERAL_RB_FILTER_OPTIONS.map((opt) => opt.label)}
          name="Общий фильтр"
          defaultValue={GENERAL_RB_FILTER_OPTIONS[0].label}
          onChange={handleGeneralChange}
          resetToken={resetToken}
        />
      </div>

      <SkillsSideBar
        title="Навыки"
        data={skillsCatalog ?? EMPTY_SKILLS}
        onChange={handleSkillsChange}
        resetToken={resetToken}
      />

      <div className={styles.content}>
        <RadioButtonGroup
          title="Пол автора"
          items={GENDER_OPTIONS.map((opt) => opt.label)}
          name="Пол автора"
          defaultValue={GENDER_OPTIONS[0].label}
          onChange={handleGenderChange}
          resetToken={resetToken}
        />

        <CitiesSideBar
          title="Города"
          cities={CITIES.map((city) => city)}
          onChange={handleCitiesChange}
          resetToken={resetToken}
        />
      </div>

      <CitiesSideBar
        key={`cities-${resetToken}`}
        title="Город"
        cities={CITIES.map((city) => city)}
        onChange={(val) => setCitiesSelected(val)}
        resetToken={resetToken}
      />
    </div>
  );
};
