import { describe, it, expect, beforeEach, vi } from 'vitest';
import { popupActions, popupReducer } from '../popupSlice';
import type { PopupState } from '../popupSlice';

describe('popupSlice', () => {
  const { showPopup, hidePopup } = popupActions;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return initial state', () => {
    const state: PopupState = popupReducer(undefined, { type: 'unknown' });
    expect(state.activePopup).toBeNull();
  });

  it('should handle showPopup (add popup)', () => {
    const payload = {
      title: 'Test Title',
      message: 'Test Message',
      icon: null,
      buttonText: 'OK',
      onClose: vi.fn(),
    };

    const action = showPopup(payload);
    const newState = popupReducer({ activePopup: null }, action);

    expect(newState.activePopup).toMatchObject({
      id: expect.any(String),
      title: 'Test Title',
      message: 'Test Message',
      icon: null,
      buttonText: 'OK',
      onClose: payload.onClose,
    });
    expect(newState.activePopup?.id).toMatch(/^popup_/);
  });

  it('should overwrite existing popup on showPopup', () => {
    const initialState: PopupState = {
      activePopup: { id: 'old_id', title: 'Old Title', message: 'Old Message' },
    };

    const payload = { title: 'New Title', message: 'New Message' };
    const action = showPopup(payload);
    const newState = popupReducer(initialState, action);

    expect(newState.activePopup).toMatchObject({
      id: expect.any(String),
      title: 'New Title',
      message: 'New Message',
    });
    expect(newState.activePopup?.id).not.toBe('old_id');
  });

  it('should handle hidePopup (remove popup)', () => {
    const initialState: PopupState = {
      activePopup: { id: 'test_id', title: 'Test', message: 'Message' },
    };

    const action = hidePopup();
    const newState = popupReducer(initialState, action);

    expect(newState.activePopup).toBeNull();
  });

  it('should handle hidePopup when no popup is active', () => {
    const initialState: PopupState = { activePopup: null };
    const action = hidePopup();
    const newState = popupReducer(initialState, action);

    expect(newState.activePopup).toBeNull();
  });

  it('should generate unique id for each showPopup', () => {
    const payload = { title: 'Test', message: 'Message' };

    vi.useFakeTimers();
    const action1 = showPopup(payload);
    const state1 = popupReducer({ activePopup: null }, action1);

    vi.advanceTimersByTime(1);
    const action2 = showPopup(payload);
    const state2 = popupReducer(state1, action2);
    vi.useRealTimers();

    expect(state1.activePopup?.id).not.toBe(state2.activePopup?.id);
  });

  it('should ignore unknown actions', () => {
    const initialState: PopupState = {
      activePopup: { id: 'test_id', title: 'Test', message: 'Message' },
    };
    const newState = popupReducer(initialState, { type: 'unknown/action' });

    expect(newState).toEqual(initialState);
  });
});
