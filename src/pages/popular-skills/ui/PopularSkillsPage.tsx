import { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@shared/hooks/redux';
import {
  selectSkillCards,
  selectUsersLoading,
  fetchPopularUsersWithPaginationThunk,
  clearSkillCards,
} from '@/entities/user/model-v2';
import { InfiniteGridUI } from '@shared/ui/InfiniteGrid';

import { TitleUI } from '@shared/ui/Title';
import { PreloaderUI } from '@shared/ui/Preloader';
import { Button } from '@shared/ui/Button';
import { Icon } from '@shared/ui/Icon';
import styles from './PopularSkillsPage.module.scss';
import { SkillCard } from '@/widgets/Cards/SkillCard';
import type { SkillCardProps } from '@/widgets/Cards/SkillCard/type';

export default function PopularSkillsPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const usersData = useAppSelector(selectSkillCards) as SkillCardProps[];
  const loading = useAppSelector(selectUsersLoading);

  // Локальное состояние для бесконечного скролла
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Очищаем данные при монтировании и размонтировании компонента
  useEffect(() => {
    dispatch(clearSkillCards());

    return () => {
      dispatch(clearSkillCards());
    };
  }, [dispatch]);

  // Загружаем первую страницу после очистки
  useEffect(() => {
    dispatch(fetchPopularUsersWithPaginationThunk({ page: 1, limit: 9, replace: true }))
      .unwrap()
      .then((result) => {
        setHasMore(result.hasMore);
        setCurrentPage(1);
      })
      .catch((error) => {
        console.error('[PopularSkillsPage] Failed to load initial data:', error);
      });
  }, [dispatch]);

  // Обработчик для бесконечного скролла
  const handleLoadMore = useCallback(() => {
    if (!hasMore || loading) {
      return;
    }

    const nextPage = currentPage + 1;

    dispatch(fetchPopularUsersWithPaginationThunk({ page: nextPage, limit: 9, replace: false }))
      .unwrap()
      .then((result) => {
        setHasMore(result.hasMore);
        setCurrentPage(nextPage);
      })
      .catch((error) => {
        console.error('[PopularSkillsPage] Failed to load more data:', error);
      });
  }, [dispatch, currentPage, hasMore, loading]);

  // Обработчик возврата на главную
  const handleGoBack = useCallback(() => {
    navigate('/');
  }, [navigate]);

  const handleCardDetailsClick = useCallback(
    (userId: string) => {
      navigate(`/skill/${userId}`);
    },
    [navigate]
  );

  const cardsWithNavigation = useMemo(() => {
    return usersData.map((card) => ({
      ...card,
      onDetailsClick: () => handleCardDetailsClick(card.user.id),
    }));
  }, [usersData, handleCardDetailsClick]);

  return (
    <div className={styles.container}>
      {loading && usersData.length === 0 ? (
        <div className={styles.preloaderContainer}>
          <PreloaderUI size="large" ariaLabel="Загрузка популярных навыков" />
        </div>
      ) : (
        <>
          <div className={styles.header}>
            <div className={styles.headerLeft}>
              <TitleUI size="large" className={styles.title}>
                Популярное
              </TitleUI>
            </div>
            <div className={styles.headerRight}>
              <Button
                variant="tertiary"
                onClick={handleGoBack}
                className={styles.backButton}
                aria-label="Вернуться на главную страницу"
              >
                <Icon
                  name="chevron-right"
                  size={24}
                  className={styles.backIcon}
                  fill="#253017"
                  stroke="#253017"
                  aria-hidden="true"
                />
                Назад
              </Button>
            </div>
          </div>
          <div className={styles.content}>
            <InfiniteGridUI
              onLoadMore={handleLoadMore}
              hasMore={hasMore}
              loading={loading}
              columns={{ mobile: 1, tablet: 2, desktop: 3 }}
              gap="24px"
              className={styles.grid}
            >
              {cardsWithNavigation.map((card) => (
                <SkillCard
                  key={card.user.id}
                  user={card.user}
                  teachingSkills={card.teachingSkills}
                  learningSkills={card.learningSkills}
                  onDetailsClick={card.onDetailsClick}
                  onLikeClick={card.onLikeClick}
                  isLiked={card.isLiked}
                  likesCount={card.likesCount}
                />
              ))}
            </InfiniteGridUI>
          </div>
        </>
      )}
    </div>
  );
}
