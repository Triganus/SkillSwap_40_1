import { useCallback, useMemo } from 'react';
import type { SkillCardProps } from '@widgets/Cards/SkillCard';
import type { FilterPayload } from '@/entities/filterSideBar/model';

export function useSidebarFilter(currentFilters: FilterPayload) {
  const selectedSkillIds = useMemo(() => {
    const cats = currentFilters.skills?.skill_categories ?? [];
    const ids = cats.flatMap((c) => c.skills.map((s) => String(s.skill_id)));

    // Отладочное логирование
    if (process.env.NODE_ENV === 'development' && ids.length > 0) {
      console.log('[useSidebarFilter] Selected skill IDs:', {
        raw: cats.flatMap((c) => c.skills.map((s) => s.skill_id)),
        normalized: ids,
        categories: cats.map((c) => ({
          category: c.category || c.categoryId,
          skills: c.skills.map((s) => ({ skill_id: s.skill_id, skill_name: s.skill_name })),
        })),
      });
    }

    return new Set(ids);
  }, [currentFilters.skills]);

  const matchesSidebar = useCallback(
    (card: SkillCardProps) => {
      const general = currentFilters.general;
      const gender = currentFilters.gender;
      const hasSkillFilter = selectedSkillIds.size > 0;
      const hasGenderFilter = gender && gender !== 'Не имеет значения';

      // В Redux хранятся английские значения: 'can_teach', 'want_to_learn', ''
      const isCanTeach = general === 'can_teach';
      const isWantToLearn = general === 'want_to_learn';
      const isAll = !general || general === '';

      if (hasSkillFilter) {
        // Если выбраны конкретные навыки, проверяем их наличие в соответствующей категории
        if (isCanTeach) {
          // "Могу научить" + категория → показываем карточки, у которых эта категория в teachingSkills
          // (ищем тех, кто ТОЖЕ МОЖЕТ НАУЧИТЬ этому навыку - похожие пользователи)
          const cardTeachingSkillIds = card.teachingSkills.map((s) => String(s.id).trim());
          const selectedIdsArray = Array.from(selectedSkillIds).map((id) => String(id).trim());

          const hasMatchingSkill = cardTeachingSkillIds.some((cardId) => {
            return selectedIdsArray.includes(cardId);
          });

          if (!hasMatchingSkill) {
            if (process.env.NODE_ENV === 'development') {
              console.log('[useSidebarFilter] Card filtered out (can_teach):', {
                userId: card.user.id,
                userName: card.user.name,
                selectedSkillIds: selectedIdsArray,
                cardTeachingSkillIds,
                cardTeachingSkills: card.teachingSkills.map((s) => ({
                  id: String(s.id),
                  title: s.title,
                })),
                matchAttempts: cardTeachingSkillIds.map((cardId) => ({
                  cardId,
                  matches: selectedIdsArray.filter((selId) => selId === cardId),
                })),
              });
            }
            return false;
          }

          if (process.env.NODE_ENV === 'development') {
            console.log('[useSidebarFilter] Card matches (can_teach):', {
              userId: card.user.id,
              userName: card.user.name,
              selectedSkillIds: selectedIdsArray,
              cardTeachingSkillIds,
              matched: true,
            });
          }
        } else if (isWantToLearn) {
          // "Хочу научиться" + категория → показываем карточки, у которых эта категория в learningSkills
          // (ищем тех, кто ТОЖЕ ХОЧЕТ НАУЧИТЬСЯ этому навыку - похожие пользователи)
          const cardLearningSkillIds = card.learningSkills.map((s) => String(s.id).trim());
          const selectedIdsArray = Array.from(selectedSkillIds).map((id) => String(id).trim());

          const hasMatchingSkill = cardLearningSkillIds.some((cardId) => {
            return selectedIdsArray.includes(cardId);
          });

          if (!hasMatchingSkill) {
            if (process.env.NODE_ENV === 'development') {
              console.log('[useSidebarFilter] Card filtered out (want_to_learn):', {
                userId: card.user.id,
                userName: card.user.name,
                selectedSkillIds: selectedIdsArray,
                cardLearningSkillIds,
                cardLearningSkills: card.learningSkills.map((s) => ({
                  id: String(s.id),
                  title: s.title,
                })),
                matchAttempts: cardLearningSkillIds.map((cardId) => ({
                  cardId,
                  matches: selectedIdsArray.filter((selId) => selId === cardId),
                })),
              });
            }
            return false;
          }

          if (process.env.NODE_ENV === 'development') {
            console.log('[useSidebarFilter] Card matches (want_to_learn):', {
              userId: card.user.id,
              userName: card.user.name,
              selectedSkillIds: selectedIdsArray,
              cardLearningSkillIds,
              matched: true,
            });
          }
        } else if (isAll) {
          // "Всё" + категория → ищем навык в любой категории (teachingSkills или learningSkills)
          const cardTeachingSkillIds = card.teachingSkills.map((s) => String(s.id).trim());
          const cardLearningSkillIds = card.learningSkills.map((s) => String(s.id).trim());
          const selectedIdsArray = Array.from(selectedSkillIds).map((id) => String(id).trim());

          const teachHit = cardTeachingSkillIds.some((cardId) => selectedIdsArray.includes(cardId));
          const learnHit = cardLearningSkillIds.some((cardId) => selectedIdsArray.includes(cardId));

          if (!teachHit && !learnHit) return false;
        }
      } else {
        // Если не выбраны конкретные навыки, но выбран фильтр, проверяем наличие навыков в соответствующей категории
        if (isCanTeach) {
          // "Могу научить" без конкретных навыков → показываем всех, у кого есть навыки для обучения
          if (card.teachingSkills.length === 0) return false;
        } else if (isWantToLearn) {
          // "Хочу научиться" без конкретных навыков → показываем всех, у кого есть навыки, которым они хотят научиться
          if (card.learningSkills.length === 0) return false;
        }
        // Если фильтр "Всё" или не выбран, показываем все карточки (не фильтруем по категории)
      }

      if (hasGenderFilter && card.user.gender?.toLowerCase() !== gender.toLowerCase()) {
        return false;
      }

      if (currentFilters.cities.length) {
        const bio = (card.user.bio || '').toLowerCase();
        const inCity = currentFilters.cities.some((c) => bio.includes(c.toLowerCase()));
        if (!inCity) return false;
      }

      return true;
    },
    [currentFilters, selectedSkillIds]
  );

  return { matchesSidebar };
}
