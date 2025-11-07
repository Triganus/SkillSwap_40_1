import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { CategoriesState, Category } from './types';

const initialState: CategoriesState = {
  entities: {},
  ids: [],
  loading: false,
  error: null,
};

export const fetchCategories = createAsyncThunk<Category[], void, { rejectValue: string }>(
  'categories/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/directories/categories');

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      return data.categories as Category[];
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Ошибка загрузки категорий');
    }
  }
);

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    resetCategories: (state) => {
      state.entities = {};
      state.ids = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        const entities: Record<string, Category> = {};
        const ids: string[] = [];

        action.payload.forEach((category) => {
          entities[category.id] = category;
          ids.push(category.id);
        });

        state.entities = entities;
        state.ids = ids;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Неизвестная ошибка';
      });
  },
});

export const { resetCategories } = categoriesSlice.actions;
export default categoriesSlice.reducer;
