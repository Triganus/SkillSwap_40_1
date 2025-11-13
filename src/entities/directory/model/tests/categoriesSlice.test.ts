import { describe, it, expect, beforeEach, vi } from 'vitest';
import categoriesReducer, { fetchCategories, resetCategories } from '@/entities/directory/model/categoriesSlice';
import { store } from '@/app/store';

global.fetch = vi.fn((url: string) => {
  if (url.includes('/categories')) {
    return Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve({
          categories: [
            { id: 'cat1', name: 'Category1' },
            { id: 'cat2', name: 'Category2' },
          ],
        }),
    } as Response);
  }
  return Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
  } as Response);
}) as unknown as typeof fetch;

describe('categoriesSlice integration', () => {
  beforeEach(() => {
    store.dispatch({ type: 'RESET' } as any);
    store.dispatch(resetCategories());
  });

  it('should load categories via fetchCategories', async () => {
    await store.dispatch(fetchCategories());

    const state = store.getState().categories;

    expect(state.loading).toBe(false);
    expect(Array.isArray(state.ids)).toBe(true);
    expect(state.ids.length).toBeGreaterThanOrEqual(2);

    expect(state.entities['cat1']).toMatchObject({ id: 'cat1', name: 'Category1' });
    expect(state.entities['cat2']).toMatchObject({ id: 'cat2', name: 'Category2' });
    expect(state.error).toBeNull();
  });

  it('should set loading state during fetchCategories.pending', () => {
    const state = categoriesReducer(undefined, { type: fetchCategories.pending.type });
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle fetchCategories.rejected', () => {
    const state = categoriesReducer(undefined, {
      type: fetchCategories.rejected.type,
      payload: 'Failed to load categories',
    });
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Failed to load categories');
  });

  it('should reset categories', () => {
    const populatedState = {
  ids: ['cat1', 'cat2'],
  entities: {
    cat1: { id: 'cat1', name: 'Category1', order: 1, subcategoryIds: [] },
    cat2: { id: 'cat2', name: 'Category2', order: 2, subcategoryIds: [] },
  },
  loading: false,
  error: null,
};
    const state = categoriesReducer(populatedState, resetCategories());
    expect(state.ids).toEqual([]);
    expect(state.entities).toEqual({});
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });
});
