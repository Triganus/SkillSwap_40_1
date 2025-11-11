import type { RootState } from '@/app/store';
import type { SkillCardProps } from '@/widgets/Cards/SkillCard';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

interface FavoritesState {
  cards: SkillCardProps[];
  loading: boolean;
  error: string | null;
}

const initialState: FavoritesState = {
  cards: [],
  loading: false,
  error: null,
};

export const loadFavorites = createAsyncThunk<
  SkillCardProps[],
  void,
  { rejectValue: string; state: RootState }
>('favorites/loadFavorites', async (_, { rejectWithValue }) => {
  try {
    // Загрузка избранного будет происходить через селекторы
    return [];
  } catch (error: unknown) {
    // используем 'unknown' вместо 'any'
    // Проверяем, является ли error объектом с полем message
    const errorMessage = error instanceof Error ? error.message : 'Failed to load favorites';
    return rejectWithValue(errorMessage);
  }
});

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addFavorite: (state, action) => {
      const exists = state.cards.some((card) => card.user.id === action.payload.user.id);
      if (!exists) {
        state.cards.push(action.payload);
      }
    },

    removeFavorite: (state, action) => {
      state.cards = state.cards.filter((card) => card.user.id !== action.payload);
    },

    setFavorites: (state, action) => {
      state.cards = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadFavorites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadFavorites.fulfilled, (state, action) => {
        state.loading = false;
        state.cards = action.payload;
      })
      .addCase(loadFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to load favorites';
      });
  },
});

export const { addFavorite, removeFavorite, setFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;
