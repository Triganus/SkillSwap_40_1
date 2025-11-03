import { memo, type FC } from 'react';
import styles from './CardSectionUI.module.scss';
import type { TCardSectionProps } from './TCardSectionProps';
import { Icon } from '../Icon';
import { SkillCard } from '../SkillCard';
import { Button } from '../Button';
import { TitleUI } from '../Title';

export const CardSectionUI: FC<TCardSectionProps> = memo(
  ({ title, onLookClick, cards, showAllCards = false, maxCards = 3, showButton = true }) => {
    const visibleCards = showAllCards ? cards : cards.slice(0, maxCards);

    return (
      <section className={styles.section}>
        <div className={styles.sectionContent}>
          <TitleUI size="large">{title}</TitleUI>
          {showButton && onLookClick && (
            <Button
              className={styles.lookButton}
              onClick={onLookClick}
              variant="tertiary"
              type="button"
              aria-label={`Показать все карточки в разделе ${title}`}
            >
              Смотреть все
              <Icon
                name="chevron-right"
                size={24}
                className={styles.iconChevronRight}
                fill="#253017"
                stroke="#253017"
                aria-hidden="true"
              />
            </Button>
          )}
        </div>
        <div className={styles.sectionCard}>
          {visibleCards?.map((card, index) => (
            <div key={card.user.id || index} className={styles.cardWrapper}>
              <SkillCard
                user={card.user}
                teachingSkills={card.teachingSkills}
                learningSkills={card.learningSkills}
                onDetailsClick={card.onDetailsClick}
                onLikeClick={card.onLikeClick}
                isLiked={card.isLiked}
              />
            </div>
          ))}
        </div>
      </section>
    );
  }
);
