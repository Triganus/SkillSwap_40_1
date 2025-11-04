// Используем существующие типы из entities
import type { User } from '@entities/user/model';
import type { Skill } from '@entities/skill/model/types/types';
import type { TagCategory } from '@/shared/ui/Tag';

export type SkillCardMode = 'compact' | 'full';

export interface SkillCardProps {
  user: User;
  teachingSkills: Skill[];
  learningSkills: Skill[];
  onDetailsClick?: () => void;
  onLikeClick?: () => void;
  onExchangeClick?: () => void;
  onShareClick?: () => void;
  onMoreClick?: () => void;
  isLiked?: boolean;
  ariaLabel?: string;
  showDetailsButton?: boolean; // Показывать ли кнопку "Подробнее"
  // Props for full mode
  mode?: SkillCardMode;
  description?: string;
  images?: string[];
  title?: string;
  category?: TagCategory;
  isProposed?: boolean; // Обмен уже предложен
}
