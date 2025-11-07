import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Gender, GendersState } from './types';

const initialState: GendersState = {
  entities: {},
  ids: [],
  loading: false,
  error: null,
};

/**
 * Загрузка полов из API
 */
export const fetchGenders = createAsyncThunk('directories/fetchGenders', async () => {
  const response = await fetch('/db/genders.json');

  if (!response.ok) {
    throw new Error('Failed to fetch genders');
  }

  const data = await response.json();

  return data.genders as Gender[];
});

/**
 * Slice для управления справочником полов
 */
const gendersSlice = createSlice({
  name: 'genders',
  initialState,
  reducers: {
    setGenders: (state, action: PayloadAction<Gender[]>) => {
      state.entities = {};
      state.ids = [];
      action.payload.forEach((gender) => {
        state.entities[gender.id] = gender;
        state.ids.push(gender.id);
      });
    },
    clearGenders: (state) => {
      state.entities = {};
      state.ids = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGenders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGenders.fulfilled, (state, action) => {
        state.loading = false;
        state.entities = {};
        state.ids = [];
        action.payload.forEach((gender) => {
          state.entities[gender.id] = gender;
          state.ids.push(gender.id);
        });
      })
      .addCase(fetchGenders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load genders';
      });
  },
});

export const { setGenders, clearGenders } = gendersSlice.actions;
export const gendersReducer = gendersSlice.reducer;
