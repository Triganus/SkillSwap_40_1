import type { SkillCategoriesData } from "@/entities/Skill";

export interface TSkillsSideBarUIprops {
   data: SkillCategoriesData ;
   title: string;
   onChange?: (selected: SkillCategoriesData) => void;
}