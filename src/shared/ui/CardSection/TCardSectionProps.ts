import type { SkillCardProps } from '../SkillCard';

// TODO: Насколько правильно импортировать из другого компонента?
export type TCardSectionProps = {
  title: string;
  onLookClick?: () => void;
  cards: SkillCardProps[];
  showButton?: boolean;
  className?: string;
  showAllCards?: boolean; // если не нужно, можно будет удалить
  maxCards?: number; // если не нужно, можно будет удалить
};
