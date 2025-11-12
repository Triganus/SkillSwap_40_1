import type { RootState } from '@/app/store';

export const selectSortOrder = (state: RootState) => state.sort.order;
