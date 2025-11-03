// Использусуществующие из entities
import type { User } from '@entities/user/model/types/types';
import type { Skill } from '@entities/skill/model/types/types';

export interface SkillCardProps {
  user: User;
  teachingSkills: Skill[];
  learningSkills: Skill[];
  onDetailsClick?: () => void;
  onLikeClick?: () => void;
  isLiked?: boolean;
  ariaLabel?: string;
}
