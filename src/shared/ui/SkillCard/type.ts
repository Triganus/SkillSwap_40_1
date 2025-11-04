import type { User } from '@entities/user/model';
import type { Skill } from '@entities/skill/model/types/types';

export interface SkillCardProps {
  user: User;
  teachingSkills: Skill[];
  learningSkills: Skill[];
  onDetailsClick?: () => void;
  onLikeClick?: () => void;
  isLiked?: boolean;
  ariaLabel?: string;
  showDetailsButton?: boolean;
}
