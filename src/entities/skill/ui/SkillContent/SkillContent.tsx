import React, { useMemo } from 'react';
import { TitleUI } from '@/shared/ui/Title/TitleUI';
import { TextUI } from '@/shared/ui/Text/TextUI';
import { MediaSlider } from '@/shared/ui/MediaSlider/MediaSlider';
import type { MediaItem } from '@/shared/ui/MediaSlider/types';
import type { TagCategory } from '@/shared/ui/Tag';
import styles from './SkillContent.module.scss';

export interface SkillContentProps {
  title: string;
  category: TagCategory;
  categoryLabel?: string;
  subcategory?: string;
  description: string;
  images: string[];
  className?: string;
  children?: React.ReactNode; // Слот для кнопок действий
}

export const SkillContent: React.FC<SkillContentProps> = ({
  title,
  categoryLabel,
  subcategory,
  description,
  images,
  className = '',
  children,
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

  // Формируем строку категории
  const categoryText = useMemo(() => {
    if (categoryLabel && subcategory) {
      return `${categoryLabel} / ${subcategory}`;
    }

    return categoryLabel || '';
  }, [categoryLabel, subcategory]);

  return (
    <div className={`${styles.skillContent} ${className}`}>
      <div className={styles.leftContent}>
        <div className={styles.infoBlock}>
          <div className={styles.header}>
            <TitleUI size="large" className={styles.title}>
              {title}
            </TitleUI>
            {categoryText && (
              <TextUI variant="caption" className={styles.meta}>
                {categoryText}
              </TextUI>
            )}
          </div>
          <TextUI variant="body" className={styles.description}>
            {description}
          </TextUI>
        </div>
        {children && <div className={styles.actions}>{children}</div>}
      </div>

      <div className={styles.rightContent}>
        {images.length > 0 ? (
          <MediaSlider items={mediaItems} />
        ) : (
          <div className={styles.noImages}>
            <TextUI variant="caption">Изображения не загружены</TextUI>
          </div>
        )}
      </div>
    </div>
  );
};
