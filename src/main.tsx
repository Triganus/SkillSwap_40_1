import 'virtual:svg-icons/register';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './app/App.tsx';
import { Provider } from './app/Provider';
import { setTheme, THEME_LIGHT } from './shared/lib/theme';

setTheme(THEME_LIGHT);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider>
      <App />
    </Provider>
  </StrictMode>
);
