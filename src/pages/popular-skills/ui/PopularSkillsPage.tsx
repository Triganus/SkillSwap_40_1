import { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@shared/hooks/redux';
import {
  selectSkillCards,
  selectUsersLoading,
  fetchUsersWithSkillsThunk,
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
  const [displayedCount, setDisplayedCount] = useState(9);
  const [hasMore, setHasMore] = useState(true);

  // Загружаем данные при монтировании, если их нет
  useEffect(() => {
    if (usersData.length === 0 && !loading) {
      dispatch(fetchUsersWithSkillsThunk());
    }
  }, [dispatch, usersData.length, loading]);

  // Обновляем hasMore при изменении данных
  useEffect(() => {
    if (displayedCount >= usersData.length && usersData.length > 0) {
      setHasMore(false);
    } else if (usersData.length > 0) {
      setHasMore(true);
    }
  }, [displayedCount, usersData.length]);

  // Обработчик для бесконечного скролла
  const handleLoadMore = useCallback(() => {
    if (displayedCount >= usersData.length) {
      setHasMore(false);
      return;
    }

    // Имитация загрузки (можно заменить на реальную загрузку с API)
    setTimeout(() => {
      const newCount = Math.min(displayedCount + 9, usersData.length);
      setDisplayedCount(newCount);

      if (newCount >= usersData.length) {
        setHasMore(false);
      }
    }, 500);
  }, [displayedCount, usersData.length]);

  // Обновляем обработчики для карточек с правильной навигацией
  const cardsWithNavigation = useMemo(() => {
    return usersData.map((card) => ({
      ...card,
      onDetailsClick: () => {
        const firstSkill = card.teachingSkills[0];
        if (firstSkill) {
          console.log('[PopularSkillsPage] Navigating to skill:', firstSkill.id);
          navigate(`/skill/${firstSkill.id}`);
        } else {
          console.warn('[PopularSkillsPage] No teaching skills found for user:', card.user.name);
        }
      },
    }));
  }, [usersData, navigate]);

  const sortedPopularCards = useMemo(() => {
    return [...cardsWithNavigation].sort((a, b) => {
      const likesA = a.likesCount ?? 0;
      const likesB = b.likesCount ?? 0;

      if (likesA === likesB) {
        if (likesA === 0) {
          const dateA = new Date(a.user.createdAt || 0).getTime();
          const dateB = new Date(b.user.createdAt || 0).getTime();
          return dateA - dateB;
        }
        return 0;
      }

      if (likesA === 0) return 1;
      if (likesB === 0) return -1;

      return likesB - likesA;
    });
  }, [cardsWithNavigation]);

  // Фильтруем популярные карточки (все доступные, можно добавить логику популярности)
  const popularCards = sortedPopularCards.slice(0, displayedCount);

  // Обработчик возврата на главную
  const handleGoBack = useCallback(() => {
    navigate('/');
  }, [navigate]);

  // Показываем прелоадер пока загружаются данные
  if (loading && usersData.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.preloaderContainer}>
          <PreloaderUI size="large" ariaLabel="Загрузка популярных навыков" />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
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
          {popularCards.map((card) => (
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
    </div>
  );
}
