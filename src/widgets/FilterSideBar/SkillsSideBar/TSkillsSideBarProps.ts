import type { SkillCategoriesData } from '@/entities/Skill';
// prop
export interface TSkillsSideBarProps {
  data: SkillCategoriesData;
  title: string;
  onChange?: (selected: SkillCategoriesData) => void;
}
