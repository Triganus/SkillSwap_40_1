import { memo, type FC } from 'react';
import styles from './CardSectionUI.module.scss';
import type { TCardSectionProps } from './TCardSectionProps';
import { Icon } from '../Icon';
import { SkillCard } from '../SkillCard';
import { Button } from '../Button';
import { TitleUI } from '../Title';

export const CardSectionUI: FC<TCardSectionProps> = memo(({ title, onLookClick, cards }) => (
  <section className={styles.section}>
    <div className={styles.sectionContent}>
      {/* TODO: Добавить в типизацию TitleUI className? */}
      <TitleUI size="large">{title}</TitleUI>
      {/* TODO: Добавить правильные стили в компонент Button, а потом добавить данные сюда. Не забыть радиус */}
      <Button
        className={styles.lookButton}
        onClick={onLookClick}
        variant="primary"
        size="medium"
        type="button"
      >
        Смотреть все
        <Icon name="chevron-right" size={24} title="" className={styles.iconChevronRight} />
      </Button>
    </div>
    <div className={styles.sectionCard}>
      {cards?.map((card, index) => (
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
));
