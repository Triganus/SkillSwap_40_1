import type { SkillCategoriesData } from "@/entities/Skill";
// prop
export interface TSkillsSideBarUIprops {
   data: SkillCategoriesData ;
   title: string;
   onChange?: (selected: SkillCategoriesData) => void;
}