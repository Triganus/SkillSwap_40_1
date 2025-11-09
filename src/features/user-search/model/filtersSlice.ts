import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type SearchType = 'all' | 'want_to_learn' | 'can_teach';
export type GenderFilter = 'all' | 'male' | 'female';
export type SortBy = 'newest' | 'oldest';

export interface FiltersState {
  searchQuery: string;
  searchType: SearchType; // управляется общим радиокнопочным фильтром
  selectedCategoryIds: string[];
  selectedSubcategoryIds: string[];
  selectedGender: GenderFilter; // преобразованное значение из UI
  selectedCities: string[];
  sortBy: SortBy;
  isActive: boolean; // наличие каких-либо применённых фильтров или поискового запроса
}

const initialState: FiltersState = {
  searchQuery: '',
  searchType: 'all',
  selectedCategoryIds: [],
  selectedSubcategoryIds: [],
  selectedGender: 'all',
  selectedCities: [],
  sortBy: 'newest',
  isActive: false,
};

function computeIsActive(state: FiltersState): boolean {
  return (
    !!state.searchQuery.trim() ||
    state.searchType !== 'all' ||
    state.selectedCategoryIds.length > 0 ||
    state.selectedSubcategoryIds.length > 0 ||
    state.selectedGender !== 'all' ||
    state.selectedCities.length > 0 ||
    state.sortBy !== 'newest'
  );
}

export const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
      state.isActive = computeIsActive(state);
    },
    setSearchType(state, action: PayloadAction<SearchType>) {
      state.searchType = action.payload;
      state.isActive = computeIsActive(state);
    },
    setSelectedCategories(state, action: PayloadAction<string[]>) {
      state.selectedCategoryIds = action.payload;
      state.isActive = computeIsActive(state);
    },
    setSelectedSubcategories(state, action: PayloadAction<string[]>) {
      state.selectedSubcategoryIds = action.payload;
      state.isActive = computeIsActive(state);
    },
    setSelectedGender(state, action: PayloadAction<GenderFilter>) {
      state.selectedGender = action.payload;
      state.isActive = computeIsActive(state);
    },
    setSelectedCities(state, action: PayloadAction<string[]>) {
      state.selectedCities = action.payload;
      state.isActive = computeIsActive(state);
    },
    setSortBy(state, action: PayloadAction<SortBy>) {
      state.sortBy = action.payload;
      state.isActive = computeIsActive(state);
    },
    resetFilters() {
      return initialState;
    },
    // Групповая установка из одного объекта (унифицированный вход для HomePage)
    applyFilters(state, action: PayloadAction<Partial<FiltersState>>) {
      Object.assign(state, action.payload);
      state.isActive = computeIsActive(state);
    },
  },
});

export const {
  setSearchQuery,
  setSearchType,
  setSelectedCategories,
  setSelectedSubcategories,
  setSelectedGender,
  setSelectedCities,
  setSortBy,
  resetFilters,
  applyFilters,
} = filtersSlice.actions;

export const filtersReducer = filtersSlice.reducer;

// Селекторы
export const selectFiltersState = (state: { filters: FiltersState }) => state.filters;
export const selectSearchType = (state: { filters: FiltersState }) => state.filters.searchType;
export const selectSearchQuery = (state: { filters: FiltersState }) => state.filters.searchQuery;
export const selectSelectedCategoryIds = (state: { filters: FiltersState }) =>
  state.filters.selectedCategoryIds;
export const selectSelectedSubcategoryIds = (state: { filters: FiltersState }) =>
  state.filters.selectedSubcategoryIds;
export const selectSelectedGender = (state: { filters: FiltersState }) =>
  state.filters.selectedGender;
export const selectSelectedCities = (state: { filters: FiltersState }) =>
  state.filters.selectedCities;
export const selectSortBy = (state: { filters: FiltersState }) => state.filters.sortBy;
export const selectIsActive = (state: { filters: FiltersState }) => state.filters.isActive;
