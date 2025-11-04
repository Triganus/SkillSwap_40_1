import { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@shared/hooks/redux';
import {
  getAllUsersWithSkills,
  getUsersLoading,
  fetchUsersWithSkills,
} from '@entities/user/model/usersSlice';
import { InfiniteGridUI } from '@shared/ui/InfiniteGrid';

import { TitleUI } from '@shared/ui/Title';
import { PreloaderUI } from '@shared/ui/Preloader';
import { Button } from '@shared/ui/Button';
import { Icon } from '@shared/ui/Icon';
import styles from './NewSkillsPage.module.scss';
import { SkillCard } from '@/widgets/Cards/SkillCard';

export default function NewSkillsPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const usersData = useAppSelector(getAllUsersWithSkills);
  const loading = useAppSelector(getUsersLoading);

  // Локальное состояние для бесконечного скролла
  const [displayedCount, setDisplayedCount] = useState(9);
  const [hasMore, setHasMore] = useState(true);

  // Загружаем данные при монтировании, если их нет
  useEffect(() => {
    if (usersData.length === 0 && !loading) {
      dispatch(fetchUsersWithSkills());
    }
  }, [dispatch, usersData.length, loading]);

  // Фильтруем новые карточки (сортируем по дате создания пользователя)
  const sortedNewCards = useMemo(() => {
    return [...usersData].sort((a, b) => {
      const dateA = new Date(a.user.createdAt || 0).getTime();
      const dateB = new Date(b.user.createdAt || 0).getTime();
      return dateB - dateA; // Новые первыми
    });
  }, [usersData]);

  // Обновляем hasMore при изменении данных
  useEffect(() => {
    if (displayedCount >= sortedNewCards.length && sortedNewCards.length > 0) {
      setHasMore(false);
    } else if (sortedNewCards.length > 0) {
      setHasMore(true);
    }
  }, [displayedCount, sortedNewCards.length]);

  // Обработчик для бесконечного скролла
  const handleLoadMore = useCallback(() => {
    if (displayedCount >= sortedNewCards.length) {
      setHasMore(false);
      return;
    }

    // Имитация загрузки (можно заменить на реальную загрузку с API)
    setTimeout(() => {
      const newCount = Math.min(displayedCount + 9, sortedNewCards.length);
      setDisplayedCount(newCount);

      if (newCount >= sortedNewCards.length) {
        setHasMore(false);
      }
    }, 500);
  }, [displayedCount, sortedNewCards.length]);

  const newCards = sortedNewCards.slice(0, displayedCount);

  // Обработчик возврата на главную
  const handleGoBack = useCallback(() => {
    navigate('/');
  }, [navigate]);

  // Показываем прелоадер пока загружаются данные
  if (loading && usersData.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.preloaderContainer}>
          <PreloaderUI size="large" ariaLabel="Загрузка новых навыков" />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <TitleUI size="large" className={styles.title}>
          Новое
        </TitleUI>
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
      <div className={styles.content}>
        <InfiniteGridUI
          onLoadMore={handleLoadMore}
          hasMore={hasMore}
          loading={loading}
          columns={{ mobile: 1, tablet: 2, desktop: 3 }}
          gap="24px"
          className={styles.grid}
        >
          {newCards.map((card) => (
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
    </div>
  );
}
