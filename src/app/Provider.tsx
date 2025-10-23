import { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { configureStore, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { Provider as ReduxProvider, useDispatch, useSelector } from 'react-redux';

export type AuthState = {
  isAuthenticated: boolean;
  user?: { id: string; name: string } | null;
};

export type AuthContextValue = {
  auth: AuthState;
  login: (user?: { id: string; name: string }) => void;
  logout: () => void;
};

const AUTH_STORAGE_KEY = 'app_auth_state';

function readAuthFromStorage(): AuthState {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (raw) return JSON.parse(raw) as AuthState;
  } catch (e) {
    console.warn('Failed to read auth state from storage', e);
  }
  return { isAuthenticated: false, user: null };
}

const authSlice = createSlice({
  name: 'auth',
  initialState: readAuthFromStorage() as AuthState,
  reducers: {
    login: (state, action: PayloadAction<{ id: string; name: string } | undefined>) => {
      state.isAuthenticated = true;
      state.user = action.payload ?? { id: '1', name: 'User' };
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
    },
  },
});

const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
  },
});

store.subscribe(() => {
  try {
    const state = store.getState() as RootState;
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(state.auth));
  } catch (e) {
    console.warn('Failed to write auth state to storage', e);
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextValue => {
  const auth = useSelector((s: RootState) => s.auth);
  const dispatch = useDispatch<AppDispatch>();
  return {
    auth,
    login: (user) => dispatch(authSlice.actions.login(user)),
    logout: () => dispatch(authSlice.actions.logout()),
  };
};

export function Provider({ children }: { children: ReactNode }) {
  return (
    <BrowserRouter>
      <ReduxProvider store={store}>{children}</ReduxProvider>
    </BrowserRouter>
  );
}
