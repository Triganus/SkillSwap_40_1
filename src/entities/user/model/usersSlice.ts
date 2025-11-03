import { createSlice } from '@reduxjs/toolkit';
import type { DbUser } from './types/types';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@app/Provider';

// Состояние: справочник всех пользователей
export interface UsersState {
  byId: Record<string, DbUser>;
  allIds: string[];
}

const initialState: UsersState = {
  byId: {},
  allIds: [],
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    // Добавить или обновить нескольких пользователей
    upsertMany(state, action: PayloadAction<Record<string, DbUser>>) {
      for (const [id, user] of Object.entries(action.payload)) {
        state.byId[id] = user;

        if (!state.allIds.includes(id)) state.allIds.push(id);
      }
    },

    // Удалить пользователя
    remove(state, action: PayloadAction<string>) {
      const id = action.payload;

      if (state.byId[id]) {
        delete state.byId[id];
        state.allIds = state.allIds.filter((i) => i !== id);
      }
    },

    // Очистить весь справочник (например, при выходе)
    clearAll(state) {
      state.byId = {};
      state.allIds = [];
    },
  },
});

export const { actions: usersActions, reducer: usersReducer } = usersSlice;

export const selectUsersState = (s: RootState) => s.users;
export const selectUserById = (id: string) => (s: RootState) => s.users.byId[id];
export const selectAllUsers = (state: RootState) =>
  state.users.allIds.map((id) => state.users.byId[id]);

export default usersSlice.reducer;
