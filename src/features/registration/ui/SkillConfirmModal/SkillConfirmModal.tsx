import { useCallback } from 'react';
import { Button, Icon, MediaSlider, ModalUI } from '@shared/ui';
import type { TagCategory } from '@shared/ui/Tag';
import styles from './SkillConfirmModal.module.scss';

export interface SkillConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  helpText?: string;
  skillData: {
    title: string;
    category: TagCategory;
    subcategory: string;
    description: string;
    images: string[];
  };
  onEdit: () => void;
  onConfirm: () => void;
  isSubmitting?: boolean;
}

const CATEGORY_LABELS: Record<TagCategory, string> = {
  business: 'Бизнес',
  art: 'Творчество и искусство',
  languages: 'Языки',
  education: 'Образование',
  home: 'Дом и быт',
  health: 'Здоровье',
  other: 'Другое',
};

export const SkillConfirmModal: React.FC<SkillConfirmModalProps> = ({
  isOpen,
  onClose,
  title,
  helpText,
  skillData,
  onEdit,
  onConfirm,
  isSubmitting = false,
}) => {
  const handleEdit = useCallback(() => {
    onEdit();
    onClose();
  }, [onEdit, onClose]);

  const categoryLabel = CATEGORY_LABELS[skillData.category] || skillData.category;

  const leftContent = (
    <section className={styles.leftContent} aria-label="Информация о навыке">
      <article className={styles.infoBlock}>
        <header className={styles.skillHead}>
          <h3 className={styles.skillTitle}>{skillData.title}</h3>
          <p className={styles.skillMeta}>
            {categoryLabel} / {skillData.subcategory}
          </p>
        </header>
        <p className={styles.skillDescription}>{skillData.description}</p>
      </article>

      <footer className={styles.actions}>
        <Button
          variant="secondary"
          type="button"
          onClick={handleEdit}
          disabled={isSubmitting}
          className={styles.actionButton}
        >
          Редактировать
          <Icon name="edit" size={24} title="Редактировать" />
        </Button>
        <Button
          variant="primary"
          type="button"
          onClick={onConfirm}
          disabled={isSubmitting}
          className={styles.actionButton}
        >
          {isSubmitting ? 'Отправка...' : 'Готово'}
        </Button>
      </footer>
    </section>
  );

  const rightContent = (
    <aside className={styles.rightContent} aria-label="Изображения навыка">
      {skillData.images.length > 0 ? (
        <MediaSlider
          items={skillData.images.map((src, index) => ({
            id: `skill-image-${index}`,
            src,
            alt: `${skillData.title} - изображение ${index + 1}`,
          }))}
        />
      ) : (
        <div className={styles.noImages}>Изображения не загружены</div>
      )}
    </aside>
  );

  return (
    <ModalUI isOpen={isOpen} onClose={onClose} title={title} className={styles.modal}>
      {helpText && <p className={styles.helpText}>{helpText}</p>}
      <div className={styles.content}>
        {leftContent}
        {rightContent}
      </div>
    </ModalUI>
  );
};
