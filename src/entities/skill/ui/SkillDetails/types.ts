import type { TagCategory } from '@/shared/ui/Tag';

export type SkillDetailsVariant = 'can' | 'want';

export interface SkillDetailsProps {
  // Основной контент
  title: string; // Название навыка
  category: TagCategory; // Категория
  categoryLabel?: string; // Полная категория с подкатегорией (например, "Творчество и искусство / Музыка и звук")
  text: string; // Описание навыка
  images: string[]; // Массив URL изображений
  // Режим отображения
  variant: SkillDetailsVariant;
  // Для режима "want" (публичный просмотр)
  isLiked?: boolean; // В избранном ли
  isLikeActive?: boolean; // Можно ли лайкать (авторизован?)
  isRequestSent?: boolean; // Отправлен ли запрос на обмен
  likesCount?: number; // Счетчик лайков
  onLikeClick?: () => void;
  onExchangeClick?: () => void;
  onShareClick?: () => void;
  onMoreClick?: () => void;
  // Для режима "can" (редактирование)
  onEditClick?: () => void;
  onDoneClick?: () => void;
  // Дополнительные классы
  className?: string;
}
