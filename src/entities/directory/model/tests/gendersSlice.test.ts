import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  gendersReducer,
  fetchGenders,
  setGenders,
  clearGenders,
} from '@/entities/directory/model/gendersSlice';

global.fetch = vi.fn((url: string) => {
  if (url.includes('/genders.json')) {
    return Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve({
          genders: [
            { id: 'male', name: 'Мужской' },
            { id: 'female', name: 'Женский' },
          ],
        }),
    } as Response);
  }
  return Promise.resolve({ ok: true, json: () => Promise.resolve({}) } as Response);
}) as unknown as typeof fetch;

describe('gendersSlice', () => {
  let initialState: ReturnType<typeof gendersReducer>;

  beforeEach(() => {
    initialState = {
      entities: {},
      ids: [],
      loading: false,
      error: null,
    };
  });

  it('should handle fetchGenders.pending', () => {
    const state = gendersReducer(initialState, { type: fetchGenders.pending.type });
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle fetchGenders.fulfilled', () => {
    const payload = [
      { id: 'male', name: 'Мужской' },
      { id: 'female', name: 'Женский' },
    ];
    const state = gendersReducer(initialState, { type: fetchGenders.fulfilled.type, payload });
    expect(state.loading).toBe(false);
    expect(state.ids).toEqual(['male', 'female']);
    expect(state.entities).toEqual({
      male: { id: 'male', name: 'Мужской' },
      female: { id: 'female', name: 'Женский' },
    });
    expect(state.error).toBeNull();
  });

  it('should handle fetchGenders.rejected', () => {
    const state = gendersReducer(initialState, {
      type: fetchGenders.rejected.type,
      error: { message: 'Failed to load genders' },
    });
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Failed to load genders');
  });

  it('should handle setGenders', () => {
    const payload = [
      { id: 'male', name: 'Мужской' },
      { id: 'female', name: 'Женский' },
    ];
    const state = gendersReducer(initialState, setGenders(payload));
    expect(state.ids).toEqual(['male', 'female']);
    expect(state.entities).toEqual({
      male: { id: 'male', name: 'Мужской' },
      female: { id: 'female', name: 'Женский' },
    });
  });

  it('should handle clearGenders', () => {
    const populatedState = {
      entities: { male: { id: 'male', name: 'Мужской' } },
      ids: ['male'],
      loading: false,
      error: 'Some error',
    };
    const state = gendersReducer(populatedState, clearGenders());
    expect(state.entities).toEqual({});
    expect(state.ids).toEqual([]);
    expect(state.error).toBeNull();
  });
});
