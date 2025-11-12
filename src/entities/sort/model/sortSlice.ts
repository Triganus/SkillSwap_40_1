import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type SortOrder = 'newest' | 'oldest';

interface SortState {
  order: SortOrder;
}

const initialState: SortState = {
  order: 'newest',
};

const sortSlice = createSlice({
  name: 'sort',
  initialState,
  reducers: {
    setSortOrder: (state, action: PayloadAction<SortOrder>) => {
      state.order = action.payload;
    },
  },
});

export const { setSortOrder } = sortSlice.actions;
export default sortSlice.reducer;
