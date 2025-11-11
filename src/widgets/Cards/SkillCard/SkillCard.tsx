import React from 'react';

import styles from './SkillCard.module.scss';

import { Button } from '@/shared/ui/Button';
import type { SkillCardProps } from './type';
import { AvatarUI } from '@/shared/ui/AvatarUI';
import { TitleUI } from '@/shared/ui/Title';
import { TextUI } from '@/shared/ui/Text';
import { LikeButtonUI } from '@/shared/ui/LikeButton';
import { TagUI } from '@/shared/ui/Tag';
import type { TagCategory } from '@/shared/ui/Tag';
import { MediaSlider } from '@/shared/ui/MediaSlider';
import { Icon } from '@/shared/ui/Icon';
import { selectCategoryIdToName } from '@/entities/directory/model/selectors';
import { useAppSelector } from '@/shared/hooks/redux';
import type { MediaItem } from '@/shared/ui/MediaSlider/types';

export const SkillCard: React.FC<SkillCardProps> = ({
  user,
  teachingSkills,
  learningSkills,
  onDetailsClick,
  onLikeClick,
  onExchangeClick,
  onShareClick,
  onMoreClick,
  isLiked = false,
  likesCount = 0,
  ariaLabel,
  mode = 'compact',
  description,
  images = [],
  title,
  category,
  isProposed = false,
  userBio,
  locationAndAge,
}) => {
  const categoryIdToName = useAppSelector(selectCategoryIdToName);

  // Преобразуем images в формат MediaItem
  const mediaItems: MediaItem[] = React.useMemo(
    () =>
      images.map((src, idx) => ({
        id: `img-${idx}`,
        src,
        alt: `${title || 'Навык'} - изображение ${idx + 1}`,
      })),
    [images, title]
  );

  // Полный режим
  if (mode === 'full') {
    return (
      <article
        className={styles.card}
        aria-label={ariaLabel || `Карточка навыка ${title || user.name}`}
      >
        {/* Блок действий (лайк, поделиться, ещё) - сверху справа */}
        <div className={styles.actionbar}>
          {onLikeClick && (
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

        <div className={styles.fullContent}>
          {/* Левая колонка - информация о пользователе и навыке */}
          <div className={styles.leftColumn}>
            {/* Информация о пользователе */}
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
            </div>

            {/* Заголовок навыка */}
            {title && (
              <div className={styles.skillHeader}>
                <TitleUI size="large">{title}</TitleUI>
                {category && (
                  <TagUI
                    label={categoryIdToName[category] || category}
                    category={category}
                    className={styles.categoryTag}
                  />
                )}
              </div>
            )}

            {/* Описание навыка */}
            {description && (
              <div className={styles.description}>
                <TextUI variant="body">{description}</TextUI>
              </div>
            )}

            {/* Теги навыков (полностью, без сокращения) - только если есть навыки для обучения */}
            {(teachingSkills.length > 0 || learningSkills.length > 0) && (
              <div className={styles.skillsSection}>
                {teachingSkills.length > 0 && (
                  <div className={styles.skillGroup}>
                    <TitleUI size="xsmall">Может научить:</TitleUI>
                    <div className={styles.skillTags} aria-label="Может научить">
                      {teachingSkills.slice(0, 1).map((skill) => (
                        <TagUI
                          key={skill.id}
                          label={skill.title}
                          category={skill.category as TagCategory}
                        />
                      ))}
                      {teachingSkills.length > 1 && (
                        <TagUI label={`+${teachingSkills.length - 1}`} />
                      )}
                    </div>
                  </div>
                )}

                {learningSkills.length > 0 && (
                  <div className={styles.skillGroup}>
                    <TitleUI size="xsmall">Хочет научиться:</TitleUI>
                <div className={styles.skillTags} aria-label="Хочет научиться">
                      {learningSkills.slice(0, 1).map((skill) => (
                        <TagUI
                          key={skill.id}
                          label={skill.title}
                          category={skill.category as TagCategory}
                        />
                      ))}
                      {learningSkills.length > 1 && (
                        <TagUI label={`+${learningSkills.length - 1}`} />
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Кнопка "Предложить обмен" или "Обмен предложен" */}
            {isProposed ? (
              <Button
                variant="secondary"
                type="button"
                className={styles.exchangeButton}
                aria-label="Обмен уже предложен"
              >
                Обмен предложен
              </Button>
            ) : (
              onExchangeClick && (
                <Button
                  onClick={onExchangeClick}
                  variant="primary"
                  type="button"
                  className={styles.exchangeButton}
                  aria-label="Предложить обмен навыками"
                >
                  Предложить обмен
                </Button>
              )
            )}
          </div>

          {/* Правая колонка - галерея изображений */}
          {images.length > 0 && (
            <div className={styles.rightColumn}>
              <MediaSlider items={mediaItems} mainSize={480} />
            </div>
          )}
        </div>
      </article>
    );
  }

  // Режим для страницы навыка (по дизайну Figma)
  if (mode === 'skill-page') {
    return (
      <article
        className={`${styles.card} ${styles.cardSkillPage}`}
        aria-label={ariaLabel || `Карточка пользователя ${user.name}`}
      >
        {/* Аватар и имя в одной строке */}
        <div className={styles.skillPageUserInfo}>
          <AvatarUI
            src={user.avatar || '/default-avatar.png'}
            alt={`Аватар пользователя ${user.name}`}
            size={100}
          />
          <div className={styles.skillPageUserDetails}>
            <TitleUI size="medium">{user.name}</TitleUI>
            {locationAndAge && (
              <TextUI variant="caption" color="primary">
                {locationAndAge}
              </TextUI>
            )}
          </div>
        </div>

        {/* Биография пользователя */}
        {userBio && userBio.trim() && (
          <div className={styles.skillPageBio}>
            <TextUI variant="body" color="primary">
              {userBio}
            </TextUI>
          </div>
        )}

        {/* Навыки */}
        <div className={styles.skillsSection}>
          <div className={styles.skillGroup}>
            <TitleUI size="xsmall">Может научить:</TitleUI>
            <div className={styles.skillTags} aria-label="Может научить">
              {teachingSkills.slice(0, 1).map((skill) => (
                <TagUI
                  key={skill.id}
                  label={skill.title}
                  category={skill.category as TagCategory}
                />
              ))}
              {teachingSkills.length > 1 && (
                <TagUI label={`+${teachingSkills.length - 1}`} category="other" />
              )}
            </div>
          </div>

          <div className={styles.skillGroup}>
            <TitleUI size="xsmall">Хочет научиться:</TitleUI>
            <div className={styles.skillTags} aria-label="Хочет научиться">
              {learningSkills.map((skill) => (
                <TagUI
                  key={skill.id}
                  label={skill.title}
                  category={skill.category as TagCategory}
                />
              ))}
            </div>
          </div>
        </div>
      </article>
    );
  }

  // Компактный режим (по умолчанию)
  return (
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
          isActive={isLiked}
          onClick={onLikeClick}
          ariaLabel={
            isLiked ? `Убрать ${user.name} из избранного` : `Добавить ${user.name} в избранное`
          }
          className={styles.likeButton}
          likesCount={likesCount}
          showCount={true}
        />
      </div>
      <div className={styles.basicContent}>
        <div className={styles.skillsSection}>
          <div className={styles.skillGroup}>
            <TitleUI size="xsmall">Может научить:</TitleUI>
            <div className={styles.skillTags} aria-label="Может научить">
              {teachingSkills.slice(0, 1).map((skill) => (
                <TagUI
                  key={skill.id}
                  label={skill.title}
                  category={skill.category as TagCategory}
                />
              ))}
              {teachingSkills.length > 1 && (
                <TagUI label={`+${teachingSkills.length - 1}`} category="other" />
              )}
            </div>
          </div>

          <div className={styles.skillGroup}>
            <TitleUI size="xsmall">Хочет научиться:</TitleUI>
            <div className={styles.skillTags} aria-label="Хочет научиться">
              {learningSkills.slice(0, 2).map((skill) => (
                <TagUI
                  key={skill.id}
                  label={skill.title}
                  category={skill.category as TagCategory}
                />
              ))}
              {learningSkills.length > 2 && (
                <TagUI label={`+${learningSkills.length - 2}`} category="other" />
              )}
            </div>
          </div>
        </div>
        {onDetailsClick && (
          <div className={styles.buttonWrapper}>
            <Button
              onClick={(e) => {
                console.log('[SkillCard] Button clicked for user:', user.name);
                e.preventDefault();
                e.stopPropagation();
                console.log('[SkillCard] Calling onDetailsClick');
                onDetailsClick();
              }}
              variant="primary"
              type="button"
              aria-label={`Подробнее о пользователе ${user.name}`}
            >
              Подробнее
            </Button>
          </div>
        )}
      </div>
    </article>
  );
};