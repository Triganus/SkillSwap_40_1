import { useEffect, useState, useCallback, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@shared/hooks/redux';
import {
  getSearchQuery,
  getSkillsLoading,
  setSearchQuery,
  filterSkills,
  fetchSkills,
} from '@entities/skill/model';
import {
  fetchUsersWithSkills,
  getAllUsersWithSkills,
  getUsersLoading,
} from '@entities/user/model/usersSlice';
import { setFilter } from '@/entities/filterSideBar/model/filterSideBarSlice';
import { getSideBarFilters } from '@/entities/filterSideBar/model/filterSideBarSlice';
import { CardSectionUI } from '@shared/ui/CardSection';
import { InfiniteGridUI } from '@shared/ui/InfiniteGrid';
import { SkillCard } from '@widgets/Cards/SkillCard';
import { TitleUI } from '@shared/ui/Title';
import { PreloaderUI } from '@shared/ui/Preloader';
import { FilterSideBar } from '@widgets/FilterSideBar/FilterSideBar';
import type { FilterPayload } from '@/entities/filterSideBar/model';
import type { SkillCategoriesData } from '@entities/Skill';
import { fetchSkillsCatalog } from '@/api';
import styles from './HomePage.module.scss';
import { useSidebarFilter } from '@/shared/hooks/useSidebarFilter';

// Мок-данные удалены - теперь используются данные из API (fetchSkillsCatalog и fetchUsersAsSkillCards)

export default function HomePage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();

  // const [filters, setFilters] = useState<FilterPayload>(EMPTY_FILTERS);

  // Redux селекторы
  const searchQuery = useAppSelector(getSearchQuery);
  const loading = useAppSelector(getSkillsLoading);
  const usersData = useAppSelector(getAllUsersWithSkills);
  const loadingUsers = useAppSelector(getUsersLoading);

  // Локальное состояние для каталога навыков (для фильтров)
  const [skillsCatalog, setSkillsCatalog] = useState<SkillCategoriesData | null>(null);
  const [loadingCatalog, setLoadingCatalog] = useState(true);
  const currentFilters = useAppSelector(getSideBarFilters);
  // Локальное состояние для бесконечного скролла
  const [displayedRecommendedCount, setDisplayedRecommendedCount] = useState(9);
  const [hasMoreRecommended, setHasMoreRecommended] = useState(true);

  // Режим поиска
  const searchFromUrl = searchParams.get('search') || '';
  const isSearching = searchFromUrl.trim().length > 0;
  console.log('Search from URL:', searchFromUrl);
  // Загрузка каталога навыков
  useEffect(() => {
    let cancelled = false;

    fetchSkillsCatalog()
      .then((data) => {
        if (!cancelled) {
          setSkillsCatalog(data);
          setLoadingCatalog(false);
        }
      })
      .catch((error) => {
        console.error('Failed to load skills catalog:', error);
        if (!cancelled) {
          setLoadingCatalog(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Загрузка навыков и пользователей через Redux
  useEffect(() => {
    dispatch(fetchSkills());
  }, [dispatch]);

  useEffect(() => {
    if (usersData.length === 0 && !loadingUsers) {
      dispatch(fetchUsersWithSkills());
    }
  }, [dispatch, usersData.length, loadingUsers]);

  const isSidebarActive =
    !!currentFilters &&
    ((currentFilters.general && currentFilters.general !== 'Всё') ||
      (currentFilters.gender &&
        ['мужской', 'женский'].includes(currentFilters.gender.toLowerCase())) ||
      !!currentFilters.skills?.skill_categories.some(
        (cat) => cat.skills && cat.skills.length > 0
      ) ||
      (currentFilters.cities && currentFilters.cities.length > 0));

  console.log(currentFilters);
  // Режим фильтрации активен, если есть либо строка поиска, либо боковые фильтры
  const isFiltering = isSearching || isSidebarActive;
  console.log(currentFilters.gender);
  // Синхронизация URL параметра поиска с Redux
  useEffect(() => {
    if (searchFromUrl !== searchQuery) {
      dispatch(setSearchQuery(searchFromUrl));
      dispatch(filterSkills());
    }
  }, [searchFromUrl, searchQuery, dispatch]);

  // Обработчик изменения фильтров
  const handleFiltersChange = useCallback(
    (filters: FilterPayload) => {
      console.log('Filters applied:', filters);
      dispatch(setFilter(filters));

      // TODO: применить фильтры к данным после готовности API
    },
    [dispatch]
  );

  // Обработчики для CardSection
  const handleViewAllPopular = useCallback(() => {
    navigate('/popular-skills');
  }, [navigate]);

  const handleViewAllNew = useCallback(() => {
    navigate('/new-skills');
  }, [navigate]);

  // Обработчик для бесконечного скролла
  const handleLoadMoreRecommended = useCallback(() => {
    if (displayedRecommendedCount >= usersData.length) {
      setHasMoreRecommended(false);
      return;
    }

    // Имитация загрузки
    setTimeout(() => {
      setDisplayedRecommendedCount((prev) => Math.min(prev + 9, usersData.length));
    }, 500);
  }, [displayedRecommendedCount, usersData.length]);

  // Данные для отображения
  const popularCards = usersData.slice(0, 3); // Первые 3
  const newCards = usersData.slice(3, 6); // Следующие 3
  const recommendedCards = usersData.slice(0, displayedRecommendedCount);

  // Для поиска - фильтруем по имени или навыкам

  console.log(searchFromUrl);
  const searchResultCards = isSearching
    ? usersData.filter(
        (card) =>
          card.user.name.toLowerCase().includes(searchFromUrl.toLowerCase()) ||
          card.teachingSkills.some((skill) =>
            skill.title.toLowerCase().includes(searchFromUrl.toLowerCase())
          ) ||
          card.learningSkills.some((skill) =>
            skill.title.toLowerCase().includes(searchFromUrl.toLowerCase())
          )
      )
    : [];
  const baseForFilter = searchFromUrl.trim() ? searchResultCards : usersData;

  const { matchesSidebar } = useSidebarFilter(currentFilters);
  const visibleSearchResultCards = useMemo(
    () => baseForFilter.filter(matchesSidebar),
    [baseForFilter, matchesSidebar]
  );

  // Показываем прелоадер пока загружаются данные
  const isLoading = loadingCatalog || loadingUsers;
  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.preloaderContainer}>
          <PreloaderUI size="large" ariaLabel="Загрузка данных" />
        </div>
      </div>
    );
  }

  // Режим поиска - отображаем только результаты
  if (isFiltering) {
    return (
      <div className={styles.container}>
        <aside className={styles.sidebar}>
          {skillsCatalog && (
            <FilterSideBar skillsCatalog={skillsCatalog} onChange={handleFiltersChange} />
          )}
        </aside>
        <main className={styles.content}>
          <div className={styles.searchResults}>
            <TitleUI size="large" className={styles.searchTitle}>
              {/* Подходящие предложения: {searchResultCards.length} */}
              Подходящие предложения: {visibleSearchResultCards.length}
            </TitleUI>
            <InfiniteGridUI
              hasMore={false}
              loading={false}
              columns={{ mobile: 1, tablet: 2, desktop: 3 }}
              gap="24px"
              className={styles.searchGrid}
            >
              {visibleSearchResultCards.map((card) => (
                <SkillCard
                  key={card.user.id}
                  user={card.user}
                  teachingSkills={card.teachingSkills}
                  learningSkills={card.learningSkills}
                  onDetailsClick={card.onDetailsClick}
                  onLikeClick={card.onLikeClick}
                  isLiked={card.isLiked}
                />
              ))}
            </InfiniteGridUI>
          </div>
        </main>
      </div>
    );
  }

  // Обычный режим - отображаем все блоки
  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        {skillsCatalog && (
          <FilterSideBar skillsCatalog={skillsCatalog} onChange={handleFiltersChange} />
        )}
      </aside>
      <main className={styles.content}>
        {/* Блок "Популярное" */}
        <CardSectionUI
          title="Популярное"
          cards={popularCards}
          onLookClick={handleViewAllPopular}
          maxCards={3}
          showButton={true}
        />

        {/* Блок "Новое" */}
        <CardSectionUI
          title="Новое"
          cards={newCards}
          onLookClick={handleViewAllNew}
          maxCards={3}
          showButton={true}
          className={styles.newSection}
        />

        {/* Блок "Рекомендуем" с бесконечным скроллом */}
        <section className={styles.recommendedSection}>
          <TitleUI size="large" className={styles.sectionTitle}>
            Рекомендуем
          </TitleUI>
          <InfiniteGridUI
            onLoadMore={handleLoadMoreRecommended}
            hasMore={hasMoreRecommended}
            loading={loading}
            columns={{ mobile: 1, tablet: 2, desktop: 3 }}
            gap="24px"
          >
            {recommendedCards.map((card) => (
              <SkillCard
                key={card.user.id}
                user={card.user}
                teachingSkills={card.teachingSkills}
                learningSkills={card.learningSkills}
                onDetailsClick={card.onDetailsClick}
                onLikeClick={card.onLikeClick}
                isLiked={card.isLiked}
              />
            ))}
          </InfiniteGridUI>
        </section>
      </main>
    </div>
  );
}
