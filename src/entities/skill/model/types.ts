import type { Skill } from './types/types';

export interface IUserPublic {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  createdAt: string;
}

export interface SkillsState {
  skills: Skill[];
  popularSkills: Skill[];
  newSkills: Skill[];
  searchResults: Skill[];
  searchQuery: string;
  loading: boolean;
  error: string | null;
}
