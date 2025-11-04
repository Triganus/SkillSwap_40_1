import type { SkillCategoriesData } from '@/entities/Skill';
import type { FilterPayload } from '@/entities/filterSideBar/model/types/types';

export interface TFilterSideBarProps {
  skillsCatalog: SkillCategoriesData;
  onChange: (filters: FilterPayload) => void;
}
