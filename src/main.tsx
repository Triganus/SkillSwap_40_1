import 'virtual:svg-icons/register';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './app/App.tsx';
import { Provider } from './app/Provider';
import { setTheme, THEME_LIGHT } from '@shared/lib';

setTheme(THEME_LIGHT);

async function enableMocking() {
  const isStorybook =
    typeof window !== 'undefined' &&
    (location.pathname === '/iframe.html' || location.pathname.startsWith('/storybook'));
  if (isStorybook) return;

  if (__ENABLE_MSW__) {
    try {
      console.time('msw:import');

      const { worker } = await import('./mocks/browser');

      console.timeEnd('msw:import');
      console.time('msw:start');

      await worker.start({
        onUnhandledRequest: 'bypass',
        serviceWorker: { url: '/mockServiceWorker.js' },
      });

      console.timeEnd('msw:start');
    } catch (e) {
      console.error('[MSW][bootstrap] dynamic import failed:', e);
    }
  }
}

enableMocking().finally(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <Provider>
        <App />
      </Provider>
    </StrictMode>
  );
});
