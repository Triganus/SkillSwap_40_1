import React from 'react';

import styles from './SkillCard.module.scss';

import { Button } from '../Button';
import type { SkillCardProps } from './type';
import { AvatarUI } from '../AvatarUI';
import { TitleUI } from '../Title';
import { TextUI } from '../Text';
import { LikeButtonUI } from '../LikeButton';
import { TagUI } from '../Tag';

export const SkillCard: React.FC<SkillCardProps> = ({
  user,
  teachingSkills,
  learningSkills,
  onDetailsClick,
  onLikeClick,
  isLiked = false,
  ariaLabel,
  showDetailsButton = true,
}) => (
  <article className={styles.card} aria-label={ariaLabel || `Карточка пользователя ${user.name}`}>
    <div className={styles.userInfo}>
      <AvatarUI
        src={user.avatar || '/default-avatar.png'}
        alt={`Аватар пользователя ${user.name}`}
      />
      <div className={styles.userDetails}>
        <TitleUI size="small">{user.name}</TitleUI>
        <TextUI variant="caption" color="primary">
          {user.bio || 'Город не указан'}
        </TextUI>
      </div>
      <LikeButtonUI
        onClick={onLikeClick}
        ariaLabel={
          isLiked ? `Убрать ${user.name} из избранного` : `Добавить ${user.name} в избранное`
        }
        className={styles.likeButton}
      />
    </div>
    <div className={styles.basicContent}>
      <div className={styles.skillsSection}>
        <div className={styles.skillGroup}>
          <TitleUI size="xsmall">Может научить:</TitleUI>
          <div className={styles.skillTags} aria-label="Может научить">
            {teachingSkills.map((skill) => (
              <TagUI key={skill.id} label={skill.title} category={skill.category} />
            ))}
          </div>
        </div>

        <div className={styles.skillGroup}>
          <TitleUI size="xsmall">Хочет научиться:</TitleUI>
          <div className={styles.skillTags} aria-label="Хочет научиться">
            {learningSkills.slice(0, 2).map((skill) => (
              <TagUI key={skill.id} label={skill.title} category={skill.category} />
            ))}
            {learningSkills.length > 2 && (
              <TagUI label={`+${learningSkills.length - 2}`} category="other" />
            )}
          </div>
        </div>
      </div>
      {showDetailsButton && onDetailsClick && (
        <Button
          onClick={onDetailsClick}
          variant="primary"
          type="button"
          aria-label={`Подробнее о навыке ${teachingSkills[0]?.title || 'пользователя'}`}
        >
          Подробнее
        </Button>
      )}
    </div>
  </article>
);
