import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useAppSelector } from '@/shared/hooks/redux';
import { selectSkillsCatalog, selectDirectoriesLoading } from '@/entities/directory';
import type { SkillCategory } from '@/entities/Skill';
import { TextUI } from '@shared/ui/Text';
import { Icon } from '@shared/ui/Icon';
import { selectCategoryConfigByName } from '@/entities/directory';
import { useClickOutside } from '@shared/hooks/useClickOutside';
import type { SkillsPopupProps } from '../types';
import styles from '../SkillsPopup.module.scss';

export const SkillsPopup: React.FC<SkillsPopupProps> = ({ isOpen, onClose, buttonRef }) => {
  const popupRef = useRef<HTMLDivElement>(null);
  const skillsCatalog = useAppSelector(selectSkillsCatalog);
  const isLoading = useAppSelector(selectDirectoriesLoading);

  // Используем useClickOutside для закрытия по клику вне попапа
  useClickOutside(
    [popupRef, buttonRef].filter(Boolean) as Array<React.RefObject<HTMLElement | null>>,
    onClose,
    isOpen
  );

  useEffect(() => {
    if (isOpen) {
      // Блокируем прокрутку фоновой страницы
      document.body.style.overflow = 'hidden';
    } else {
      // Разблокируем прокрутку при закрытии
      document.body.style.overflow = '';
    }

    // Очистка при размонтировании
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const categories = skillsCatalog?.skill_categories || [];

  // Разделяем категории на две колонки согласно макету
  const leftColumn = categories.slice(0, 3);
  const rightColumn = categories.slice(3, 6);

  const renderCategory = (category: SkillCategory) => {
    const categoryConfig = selectCategoryConfigByName(category.category);
    if (!categoryConfig) return null;

    return (
      <div key={category.category} className={styles.categoryItem}>
        <div className={styles.iconCircle} style={{ backgroundColor: categoryConfig.color }}>
          <Icon
            name={categoryConfig.iconName}
            size={18}
            className={styles.itemIcon}
            fill="none"
            stroke="currentColor"
          />
        </div>
        <div className={styles.categoryItemText}>
          <h2 className={styles.itemTitle}>{category.category}</h2>
          <div className={styles.itemSubs}>
            {category.skills.map((skill) => (
              <TextUI key={skill.skill_id} variant="body" className={styles.subItem}>
                {skill.skill_name}
              </TextUI>
            ))}
          </div>
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      className={styles.modalContainer}
      role="dialog"
      aria-modal="true"
      aria-label="Список всех навыков"
    >
      <div ref={popupRef} className={styles.modal}>
        {isLoading ? (
          <div className={styles.loading}>Загрузка...</div>
        ) : (
          <div className={styles.content}>
            <div className={styles.column}>{leftColumn.map(renderCategory)}</div>
            <div className={styles.column}>{rightColumn.map(renderCategory)}</div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};
