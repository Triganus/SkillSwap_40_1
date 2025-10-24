export interface Skill {
  skill_id: string;
  skill_name: string;
  skill_image: string;
}

export interface SkillCategory {
  category: string;
  skills: Skill[];
}

export interface SkillsData {
  skill_categories: SkillCategory[];
}
