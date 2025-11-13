import { describe, it, expect, beforeEach } from 'vitest';

import {
  setSearchQuery,
  filterSkills,
  fetchSkills,
} from '@/entities/skill/model/skillsSlice';
import { setUser, clearUser, fetchCurrentUser } from '@/entities/user/model/userSlice';
import { store, type RootState } from '@/app/store';
import { popupActions } from '@/app/store/popupSlice';

describe('Full Redux Store Integration', () => {
  let state: RootState;

  beforeEach(() => {
  store.dispatch({
    type: 'subcategories/fetchSubcategories/fulfilled',
    payload: [
      { id: 'sub1', name: 'Skill1', categoryId: 'cat1' },
      { id: 'sub2', name: 'Skill2', categoryId: 'cat2' },
    ],
  });
});

  it('should initialize with preloaded state', () => {
    state = store.getState();
    expect(state.auth).toBeDefined();
    expect(state.authV2).toBeDefined();
    expect(state.skills).toBeDefined();
    expect(state.popup.activePopup).toBeNull();
  });

  it('should handle popup actions', () => {
    const payload = { title: 'Hello', message: 'World' };
    store.dispatch(popupActions.showPopup(payload));

    state = store.getState();
    expect(state.popup.activePopup).toMatchObject({
      title: 'Hello',
      message: 'World',
    });

    store.dispatch(popupActions.hidePopup());
    state = store.getState();
    expect(state.popup.activePopup).toBeNull();
  });

  it('should handle skills search and filter', () => {
    store.dispatch({
      type: 'skills/fetchSkills/fulfilled',
      payload: [
        {
          id: '1',
          title: 'JavaScript',
          description: 'JS',
          type: 'learning',
          category: 'programming',
          authorId: 'a1',
          createdAt: '2023-01-01',
        },
        {
          id: '2',
          title: 'Python',
          description: 'Py',
          type: 'learning',
          category: 'programming',
          authorId: 'a2',
          createdAt: '2023-02-01',
        },
      ],
    });

    store.dispatch(setSearchQuery('python'));
    store.dispatch(filterSkills());

    state = store.getState();
    expect(state.skills.searchQuery).toBe('python');
    expect(state.skills.searchResults.length).toBe(1);
    expect(state.skills.searchResults[0].title).toBe('Python');
    expect(state.skills.popularSkills.length).toBe(2);
    expect(state.skills.newSkills[0].title).toBe('Python');
  });

  it('should handle fetchSkills asyncThunk correctly', async () => {
    await store.dispatch(fetchSkills());

    state = store.getState();
    expect(state.skills.loading).toBe(false);
    expect(Array.isArray(state.skills.skills)).toBe(true);
    expect(state.skills.skills.length).toBeGreaterThanOrEqual(2);
    expect(state.skills.popularSkills).toEqual(state.skills.skills.slice(0, 10));
    expect(state.skills.newSkills).toEqual(
      [...state.skills.skills]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 10)
    );
  });

  it('should handle rejected fetchSkills gracefully', async () => {
    store.dispatch({
      type: fetchSkills.rejected.type,
      payload: 'Failed to fetch',
    });

    state = store.getState();
    expect(state.skills.loading).toBe(false);
    expect(state.skills.error).toBe('Failed to fetch');
  });

  it('should handle user asyncThunk fetchCurrentUser correctly', async () => {
    await store.dispatch(fetchCurrentUser());

    state = store.getState();
    expect(state.user.loading).toBe(false);
    expect(state.user.data).toBeDefined();
    expect(state.user.isAuth).toBe(true);
    expect(state.user.isInit).toBe(true);
    expect(state.user.error).toBeNull();
  });

  it('should handle setUser and clearUser actions', () => {
    const mockUser = {
      id: 'user-1',
      name: 'Anna',
      email: 'anna@example.com',
      location: 'SPB',
      avatar_image: '/avatars/anna.jpg',
      gender: 'Female',
      about_me: '',
      my_skills: { teach: [], learn: [] },
      offers: { incoming: [], outgoing: [], archived: [] },
      date_of_registration: '2025-01-01',
    };

    store.dispatch(setUser(mockUser));
    state = store.getState();
    expect(state.user.data).toEqual(mockUser);
    expect(state.user.isAuth).toBe(true);
    expect(state.user.isInit).toBe(true);

    store.dispatch(clearUser());
    state = store.getState();
    expect(state.user.data).toBeNull();
    expect(state.user.isAuth).toBe(false);
    expect(state.user.isInit).toBe(true);
  });
});
