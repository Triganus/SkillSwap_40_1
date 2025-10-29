export interface Skill {
  skill_id: string;
  skill_name: string;
  skill_image: string;
}

export interface SkillsData {
  skill_categories: SkillCategory[];
}

export interface Skill {
  id: string;
  title: string;
  description: string;
  type: 'teaching' | 'learning';
  category: string;
  tags: string[];
  authorId: string;
  createdAt: string;
}
export interface SkillListItem {
  skill_id: string;
  skill_name: string;
  skill_image: string;
}

export interface SkillCategory {
  category: string;
  skills: SkillListItem[];
}

export interface SkillCategoriesData {
  skill_categories: SkillCategory[];
}
