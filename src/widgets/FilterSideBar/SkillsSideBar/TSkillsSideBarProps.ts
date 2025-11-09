import type { SkillCategoriesData } from '@/entities/Skill';
// prop
export interface TSkillsSideBarProps {
  data: SkillCategoriesData;
  title: string;
  value: SkillCategoriesData | null;
  onChange?: (selected: SkillCategoriesData) => void;
}
