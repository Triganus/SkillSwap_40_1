import React from 'react';
import { TitleUI } from '@/shared/ui/Title/TitleUI';
import { SkillCardWidget } from '@/widgets/SkillCard/SkillCard';
import { TextUI } from '@/shared/ui/Text/TextUI';
import styles from './CardsSlider.module.scss';
import { Slider } from '@shared/ui/slider';
import type { SkillCardProps } from '@shared/ui/SkillCard/type';
import type { CardsSliderProps } from './types';

export const CardSlider: React.FC<CardsSliderProps> = ({
  title,
  skillsList,
  loading,
  className,
}) => {
  const rootClassName = [styles.root, className].filter(Boolean).join(' ');

  return (
    <section className={rootClassName}>
      <div className={styles['title-wrapper']}>
        <TitleUI size="large">{title}</TitleUI>
      </div>

      {loading ? (
        <div className={styles['loading-placeholder']}>
          <TextUI variant="body" color="muted">
            Загрузка предложений...
          </TextUI>
        </div>
      ) : skillsList.length === 0 ? (
        <div className={styles['empty-placeholder']}>
          <TextUI variant="body" color="muted">
            Похожие предложения не найдены.
          </TextUI>
        </div>
      ) : (
        <Slider
          slidesPerView={4}
          className={styles.slider}
          data={skillsList}
          renderItem={(skill: SkillCardProps) => <SkillCardWidget {...skill} />}
        />
      )}
    </section>
  );
};
