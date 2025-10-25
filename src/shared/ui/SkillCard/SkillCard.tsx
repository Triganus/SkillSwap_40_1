import React from 'react';

import styles from './SkillCard.module.scss';

import { Button } from '../Button/Button';
import { Icon } from '../Icon/Icon';
import type { SkillCardProps } from './type';

export const SkillCard: React.FC<SkillCardProps> = ({
  user,
  teachingSkills,
  learningSkills,
  onDetailsClick,
  onLikeClick,
  isLiked = false,
}) => {
  return (
    <article className={styles.card}>
      <div className={styles.header}>
        <div className={styles.userInfo}>
          <img
            src={user.avatar || '/default-avatar.png'}
            alt={user.name}
            className={styles.avatar}
          />
          <div className={styles.userDetails}>
            <h3 className={styles.name}>{user.name}</h3>
            <p className={styles.location}>{user.bio || 'Город не указан'}</p>
          </div>
        </div>
        <button
          className={styles.likeButton}
          onClick={onLikeClick}
          aria-label={isLiked ? 'Убрать из избранного' : 'Добавить в избранное'}
        >
          <Icon name="heart" className={isLiked ? styles.liked : styles.notLiked} />
        </button>
      </div>

      <div className={styles.skillsSection}>
        <div className={styles.skillGroup}>
          <h4 className={styles.skillLabel}>Может научить:</h4>
          <div className={styles.skillTags}>
            {teachingSkills.map((skill, index) => (
              <span key={index} className={`${styles.tag} ${styles.teachTag}`}>
                {skill.title}
              </span>
            ))}
          </div>
        </div>

        <div className={styles.skillGroup}>
          <h4 className={styles.skillLabel}>Хочет научиться:</h4>
          <div className={styles.skillTags}>
            {learningSkills.slice(0, 2).map((skill, index) => (
              <span key={index} className={`${styles.tag} ${styles.learnTag}`}>
                {skill.title}
              </span>
            ))}
            {learningSkills.length > 2 && (
              <span className={`${styles.tag} ${styles.moreTag}`}>
                +{learningSkills.length - 2}
              </span>
            )}
          </div>
        </div>
      </div>

      <Button className={styles.detailsButton} onClick={onDetailsClick}>
        Подробнее
      </Button>
    </article>
  );
};
