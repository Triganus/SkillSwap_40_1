import type { SkillCardProps } from '@/widgets/Cards/SkillCard';

export const sortSkillCards = (
  cards: SkillCardProps[],
  sortOrder: 'newest' | 'oldest'
): SkillCardProps[] => {
  // Создаем копию массива, чтобы избежать мутации оригинального
  const sorted = [...cards];

  sorted.sort((a, b) => {
    const dateA = new Date(a.user.createdAt).getTime();
    const dateB = new Date(b.user.createdAt).getTime();

    return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
  });

  return sorted;
};
