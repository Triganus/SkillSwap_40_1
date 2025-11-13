import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface NotificationPopup {
  id: string;
  icon?: React.ReactNode;
  title: string;
  message: string;
  buttonText?: string;
  onClose?: () => void;
}

export interface PopupState {
  activePopup: NotificationPopup | null;
}

const initialState: PopupState = {
  activePopup: null,
};

const popupSlice = createSlice({
  name: 'popup',
  initialState,
  reducers: {
    showPopup(state, action: PayloadAction<Omit<NotificationPopup, 'id'>>) {
      state.activePopup = {
        id: `popup_${Date.now()}`,
        ...action.payload,
      };
    },
    hidePopup(state) {
      state.activePopup = null;
    },
  },
});

export const { actions: popupActions, reducer: popupReducer } = popupSlice;
