import type { FilterPayload } from './types/types';
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

const FilterPayloadInitialState: FilterPayload = {
  general: null,
  gender: null,
  skills: null,
  cities: [],
  filtersApplied: false,
};

const filterSideBarSlice = createSlice({
  name: 'filterSideBar',
  initialState: FilterPayloadInitialState,
  reducers: {
    setFilter(state, action: PayloadAction<FilterPayload>) {
      return { ...state, ...action.payload };
    },
    getFilter(state) {
      return state;
    },
    resetFilter() {
      return FilterPayloadInitialState;
    },
    removeSkillFilter(state, action: PayloadAction<{ category: string; skillId: string }>) {
      if (!state.skills?.skill_categories) return;

      state.skills.skill_categories = state.skills.skill_categories
        .map((cat) => {
          const categoryKey = cat.categoryId || cat.category;

          if (categoryKey === action.payload.category) {
            return {
              ...cat,
              skills: cat.skills.filter((skill) => skill.skill_id !== action.payload.skillId),
            };
          }

          return cat;
        })
        .filter((cat) => cat.skills.length > 0);

      if (state.skills.skill_categories.length === 0) {
        state.skills = null;
      }
    },
    removeCityFilter(state, action: PayloadAction<string>) {
      state.cities = state.cities.filter((city) => city !== action.payload);
    },
    removeGeneralFilter(state) {
      state.general = null;
    },
    removeGenderFilter(state) {
      state.gender = null;
    },
  },
});

export const {
  setFilter,
  getFilter,
  resetFilter,
  removeSkillFilter,
  removeCityFilter,
  removeGeneralFilter,
  removeGenderFilter,
} = filterSideBarSlice.actions;

export const filterSideBarReducer = filterSideBarSlice.reducer;

export const getSideBarFilters = (state: { filterSideBar: FilterPayload }) => state.filterSideBar;
