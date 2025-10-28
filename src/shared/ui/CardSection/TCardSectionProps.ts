import type { SkillCardProps } from '../SkillCard';

// TODO: Насколько правильно импортировать из другого компонента?
export type TCardSectionProps = {
  title: string;
  onLookClick?: () => void;
  cards: Array<SkillCardProps>;
  className?: string;
};
