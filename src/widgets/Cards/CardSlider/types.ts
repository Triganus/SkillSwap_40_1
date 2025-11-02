import type { SkillCardProps } from '@/shared/ui/SkillCard';

export interface CardsSliderProps {
  title: string;
  skillsList: SkillCardProps[];
  loading: boolean;
  className?: string;
}
