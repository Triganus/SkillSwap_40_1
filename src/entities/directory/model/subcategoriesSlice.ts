import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { SubcategoriesState, Subcategory } from './types';

const initialState: SubcategoriesState = {
  entities: {},
  ids: [],
  loading: false,
  error: null,
};

export const fetchSubcategories = createAsyncThunk<Subcategory[], void, { rejectValue: string }>(
  'subcategories/fetchSubcategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/directories/subcategories');

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      return data.subcategories as Subcategory[];
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Ошибка загрузки подкатегорий'
      );
    }
  }
);

const subcategoriesSlice = createSlice({
  name: 'subcategories',
  initialState,
  reducers: {
    resetSubcategories: (state) => {
      state.entities = {};
      state.ids = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubcategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubcategories.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        const entities: Record<string, Subcategory> = {};
        const ids: string[] = [];

        action.payload.forEach((subcategory) => {
          entities[subcategory.id] = subcategory;
          ids.push(subcategory.id);
        });

        state.entities = entities;
        state.ids = ids;
      })
      .addCase(fetchSubcategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Неизвестная ошибка';
      });
  },
});

export const { resetSubcategories } = subcategoriesSlice.actions;
export default subcategoriesSlice.reducer;
