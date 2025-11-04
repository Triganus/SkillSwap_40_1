import type { SkillCardProps } from '@widgets/Cards/SkillCard';

export interface CardsSliderProps {
  title: string;
  skillsList: SkillCardProps[];
  loading: boolean;
  className?: string;
}
