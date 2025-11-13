import { describe, it, expect, beforeEach } from 'vitest';
import { skillsReducer, setSearchQuery, filterSkills, fetchSkills } from '../skillsSlice';
import type { SkillsState } from '../types';
import type { Skill } from '../types/types';

describe('skillsSlice', () => {
  let initialState: SkillsState;

  beforeEach(() => {
    initialState = {
      skills: [],
      popularSkills: [],
      newSkills: [],
      searchResults: [],
      searchQuery: '',
      loading: false,
      error: null,
    };
  });

  it('should return the initial state', () => {
    const state = skillsReducer(undefined, { type: 'unknown' });
    expect(state).toEqual(initialState);
  });

  it('should handle setSearchQuery', () => {
    const newState = skillsReducer(initialState, setSearchQuery('test'));
    expect(newState.searchQuery).toBe('test');
  });

  it('should filter skills correctly', () => {
    const skills: Skill[] = [
      {
        id: '1',
        title: 'JavaScript',
        description: 'JS skill',
        type: 'learning',
        category: 'business',
        authorId: 'a1',
        createdAt: '2023-01-01',
      },
      {
        id: '2',
        title: 'Python',
        description: 'Python skill',
        type: 'learning',
        category: 'education',
        authorId: 'a2',
        createdAt: '2023-02-01',
      },
    ];

    const stateWithSkills = { ...initialState, skills };
    const filteredState = skillsReducer(
      { ...stateWithSkills, searchQuery: 'python' },
      filterSkills()
    );

    expect(filteredState.searchResults.length).toBe(1);
    expect(filteredState.searchResults[0].title).toBe('Python');
    expect(filteredState.popularSkills.length).toBe(2);
    expect(filteredState.newSkills[0].title).toBe('Python');
  });

  it('should handle fetchSkills pending', () => {
    const action = { type: fetchSkills.pending.type };
    const state = skillsReducer(initialState, action);
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle fetchSkills fulfilled', () => {
    const skills: Skill[] = [
      {
        id: '1',
        title: 'Skill1',
        description: '',
        type: 'learning',
        category: 'other',
        authorId: 'a1',
        createdAt: '2023-01-01',
      },
    ];
    const action = { type: fetchSkills.fulfilled.type, payload: skills };
    const state = skillsReducer(initialState, action);

    expect(state.loading).toBe(false);
    expect(state.skills).toEqual(skills);
    expect(state.error).toBeNull();
    expect(state.popularSkills.length).toBe(1);
    expect(state.newSkills.length).toBe(1);
  });

  it('should handle fetchSkills rejected', () => {
    const action = { type: fetchSkills.rejected.type, payload: 'Error message' };
    const state = skillsReducer(initialState, action);

    expect(state.loading).toBe(false);
    expect(state.error).toBe('Error message');
  });
});
