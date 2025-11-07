import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { CitiesState, City } from './types';

const initialState: CitiesState = {
  entities: {},
  ids: [],
  loading: false,
  error: null,
};

export const fetchCities = createAsyncThunk<City[], void, { rejectValue: string }>(
  'cities/fetchCities',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/directories/cities');

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      return data.cities as City[];
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Ошибка загрузки городов');
    }
  }
);

const citiesSlice = createSlice({
  name: 'cities',
  initialState,
  reducers: {
    resetCities: (state) => {
      state.entities = {};
      state.ids = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCities.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        const entities: Record<string, City> = {};
        const ids: string[] = [];

        action.payload.forEach((city) => {
          entities[city.id] = city;
          ids.push(city.id);
        });

        state.entities = entities;
        state.ids = ids;
      })
      .addCase(fetchCities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Неизвестная ошибка';
      });
  },
});

export const { resetCities } = citiesSlice.actions;
export default citiesSlice.reducer;
