import React, { useEffect, useLayoutEffect, useRef, useMemo, useState, useCallback } from 'react';
import { TextUI } from '@/shared/ui/Text';
import { Icon } from '@/shared/ui';
import type { TFilterSideBarProps } from './TFilterSideBarProps';
import styles from './FilterSideBar.module.scss';
import { TitleUI } from '@/shared/ui/Title';
import { SkillsSideBar } from './SkillsSideBar/SkillsSideBar';
import { CitiesSideBar } from './CitiesSideBar/CitiesSideBar';
import type { SkillCategoriesData } from '@/entities/Skill';
import { RadioButtonGroup } from './RadioButtonGroup';
import { GENERAL_RB_FILTER_OPTIONS } from '@/shared/lib/constants/GeneralRbFilter';
import { useDirectories } from '@/entities/directory';
import type { City } from '@/entities/directory/model/types';
import { useAppSelector } from '@shared/hooks/redux';
import { getSideBarFilters } from '@/entities/filterSideBar/model/filterSideBarSlice';

export const FilterSideBar: React.FC<TFilterSideBarProps> = ({ skillsCatalog, onChange }) => {
  const { cities, genders } = useDirectories();
  const reduxFilters = useAppSelector(getSideBarFilters);
  const onChangeRef = useRef(onChange);
  const prevFiltersRef = useRef<string>('');
  const isSyncingFromReduxRef = useRef(false);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const [resetFilters, setResetFilters] = useState(false);
  const [filtersApplied, setFiltersApplied] = useState(false);
  const [skillsData, setSkillsData] = useState<SkillCategoriesData | null>(null);
  const [generalFilterValue, setGeneralFilterValue] = useState<string>('');

  const genderOptions = useMemo(
    () =>
      genders.map((gender) => ({
        label: gender.name,
        value: gender.id,
      })),
    [genders]
  );

  const [genderValue, setGenderValue] = useState<string>('');
  const [citiesSelected, setCitiesSelected] = useState<string[]>([]);
  const [filterCount, setFilterCount] = useState(0);

  const reduxCitiesKey = useMemo(() => JSON.stringify(reduxFilters.cities), [reduxFilters.cities]);
  const reduxSkillsKey = useMemo(() => JSON.stringify(reduxFilters.skills), [reduxFilters.skills]);

  useEffect(() => {
    isSyncingFromReduxRef.current = true;

    const newGeneral = reduxFilters.general || '';
    const newGender = reduxFilters.gender || '';

    setGeneralFilterValue(newGeneral);
    setGenderValue(newGender);

    if (reduxSkillsKey !== JSON.stringify(skillsData)) {
      setSkillsData(reduxFilters.skills);
    }
    if (reduxCitiesKey !== JSON.stringify(citiesSelected)) {
      setCitiesSelected(reduxFilters.cities);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduxFilters.general, reduxFilters.gender, reduxSkillsKey, reduxCitiesKey]);

  // Сбрасываем флаг синхронизации после обновления DOM
  useLayoutEffect(() => {
    if (isSyncingFromReduxRef.current) {
      isSyncingFromReduxRef.current = false;
    }
  });

  const handleGeneralChange = useCallback((value: string) => {
    setGeneralFilterValue(value);
  }, []);

  const handleGenderChange = useCallback((value: string) => {
    setGenderValue(value);
  }, []);

  const handleCitiesChange = useCallback((selectedIds: string[]) => {
    setCitiesSelected(selectedIds);
  }, []);

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
      generalFilterValue !== '' ||
      genderValue !== '' ||
      skillsData?.skill_categories?.some((cat) => cat.skills.length > 0) ||
      citiesSelected.length > 0;

    setFiltersApplied(nextApplied);
    setFilterCount(
      (generalFilterValue !== '' ? 1 : 0) +
        (genderValue !== '' ? 1 : 0) +
        (skillsData?.skill_categories?.some((cat) => cat.skills.length > 0) ? 1 : 0) +
        (citiesSelected.length > 0 ? 1 : 0)
    );

    const newPayload = {
      general: generalFilterValue || null,
      gender: genderValue || null,
      skills: skillsData,
      cities: citiesSelected,
      filtersApplied: nextApplied,
    };

    const newFiltersKey = JSON.stringify(newPayload);

    // Не вызываем onChange, если это синхронизация из Redux
    if (newFiltersKey !== prevFiltersRef.current && !isSyncingFromReduxRef.current) {
      prevFiltersRef.current = newFiltersKey;
      onChangeRef.current?.(newPayload);
    } else if (isSyncingFromReduxRef.current) {
      // Обновляем prevFiltersRef при синхронизации, чтобы не сбивать отслеживание
      prevFiltersRef.current = newFiltersKey;
    }
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
          items={GENERAL_RB_FILTER_OPTIONS}
          name="Общий фильтр"
          defaultValue={GENERAL_RB_FILTER_OPTIONS[0].value}
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
          items={genderOptions}
          name="Пол автора"
          defaultValue={genderOptions[0]?.value || ''}
          value={genderValue}
          onChange={handleGenderChange}
        />

        <CitiesSideBar
          title="Города"
          cities={cities as City[]}
          value={citiesSelected}
          onChange={handleCitiesChange}
        />
      </div>
    </div>
  );
};
