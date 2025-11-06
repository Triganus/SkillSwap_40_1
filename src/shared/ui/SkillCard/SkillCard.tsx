import React from 'react';
import styles from './SkillCard.module.scss';
import type { SkillCardProps } from './type';

import { AvatarUI } from '../AvatarUI';
import { TextUI } from '../Text';
import { Button } from '../Button';
import { Icon } from '../Icon';

export const SkillCard: React.FC<SkillCardProps> = ({
  user,
  teachingSkills,
  learningSkills,
  variant = 'compact',
  // Только контент и колбэки, БЕЗ обработчиков
  onToggleFavorite,
  onDetailsClick,
  onViewDetails,
  isFavorite = false,
  className = '',
}) => {
  const isDetailed = variant === 'detailed';
  // Рендер одной карточки
  return (
    <article
      className={`
      ${styles.card} 
      ${isDetailed ? styles.detailed : styles.compact} 
      ${className}
    `}
    >
      {/* Иконка избранного */}
      {onToggleFavorite && (
        <button
          type="button"
          className={styles.favoriteButton}
          onClick={onToggleFavorite}
          aria-label={isFavorite ? 'Убрать из избранного' : 'Добавить в избранное'}
        >
          <Icon
            name="heart"
            size={24}
            fill={isFavorite ? 'currentColor' : 'none'}
            stroke="currentColor"
          />
        </button>
      )}

      {/* Аватар */}
      <div className={styles.avatarContainer}>
        <AvatarUI
          src={user.avatar}
          alt={user.name}
          fallback={user.name}
          size={isDetailed ? 64 : 48}
        />
      </div>

      {/* Имя и локация */}
      <div className={styles.userHeader}>
        <TextUI variant="body" className={styles.name}>
          {user.name}
        </TextUI>
        {(user.location || user.age) && (
          <TextUI variant="caption" color="secondary" className={styles.location}>
            {[user.location, user.age].filter(Boolean).join(', ')}
          </TextUI>
        )}
      </div>

      {/* Bio (только для detailed) */}
      {isDetailed && user.bio && (
        <div className={styles.bio}>
          <TextUI variant="body" color="secondary">
            {user.bio}
          </TextUI>
        </div>
      )}

      {/* Навыки - Может научить */}
      {teachingSkills.length > 0 && (
        <div className={styles.skillsSection}>
          <TextUI variant="caption" className={styles.skillsLabel}>
            Может научить:
          </TextUI>
          <div className={styles.skillsTags}>
            {teachingSkills.slice(0, 3).map((skill) => (
              <span key={skill.id} className={styles.tag}>
                {skill.title}
              </span>
            ))}
            {teachingSkills.length > 3 && (
              <span className={styles.moreTag}>+{teachingSkills.length - 3}</span>
            )}
          </div>
        </div>
      )}

      {/* Навыки - Хочет научиться */}
      {learningSkills.length > 0 && (
        <div className={styles.skillsSection}>
          <TextUI variant="caption" className={styles.skillsLabel}>
            Хочет научиться:
          </TextUI>
          <div className={styles.skillsTags}>
            {learningSkills.slice(0, 3).map((skill) => (
              <span key={skill.id} className={styles.tag}>
                {skill.title}
              </span>
            ))}
            {learningSkills.length > 3 && (
              <span className={styles.moreTag}>+{learningSkills.length - 3}</span>
            )}
          </div>
        </div>
      )}

      {/* Кнопки действий */}
      <div className={styles.actions}>
        {(onDetailsClick ?? onViewDetails) && (
          <Button
            variant="primary"
            onClick={onDetailsClick ?? onViewDetails}
            className={styles.detailsButton}
          >
            Подробнее
          </Button>
        )}
      </div>
    </article>
  );
};

export default SkillCard;
