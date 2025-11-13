import { describe, it, expect, beforeEach, vi } from 'vitest';
import citiesReducer, { fetchCities, resetCities } from '@/entities/directory/model/citiesSlice';
import { store } from '@/app/store';

global.fetch = vi.fn((url: string) => {
  if (url.includes('/cities')) {
    return Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve({
          cities: [
            { id: 'city1', name: 'Moscow', region: 'Moscow', population: 12000000 },
            { id: 'city2', name: 'Saint Petersburg', region: 'Leningrad', population: 5500000 },
          ],
        }),
    } as Response);
  }
  return Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
  } as Response);
}) as unknown as typeof fetch;

describe('citiesSlice integration', () => {
  beforeEach(() => {
    store.dispatch({ type: 'RESET' } as any);
    store.dispatch(resetCities());
  });

  it('should load cities via fetchCities', async () => {
    await store.dispatch(fetchCities());

    const state = store.getState().cities;

    expect(state.loading).toBe(false);
    expect(Array.isArray(state.ids)).toBe(true);
    expect(state.ids.length).toBeGreaterThanOrEqual(2);

    expect(state.entities['city1']).toMatchObject({ id: 'city1', name: 'Moscow', region: 'Moscow', population: 12000000 });
    expect(state.entities['city2']).toMatchObject({ id: 'city2', name: 'Saint Petersburg', region: 'Leningrad', population: 5500000 });
    expect(state.error).toBeNull();
  });

  it('should set loading state during fetchCities.pending', () => {
    const state = citiesReducer(undefined, { type: fetchCities.pending.type });
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle fetchCities.rejected', () => {
    const state = citiesReducer(undefined, {
      type: fetchCities.rejected.type,
      payload: 'Failed to load cities',
    });
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Failed to load cities');
  });

  it('should reset cities', () => {
    const populatedState = {
      ids: ['city1', 'city2'],
      entities: {
        city1: { id: 'city1', name: 'Moscow', region: 'Moscow', population: 12000000 },
        city2: { id: 'city2', name: 'Saint Petersburg', region: 'Leningrad', population: 5500000 },
      },
      loading: false,
      error: null,
    };

    const state = citiesReducer(populatedState, resetCities());
    expect(state.ids).toEqual([]);
    expect(state.entities).toEqual({});
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });
});
