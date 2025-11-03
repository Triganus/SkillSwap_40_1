// Экспорт типов
export type { SkillsState, IUserPublic } from './types';
export type { Skill } from './types/types';

// Экспорт редюсера
export { skillsReducer } from './skillsSlice';

// Экспорт экшенов
export { setSearchQuery, filterSkills, fetchSkills } from './skillsSlice';

// Экспорт селекторов
export {
  getSkills,
  getPopularSkills,
  getNewSkills,
  getSearchResults,
  getSearchQuery,
  getSkillsLoading,
  getSkillsError,
} from './skillsSlice';
