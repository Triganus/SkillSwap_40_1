import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface UsersState {
  byId: Record<string, { id: string; name: string; email: string; avatar?: string }>; // упрощённо
  allIds: string[];
}

const initialState: UsersState = {
  byId: {},
  allIds: [],
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    upsertMany(state, action: PayloadAction<UsersState['byId']>) {
      for (const [id, user] of Object.entries(action.payload)) {
        state.byId[id] = user;

        if (!state.allIds.includes(id)) state.allIds.push(id);
      }
    },
    remove(state, action: PayloadAction<string>) {
      const id = action.payload;

      if (state.byId[id]) {
        delete state.byId[id];
        state.allIds = state.allIds.filter((i) => i !== id);
      }
    },
  },
});

export const { actions: usersActions, reducer: usersReducer } = userSlice;

import type { RootState } from '@app/Provider';
export const selectUsersState = (s: RootState) => s.users;
export const selectUserById = (id: string) => (s: RootState) => s.users.byId[id];

