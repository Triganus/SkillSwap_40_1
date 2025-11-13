import { describe, it, expect, beforeEach } from 'vitest';
import sortReducer, { setSortOrder, type SortOrder } from '../sortSlice';

describe('sortSlice', () => {
  let initialState: { order: SortOrder };

  beforeEach(() => {
    initialState = { order: 'newest' };
  });

  it('should return the initial state', () => {
    const state = sortReducer(undefined, { type: 'unknown' });
    expect(state).toEqual(initialState);
  });

  it('should handle setSortOrder to "oldest"', () => {
    const action = setSortOrder('oldest');
    const state = sortReducer(initialState, action);
    expect(state.order).toBe('oldest');
  });

  it('should handle setSortOrder to "newest"', () => {
    const stateBefore: { order: SortOrder } = { order: 'oldest' };
    const action = setSortOrder('newest');
    const state = sortReducer(stateBefore, action);
    expect(state.order).toBe('newest');
  });

  it('should ignore unknown actions', () => {
    const state = sortReducer(initialState, { type: 'unknown/action' });
    expect(state).toEqual(initialState);
  });
});
