import type { SkillCategoriesData } from '@/entities/Skill';

export type FilterPayload = {
  general: string | null;
  gender: string | null;
  skills: SkillCategoriesData | null;
  cities: string[];
  filtersApplied: boolean;
};
