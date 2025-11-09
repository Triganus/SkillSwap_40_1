import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface SectionPageState {
  items: string[]; // массив ID UserListItem
  isLoading: boolean;
  page?: number; // только для секций с пагинацией
  limit?: number;
  hasMore?: boolean;
}

export interface PaginationState {
  popular: SectionPageState; // max 3
  new: SectionPageState; // max 3
  recommended: SectionPageState; // пагинация 9
  filtered: SectionPageState; // пагинация 9
}

const initialState: PaginationState = {
  popular: { items: [], isLoading: false },
  new: { items: [], isLoading: false },
  recommended: { items: [], isLoading: false, page: 1, limit: 9, hasMore: true },
  filtered: { items: [], isLoading: false, page: 1, limit: 9, hasMore: false },
};

export const paginationSlice = createSlice({
  name: 'pagination',
  initialState,
  reducers: {
    setPopular(state, action: PayloadAction<string[]>) {
      state.popular.items = action.payload.slice(0, 3);
    },
    setPopularLoading(state, action: PayloadAction<boolean>) {
      state.popular.isLoading = action.payload;
    },
    setNew(state, action: PayloadAction<string[]>) {
      state.new.items = action.payload.slice(0, 3);
    },
    setNewLoading(state, action: PayloadAction<boolean>) {
      state.new.isLoading = action.payload;
    },
    appendRecommended(state, action: PayloadAction<{ ids: string[]; hasMore: boolean }>) {
      state.recommended.items.push(...action.payload.ids);
      state.recommended.hasMore = action.payload.hasMore;
      state.recommended.page = (state.recommended.page || 1) + 1;
    },
    resetRecommended(state) {
      state.recommended.items = [];
      state.recommended.page = 1;
      state.recommended.hasMore = true;
    },
    setRecommendedLoading(state, action: PayloadAction<boolean>) {
      state.recommended.isLoading = action.payload;
    },
    setFiltered(
      state,
      action: PayloadAction<{ ids: string[]; hasMore: boolean; replace?: boolean }>
    ) {
      if (action.payload.replace) {
        state.filtered.items = action.payload.ids;
        state.filtered.page = 1;
      } else {
        state.filtered.items.push(...action.payload.ids);
        state.filtered.page = (state.filtered.page || 1) + 1;
      }
      state.filtered.hasMore = action.payload.hasMore;
    },
    resetFiltered(state) {
      state.filtered.items = [];
      state.filtered.page = 1;
      state.filtered.hasMore = false;
    },
    setFilteredLoading(state, action: PayloadAction<boolean>) {
      state.filtered.isLoading = action.payload;
    },
  },
});

export const {
  setPopular,
  setPopularLoading,
  setNew,
  setNewLoading,
  appendRecommended,
  resetRecommended,
  setRecommendedLoading,
  setFiltered,
  resetFiltered,
  setFilteredLoading,
} = paginationSlice.actions;

export const paginationReducer = paginationSlice.reducer;

// Селекторы
export const selectPaginationState = (state: { pagination: PaginationState }) => state.pagination;
export const selectPopularIds = (state: { pagination: PaginationState }) =>
  state.pagination.popular.items;
export const selectNewIds = (state: { pagination: PaginationState }) => state.pagination.new.items;
export const selectRecommendedIds = (state: { pagination: PaginationState }) =>
  state.pagination.recommended.items;
export const selectFilteredIds = (state: { pagination: PaginationState }) =>
  state.pagination.filtered.items;
export const selectRecommendedHasMore = (state: { pagination: PaginationState }) =>
  state.pagination.recommended.hasMore;
export const selectFilteredHasMore = (state: { pagination: PaginationState }) =>
  state.pagination.filtered.hasMore;
