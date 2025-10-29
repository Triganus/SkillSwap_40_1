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
}) => (
  <article className={styles.card}>
    <div className={styles.userInfo}>
      <AvatarUI src={user.avatar || '/default-avatar.png'} alt={user.name} />
      <div className={styles.userDetails}>
        {/* TODO: нет расцветки */}
        <TitleUI size="small">{user.name}</TitleUI>
        <TextUI variant="caption" color="primary">
          {user.bio || 'Город не указан'}
        </TextUI>
      </div>
      <LikeButtonUI
        onClick={onLikeClick}
        ariaLabel={isLiked ? 'Убрать из избранного' : 'Добавить в избранное'}
      />
    </div>
    <div className={styles.basicContent}>
      <div className={styles.skillsSection}>
        <div className={styles.skillGroup}>
          <TextUI variant="h4" color="primary">
            Может научить:
          </TextUI>
          <div className={styles.skillTags}>
            {teachingSkills.map((skill, index) => (
              <TagUI key={index} label={skill.title} />
            ))}
          </div>
        </div>

        <div className={styles.skillGroup}>
          <TextUI variant="h4" color="primary">
            Хочет научиться:
          </TextUI>
          <div className={styles.skillTags}>
            {learningSkills.slice(0, 2).map((skill, index) => (
              <TagUI key={index} label={skill.title} />
            ))}
            {learningSkills.length > 2 && <TagUI label={`+${learningSkills.length - 2}`} />}
          </div>
        </div>
      </div>
      <Button onClick={onDetailsClick} variant="primary" size="large" type="button">
        Подробнее
      </Button>
    </div>
  </article>
);
