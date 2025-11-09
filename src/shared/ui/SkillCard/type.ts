import type { User } from '@entities/user/model/types/types';
import type { Skill } from '@entities/skill/model/types/types';

export interface SkillCardProps {
  // Данные пользователя
  user: Pick<User, 'id' | 'name' | 'avatar'> & {
    location?: string;
    age?: number;
    bio?: string;
  };

  // Навыки
  teachingSkills: Skill[];
  learningSkills: Skill[];

  // Вариант отображения
  variant?: 'compact' | 'detailed';

  // Обработчики действий
  onDetailsClick?: () => void;
  // Алиас для обратной совместимости — некоторые сторис/использования могли называть колбэк onViewDetails
  onViewDetails?: () => void;
  onOfferExchange?: () => void;
  onToggleFavorite?: () => void;

  // Состояния
  isFavorite?: boolean;

  // Стилизация
  className?: string;
}
