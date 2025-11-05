import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@shared/hooks/redux';
import { popupActions } from '../store/popupSlice';
import type { NotificationPopup } from '../store/popupSlice';

export function usePopup() {
  const dispatch = useAppDispatch();
  const activePopup = useAppSelector((state) => state.popup.activePopup);

  const showPopup = useCallback(
    (popup: Omit<NotificationPopup, 'id'>) => {
      dispatch(popupActions.showPopup(popup));
    },
    [dispatch]
  );

  const hidePopup = useCallback(() => {
    dispatch(popupActions.hidePopup());
  }, [dispatch]);

  return {
    activePopup,
    showPopup,
    hidePopup,
  } as const;
}

