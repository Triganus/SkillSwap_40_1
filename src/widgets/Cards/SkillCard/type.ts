// Используем существующие типы из entities
import type { User } from '@entities/user/model';
import type { TagCategory } from '@/shared/ui/Tag';

export type SkillCardMode = 'compact' | 'full' | 'skill-page';

export interface SkillReference {
  id: string; // ID подкатегории
  title: string; // Название подкатегории
  category: string; // ID категории
}

export interface SkillCardProps {
  user: User;
  teachingSkills: SkillReference[];
  learningSkills: SkillReference[];
  onDetailsClick?: () => void;
  onLikeClick?: () => void;
  onExchangeClick?: () => void;
  onShareClick?: () => void;
  onMoreClick?: () => void;
  isLiked?: boolean;
  likesCount?: number; // Счетчик лайков
  ariaLabel?: string;
  showDetailsButton?: boolean; // Показывать ли кнопку "Подробнее"
  // Props for full mode
  mode?: SkillCardMode;
  description?: string;
  images?: string[];
  title?: string;
  category?: TagCategory;
  isProposed?: boolean; // Обмен уже предложен
  // Props for skill-page mode
  userBio?: string; // Биография пользователя (about_me)
  locationAndAge?: string; // Город и возраст отдельно от bio
}
