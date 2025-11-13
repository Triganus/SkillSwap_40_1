import { describe, it, expect, beforeEach, vi } from 'vitest';
import subcategoriesReducer, {
  fetchSubcategories,
  resetSubcategories,
} from '@/entities/directory/model/subcategoriesSlice';

global.fetch = vi.fn((url: string) => {
  if (url.includes('/subcategories')) {
    return Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve({
          subcategories: [
            { id: 'sub1', name: 'Skill1', categoryId: 'cat1' },
            { id: 'sub2', name: 'Skill2', categoryId: 'cat2' },
          ],
        }),
    } as Response);
  }
  return Promise.resolve({ ok: true, json: () => Promise.resolve({}) } as Response);
}) as unknown as typeof fetch;

describe('subcategoriesSlice', () => {
  let initialState: ReturnType<typeof subcategoriesReducer>;

  beforeEach(() => {
    initialState = {
      entities: {},
      ids: [],
      loading: false,
      error: null,
    };
  });

  it('should handle fetchSubcategories.pending', () => {
    const state = subcategoriesReducer(initialState, { type: fetchSubcategories.pending.type });
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle fetchSubcategories.fulfilled', () => {
    const payload = [
      { id: 'sub1', name: 'Skill1', categoryId: 'cat1' },
      { id: 'sub2', name: 'Skill2', categoryId: 'cat2' },
    ];

    const state = subcategoriesReducer(initialState, {
      type: fetchSubcategories.fulfilled.type,
      payload,
    });
    expect(state.loading).toBe(false);
    expect(state.ids).toEqual(['sub1', 'sub2']);
    expect(state.entities).toEqual({
      sub1: { id: 'sub1', name: 'Skill1', categoryId: 'cat1' },
      sub2: { id: 'sub2', name: 'Skill2', categoryId: 'cat2' },
    });
    expect(state.error).toBeNull();
  });

  it('should handle fetchSubcategories.rejected', () => {
    const state = subcategoriesReducer(initialState, {
      type: fetchSubcategories.rejected.type,
      payload: 'Failed to load subcategories',
    });
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Failed to load subcategories');
  });

  it('should reset subcategories', () => {
    const populatedState = {
      entities: { sub1: { id: 'sub1', name: 'Skill1', categoryId: 'cat1' } },
      ids: ['sub1'],
      loading: false,
      error: 'Some error',
    };

    const state = subcategoriesReducer(populatedState, resetSubcategories());
    expect(state.entities).toEqual({});
    expect(state.ids).toEqual([]);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });
});
