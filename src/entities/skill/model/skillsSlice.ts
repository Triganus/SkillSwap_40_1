import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@app/store/store';
import { fetchSkills as fetchSkillsAPI } from '@/api/skills-api';
import type { Skill } from './types/types';
import type { SkillsState } from './types';

const initialState: SkillsState = {
  skills: [],
  popularSkills: [],
  newSkills: [],
  searchResults: [],
  searchQuery: '',
  loading: false,
  error: null,
};

/**
 * Асинхронный экшен для загрузки всех навыков с API
 */
export const fetchSkills = createAsyncThunk<Skill[], void, { rejectValue: string }>(
  'skills/fetchSkills',
  async (_, { rejectWithValue }) => {
    try {
      const skills = await fetchSkillsAPI();
      return skills;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch skills');
    }
  }
);

const skillsSlice = createSlice({
  name: 'skills',
  initialState,
  reducers: {
    /**
     * Обновляет поисковый запрос
     */
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },

    /**
     * Фильтрует навыки на основе текущего состояния
     * Обновляет popularSkills, newSkills, searchResults
     */
    filterSkills(state) {
      const query = state.searchQuery.toLowerCase().trim();

      // Если есть поисковый запрос, фильтруем по нему
      if (query) {
        state.searchResults = state.skills.filter(
          (skill) =>
            skill.title.toLowerCase().includes(query) ||
            skill.description.toLowerCase().includes(query) ||
            skill.category.toLowerCase().includes(query)
        );
      } else {
        state.searchResults = [];
      }

      // Популярные навыки (можно добавить логику на основе рейтинга, пока просто первые 10)
      state.popularSkills = [...state.skills].slice(0, 10);

      // Новые навыки (сортируем по дате создания)
      state.newSkills = [...state.skills]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 10);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSkills.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSkills.fulfilled, (state, action) => {
        state.loading = false;
        state.skills = action.payload;
        state.error = null;
        // Автоматически применяем фильтры после загрузки
        skillsSlice.caseReducers.filterSkills(state);
      })
      .addCase(fetchSkills.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Unknown error';
      });
  },
});

// Экспорт экшенов
export const { setSearchQuery, filterSkills } = skillsSlice.actions;

// Экспорт редюсера
export const { reducer: skillsReducer } = skillsSlice;

// Селекторы
export const getSkills = (state: RootState) => state.skills.skills;
export const getPopularSkills = (state: RootState) => state.skills.popularSkills;
export const getNewSkills = (state: RootState) => state.skills.newSkills;
export const getSearchResults = (state: RootState) => state.skills.searchResults;
export const getSearchQuery = (state: RootState) => state.skills.searchQuery;
export const getSkillsLoading = (state: RootState) => state.skills.loading;
export const getSkillsError = (state: RootState) => state.skills.error;
