import { describe, it, expect, beforeEach } from 'vitest';
import {
  filterSideBarReducer,
  setFilter,
  resetFilter,
  removeSkillFilter,
  removeCityFilter,
  removeGeneralFilter,
  removeGenderFilter,
} from '@/entities/filterSideBar/model/filterSideBarSlice';
import type { FilterPayload } from '@/entities/filterSideBar/model/types/types';

describe('filterSideBarSlice', () => {
  let initialState: FilterPayload;

  beforeEach(() => {
    initialState = {
      general: null,
      gender: null,
      skills: null,
      cities: [],
      filtersApplied: false,
    };
  });

  it('should return initial state', () => {
    const state = filterSideBarReducer(undefined, { type: 'unknown' });
    expect(state).toEqual(initialState);
  });

  it('should handle setFilter', () => {
    const payload: FilterPayload = {
      general: 'Test',
      gender: 'male',
      cities: ['Moscow'],
      skills: {
        skill_categories: [
          {
            category: 'cat1',
            skills: [
              { skill_id: 's1', skill_name: 'Skill One', skill_image: '/img1.png' },
            ],
          },
        ],
      },
      filtersApplied: true,
    };
    const state = filterSideBarReducer(initialState, setFilter(payload));
    expect(state).toEqual(payload);
  });

  it('should handle resetFilter', () => {
    const populatedState: FilterPayload = {
      general: 'something',
      gender: 'female',
      cities: ['SPB'],
      skills: {
        skill_categories: [
          { category: 'cat1', skills: [{ skill_id: 's1', skill_name: 'Skill1', skill_image: '/img.png' }] },
        ],
      },
      filtersApplied: true,
    };
    const state = filterSideBarReducer(populatedState, resetFilter());
    expect(state).toEqual(initialState);
  });

  it('should handle removeSkillFilter', () => {
    const populatedState: FilterPayload = {
      ...initialState,
      skills: {
        skill_categories: [
          {
            category: 'cat1',
            skills: [
              { skill_id: 's1', skill_name: 'Skill One', skill_image: '/img1.png' },
              { skill_id: 's2', skill_name: 'Skill Two', skill_image: '/img2.png' },
            ],
          },
          {
            category: 'cat2',
            skills: [{ skill_id: 's3', skill_name: 'Skill Three', skill_image: '/img3.png' }],
          },
        ],
      },
    };

    const state = filterSideBarReducer(
      populatedState,
      removeSkillFilter({ category: 'cat1', skillId: 's1' })
    );
    expect(state.skills?.skill_categories).toEqual([
      {
        category: 'cat1',
        skills: [{ skill_id: 's2', skill_name: 'Skill Two', skill_image: '/img2.png' }],
      },
      {
        category: 'cat2',
        skills: [{ skill_id: 's3', skill_name: 'Skill Three', skill_image: '/img3.png' }],
      },
    ]);

    const state2 = filterSideBarReducer(
      state,
      removeSkillFilter({ category: 'cat1', skillId: 's2' })
    );
    expect(state2.skills?.skill_categories).toEqual([
      {
        category: 'cat2',
        skills: [{ skill_id: 's3', skill_name: 'Skill Three', skill_image: '/img3.png' }],
      },
    ]);
  });

  it('should handle removeCityFilter', () => {
    const populatedState: FilterPayload = { ...initialState, cities: ['Moscow', 'SPB'] };
    const state = filterSideBarReducer(populatedState, removeCityFilter('Moscow'));
    expect(state.cities).toEqual(['SPB']);
  });

  it('should handle removeGeneralFilter', () => {
    const populatedState: FilterPayload = { ...initialState, general: 'something' };
    const state = filterSideBarReducer(populatedState, removeGeneralFilter());
    expect(state.general).toBeNull();
  });

  it('should handle removeGenderFilter', () => {
    const populatedState: FilterPayload = { ...initialState, gender: 'male' };
    const state = filterSideBarReducer(populatedState, removeGenderFilter());
    expect(state.gender).toBeNull();
  });
});
