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
  },
});

export const { setFilter, getFilter, resetFilter } = filterSideBarSlice.actions;

export const filterSideBarReducer = filterSideBarSlice.reducer;

export const getSideBarFilters = (state: { filterSideBar: FilterPayload }) => state.filterSideBar;
