import type { SkillCardProps } from '@/widgets/Cards/SkillCard';

export const showCardDetails = (
  cards: SkillCardProps[],
  onSkillDetailsClick?: (skillId: string) => void
): SkillCardProps[] => {
  return cards.map((card) => ({
    ...card,
    onDetailsClick: onSkillDetailsClick
      ? () => onSkillDetailsClick(card.user.id)
      : card.onDetailsClick,
  }));
};
