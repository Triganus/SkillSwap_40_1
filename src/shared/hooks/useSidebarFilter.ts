import { useCallback, useMemo } from 'react';
import type { SkillCardProps } from '@widgets/Cards/SkillCard';
import type { FilterPayload } from '@/entities/filterSideBar/model';

export function useSidebarFilter(currentFilters: FilterPayload) {
  const selectedSkillIds = useMemo(() => {
    const cats = currentFilters.skills?.skill_categories ?? [];
    return new Set(cats.flatMap((c) => c.skills.map((s) => s.skill_id)));
  }, [currentFilters.skills]);

  const matchesSidebar = useCallback(
    (card: SkillCardProps) => {
      const general = currentFilters.general;
      const gender = currentFilters.gender;
      const hasSkillFilter = selectedSkillIds.size > 0;
      const hasGenderFilter = gender && gender !== 'Не имеет значения';

      const activeTeach = general === 'Могу научить' || !general || general === 'Всё';
      const activeLearn = general === 'Хочу научиться' || !general || general === 'Всё';

      if (hasSkillFilter) {
        let teachHit = false;
        let learnHit = false;
        // "Могу научить" - ищем людей, которые могут научить выбранному навыку
        if (activeTeach) teachHit = card.teachingSkills.some((s) => selectedSkillIds.has(s.id));
        // "Хочу научиться" - ищем людей, которые могут научить выбранному навыку (тоже teachingSkills)
        if (activeLearn) learnHit = card.teachingSkills.some((s) => selectedSkillIds.has(s.id));
        if (general === 'Могу научить' && !teachHit) return false;
        if (general === 'Хочу научиться' && !learnHit) return false;
        if ((!general || general === 'Всё') && !teachHit && !learnHit) return false;
      } else {
        if (general === 'Могу научить' && card.teachingSkills.length === 0) return false;
        // "Хочу научиться" - проверяем, что у пользователя есть навыки для обучения
        if (general === 'Хочу научиться' && card.teachingSkills.length === 0) return false;
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
