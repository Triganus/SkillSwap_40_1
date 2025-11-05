import React, { useMemo } from 'react';
import { TitleUI } from '@/shared/ui/Title/TitleUI';
import { TextUI } from '@/shared/ui/Text/TextUI';
import { MediaSlider } from '@/shared/ui/MediaSlider/MediaSlider';
import { LikeButtonUI } from '@/shared/ui/LikeButton/LikeButtonUI';
import { Icon } from '@/shared/ui/Icon/Icon';
import { Button } from '@/shared/ui/Button/Button';
import { TagUI } from '@/shared/ui/Tag'; //для отображения категории как тега
import { tagCategoryToLabel } from '@/shared/lib/categoryMapper'; //для преобразования TagCategory -> человекочитаемые названия категорий
import type { MediaItem } from '@/shared/ui/MediaSlider/types';
import type { SkillDetailsProps } from './types';
import styles from './SkillDetails.module.scss';

export const SkillDetails: React.FC<SkillDetailsProps> = ({
  title,
  category,
  categoryLabel,
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
  const mediaItems: MediaItem[] = useMemo(
    () =>
      images.map((src, idx) => ({
        id: `img-${idx}`,
        src,
        alt: `${title} - изображение ${idx + 1}`,
      })),
    [images, title]
  );

  const rootClassName = useMemo(() => {
    const classes = [styles['skill-details'], className];
    if (variant === 'can') {
      classes.push(styles.modal);
    }
    return classes.filter(Boolean).join(' ');
  }, [variant, className]);

  return (
    <div className={rootClassName}>
      {/* Блок (лайк, поделиться, ещё) - сверху справа */}
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

      {/* Заголовок и подзаголовок - слева */}
      <div className={styles.header}>
        <TitleUI size="large">{title}</TitleUI>
        <TagUI
          label={categoryLabel || tagCategoryToLabel[category]}
          category={category}
          className={styles.tag}
        />
      </div>

      {/* Описание - слева */}
      <div className={styles.content}>
        <TextUI variant="body" className={styles.description}>
          {text}
        </TextUI>

        {/* Кнопка "Предложить обмен" - под описанием (режим "want") */}
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
      </div>

      {/* Галерея изображений - справа */}
      <div className={styles.gallery}>
        <MediaSlider items={mediaItems} mainSize={480} />
      </div>
    </div>
  );
};
