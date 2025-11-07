import type { Preview } from '@storybook/react';
import '@/index.css';
import '@shared/config/storybook/setupSvgSprite';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from '@features/auth/model/authSlice';
import { usersReducer } from '@/entities/user/model/usersSlice';
import { skillsReducer } from '@entities/skill/model';
import { filterSideBarReducer } from '@/entities/filterSideBar/model/filterSideBarSlice';
import { popupReducer } from '@/app/store/popupSlice';
import userReducer from '@/entities/user/model/userSlice';
import notificationsReducer from '@/features/notifications/model/notificationsSlice';
import { authReducerV2, usersReducerV2 } from '@/entities/user/model-v2';
import {
  categoriesReducer,
  subcategoriesReducer,
  citiesReducer,
} from '@/entities/directory/model';

// Инициализация MSW для Storybook
if (typeof window !== 'undefined') {
  import('../src/mocks/browser').then(({ worker }) => {
    worker.start({
      onUnhandledRequest: 'bypass',
      serviceWorker: { url: '/mockServiceWorker.js' },
    });
  });
}

// Создаём store для Storybook
const createStorybookStore = () => configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    user: userReducer,
    authV2: authReducerV2,
    usersV2: usersReducerV2,
    skills: skillsReducer,
    filterSideBar: filterSideBarReducer,
    notifications: notificationsReducer,
    popup: popupReducer,
    categories: categoriesReducer,
    subcategories: subcategoriesReducer,
    cities: citiesReducer,
  },
  middleware: (getDefault) => getDefault({ serializableCheck: false }),
});

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => {
      const store = createStorybookStore();
      return (
        <Provider store={store}>
          <Story />
        </Provider>
      );
    },
    (Story, context) => (
      <MemoryRouter initialEntries={context?.parameters?.router?.initialEntries ?? ['/']}>
        <Story />
      </MemoryRouter>
    ),
  ],
};

export default preview;