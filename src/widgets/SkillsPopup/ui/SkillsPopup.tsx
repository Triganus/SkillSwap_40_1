import { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { fetchSkillsCatalog } from '@/api/skills-api';
import type { SkillCategoriesData, SkillCategory } from '@/entities/Skill';
import { TextUI } from '@shared/ui/Text';
import { Icon } from '@shared/ui/Icon';
import { selectCategoryConfigByName } from '@/entities/directory';
import { useClickOutside } from '@shared/hooks/useClickOutside';
import type { SkillsPopupProps } from '../types';
import styles from '../SkillsPopup.module.scss';

export const SkillsPopup: React.FC<SkillsPopupProps> = ({ isOpen, onClose, buttonRef }) => {
  const [categoriesData, setCategoriesData] = useState<SkillCategory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  // Используем useClickOutside для закрытия по клику вне попапа
  useClickOutside(
    [popupRef, buttonRef].filter(Boolean) as Array<React.RefObject<HTMLElement | null>>,
    onClose,
    isOpen
  );

  // Загружаем данные один раз при монтировании компонента
  useEffect(() => {
    const loadSkillsData = async () => {
      try {
        setIsLoading(true);
        const data: SkillCategoriesData = await fetchSkillsCatalog();
        setCategoriesData(data.skill_categories);
      } catch (error) {
        console.error('Error loading skills:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSkillsData();
  }, []); // Загружаем только один раз при монтировании

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

  if (!isOpen) return null;

  // Определяем порядок категорий согласно макету
  const categoryOrder = [
    'Бизнес и карьера',
    'Иностранные языки',
    'Дом и уют',
    'Творчество и искусство',
    'Образование и развитие',
    'Здоровье и образ жизни',
  ];

  // Сортируем категории согласно макету
  const sortedCategories = categoryOrder
    .map((categoryName) => categoriesData.find((cat) => cat.category === categoryName))
    .filter((cat): cat is SkillCategory => cat !== undefined);

  // Разделяем категории на две колонки согласно макету
  const leftColumn = sortedCategories.slice(0, 3);
  const rightColumn = sortedCategories.slice(3, 6);

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
