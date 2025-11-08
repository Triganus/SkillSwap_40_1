import React, { useEffect, useRef, useMemo } from 'react';
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
import { useDirectories } from '@/entities/directory';
import type { City } from '@/entities/directory/model/types';
import { useAppSelector } from '@shared/hooks/redux';
import { getSideBarFilters } from '@/entities/filterSideBar/model/filterSideBarSlice';

export const FilterSideBar: React.FC<TFilterSideBarProps> = ({ skillsCatalog, onChange }) => {
  const { cities } = useDirectories();
  const reduxFilters = useAppSelector(getSideBarFilters);
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const [resetFilters, setResetFilters] = useState(false);
  const [filtersApplied, setFiltersApplied] = useState(false);
  const [skillsData, setSkillsData] = useState<SkillCategoriesData | null>(null);
  const [generalFilterValue, setGeneralFilterValue] = useState<string>('Всё');
  const [genderValue, setGenderValue] = useState<string>('Не имеет значения');
  const [citiesSelected, setCitiesSelected] = useState<string[]>([]);
  const [filterCount, setFilterCount] = useState(0);

  const reduxCitiesKey = useMemo(() => JSON.stringify(reduxFilters.cities), [reduxFilters.cities]);
  const reduxSkillsKey = useMemo(() => JSON.stringify(reduxFilters.skills), [reduxFilters.skills]);

  useEffect(() => {
    const newGeneral = reduxFilters.general || 'Всё';
    const newGender = reduxFilters.gender || 'Не имеет значения';

    if (generalFilterValue !== newGeneral) {
      setGeneralFilterValue(newGeneral);
    }
    if (genderValue !== newGender) {
      setGenderValue(newGender);
    }

    const currentSkillsKey = JSON.stringify(skillsData);
    const currentCitiesKey = JSON.stringify(citiesSelected);

    if (currentSkillsKey !== reduxSkillsKey) {
      setSkillsData(reduxFilters.skills);
    }
    if (currentCitiesKey !== reduxCitiesKey) {
      setCitiesSelected(reduxFilters.cities);
    }
  }, [reduxFilters.general, reduxFilters.gender, reduxSkillsKey, reduxCitiesKey]);

  const handleGeneralChange = useCallback((val: string) => setGeneralFilterValue(val), []);
  const handleGenderChange = useCallback((val: string) => setGenderValue(val), []);
  const handleCitiesChange = useCallback((val: string[]) => setCitiesSelected(val), []);
  const handleSkillsChange = useCallback((val: SkillCategoriesData) => setSkillsData(val), []);

  const EMPTY_SKILLS: SkillCategoriesData = { skill_categories: [] };

  const handleReset = () => {
    setResetFilters(true);
    setGeneralFilterValue('Всё');
    setGenderValue('Не имеет значения');
    setSkillsData(null);
    setCitiesSelected([]);
    setFiltersApplied(false);
    setFilterCount(0);
    onChangeRef.current?.({
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
    onChangeRef.current?.({
      general: generalFilterValue || null,
      gender: genderValue || null,
      skills: skillsData,
      cities: citiesSelected,
      filtersApplied: nextApplied,
    });
  }, [generalFilterValue, genderValue, skillsData, citiesSelected]);
  return (
    <div className={styles.wrapper} role="region" aria-label="Боковая панель фильтров">
      <div
        className={styles.sidebarHeader}
        role="banner"
        aria-label="Заголовок боковой панели фильтров и кнопка сброса фильтров"
      >
        <TitleUI size="medium">Фильтры {filterCount ? `(${filterCount})` : ''} </TitleUI>
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
                className={styles.buttonBundle}
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
          value={generalFilterValue}
          onChange={handleGeneralChange}
        />
      </div>

      <SkillsSideBar
        title="Навыки"
        data={skillsCatalog ?? EMPTY_SKILLS}
        value={skillsData}
        onChange={handleSkillsChange}
      />

      <div className={styles.content}>
        <RadioButtonGroup
          title="Пол автора"
          items={GENDER_OPTIONS.map((opt) => opt.label)}
          name="Пол автора"
          defaultValue={GENDER_OPTIONS[0].label}
          value={genderValue}
          onChange={handleGenderChange}
        />

        <CitiesSideBar
          title="Города"
          cities={(cities as City[]).map((city) => city.name)}
          value={citiesSelected}
          onChange={handleCitiesChange}
        />
      </div>
    </div>
  );
};
