import React, { useMemo } from 'react';
import { LikeButtonUI } from '@/shared/ui/LikeButton/LikeButtonUI';
import { Icon } from '@/shared/ui/Icon/Icon';
import { Button } from '@/shared/ui/Button/Button';
import { SkillContent } from '@/entities/skill/ui/SkillContent';
import type { SkillDetailsProps } from './types';
import styles from './SkillDetails.module.scss';

export const SkillDetails: React.FC<SkillDetailsProps> = ({
  title,
  category,
  categoryLabel,
  subcategory,
  text,
  images,
  variant,
  isLiked = false,
  isLikeActive = false,
  isRequestSent = false,
  likesCount = 0,
  onLikeClick,
  onExchangeClick,
  onShareClick,
  onMoreClick,
  onEditClick,
  onDoneClick,
  className = '',
}) => {
  const rootClassName = useMemo(() => {
    const classes = [styles.skillDetails, className];
    if (variant === 'can') {
      classes.push(styles.modal);
    }
    return classes.filter(Boolean).join(' ');
  }, [variant, className]);

  return (
    <div className={rootClassName}>
      {/* Блок действий (лайк, поделиться, ещё) - сверху справа */}
      {variant === 'want' && (
        <div className={styles.actionbar}>
          {isLikeActive && (
            <LikeButtonUI
              isActive={isLiked}
              onClick={onLikeClick}
              ariaLabel={isLiked ? 'Убрать из избранного' : 'Добавить в избранное'}
              likesCount={likesCount}
              showCount={true}
            />
          )}
          {onShareClick && (
            <button
              type="button"
              className={styles.actionButton}
              onClick={onShareClick}
              aria-label="Поделиться"
              title="Поделиться"
            >
              <Icon name="share" size={24} title="Поделиться" />
            </button>
          )}
          {onMoreClick && (
            <button
              type="button"
              className={styles.actionButton}
              onClick={onMoreClick}
              aria-label="Ещё"
              title="Дополнительные действия"
            >
              <Icon name="more-square" size={24} title="Ещё" />
            </button>
          )}
        </div>
      )}

      {/* Основное содержимое навыка с кнопками действий */}
      <SkillContent
        title={title}
        category={category}
        categoryLabel={categoryLabel}
        subcategory={subcategory}
        description={text}
        images={images}
      >
        {/* Кнопка "Предложить обмен" (режим "want") */}
        {variant === 'want' && (
          <div className={styles.cta}>
            {isRequestSent ? (
              <Button variant="primary" type="button" className={styles.exchangeButton}>
                <Icon name="clock" size={20} title="Ожидание" />
                Обмен предложен
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={onExchangeClick}
                type="button"
                className={styles.exchangeButton}
              >
                Предложить обмен
              </Button>
            )}
          </div>
        )}

        {/* Кнопки редактирования (режим "can") */}
        {variant === 'can' && (
          <div className={styles.editActions}>
            <Button
              variant="secondary"
              onClick={onEditClick}
              type="button"
              className={styles.editButton}
            >
              <Icon name="edit" size={20} title="Редактировать" />
              Редактировать
            </Button>
            <Button
              variant="primary"
              onClick={onDoneClick}
              type="submit"
              className={styles.doneButton}
            >
              Готово
            </Button>
          </div>
        )}
      </SkillContent>
    </div>
  );
};
