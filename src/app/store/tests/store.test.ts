import { describe, it, expect, beforeEach, vi } from 'vitest';
import { store } from '../index';
import { popupActions } from '../popupSlice';
import { setSearchQuery, filterSkills, fetchSkills } from '@/entities/skill/model/skillsSlice';
import { setSortOrder } from '@/entities/sort/model/sortSlice';
import { fetchSubcategories, resetSubcategories } from '@/entities/directory/model/subcategoriesSlice';
import { setUser, clearUser } from '@/entities/user/model/userSlice';
import type { DbUser } from '@/entities/user/model/types/types';

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
  return Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
  } as Response);
}) as unknown as typeof fetch;

describe('Full Redux Store Integration', () => {
  beforeEach(() => {
    store.dispatch({ type: 'RESET' } as any);
    store.dispatch(resetSubcategories());
  });

  it('should handle popup actions', () => {
    const payload = { title: 'Hello', message: 'World' };
    store.dispatch(popupActions.showPopup(payload));

    let state = store.getState();
    expect(state.popup.activePopup).toMatchObject(payload);

    store.dispatch(popupActions.hidePopup());
    state = store.getState();
    expect(state.popup.activePopup).toBeNull();
  });

  it('should handle sortSlice actions', () => {
    store.dispatch(setSortOrder('oldest'));
    let state = store.getState();
    expect(state.sort.order).toBe('oldest');

    store.dispatch(setSortOrder('newest'));
    state = store.getState();
    expect(state.sort.order).toBe('newest');
  });

  it('should handle userSlice actions', () => {
    const mockUser: DbUser = {
      id: 'user-1',
      name: 'Анна Петрова',
      email: 'anna@example.com',
      location: 'Санкт-Петербург',
      avatar_image: '/avatars/anna.jpg',
      gender: 'Женский',
      about_me: 'Учусь обмениваться навыками',
      my_skills: {
        teach: [{ skill_id: 'drums', skill_description: 'Игра на барабанах' }],
        learn: [{ skill_id: 'english', skill_description: 'Английский язык' }],
      },
      offers: { incoming: [], outgoing: [], archived: [] },
      date_of_registration: '2025-01-01',
    };

    store.dispatch(setUser(mockUser));
    let state = store.getState();
    expect(state.user.data).toEqual(mockUser);
    expect(state.user.isAuth).toBe(true);

    store.dispatch(clearUser());
    state = store.getState();
    expect(state.user.data).toBeNull();
    expect(state.user.isAuth).toBe(false);
  });

  it('should handle fetchSkills with subcategories', async () => {
    await store.dispatch(fetchSubcategories());
    let state = store.getState();
    expect(state.subcategories.ids.length).toBeGreaterThanOrEqual(2);

    await store.dispatch(fetchSkills());

    state = store.getState();
    expect(state.skills.loading).toBe(false);
    expect(Array.isArray(state.skills.skills)).toBe(true);
    expect(state.skills.skills.length).toBeGreaterThanOrEqual(2);

    store.dispatch(setSearchQuery('Skill1'));
    store.dispatch(filterSkills());
    state = store.getState();
    expect(state.skills.searchResults.length).toBe(1);
    expect(state.skills.searchResults[0].title).toBe('Skill1');

    expect(state.skills.popularSkills).toEqual(state.skills.skills.slice(0, 10));
    expect(state.skills.newSkills).toEqual(
      [...state.skills.skills].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ).slice(0, 10)
    );
  });
});
