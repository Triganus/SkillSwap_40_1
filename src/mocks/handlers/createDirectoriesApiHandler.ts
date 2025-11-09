import type { IRequestHandler } from '../types';
import { delay } from 'msw';

/**
 * Mock handler для API справочников (категории, подкатегории, города)
 */
export function createDirectoriesApiHandler(priority = 100): IRequestHandler {
  return {
    id: 'DirectoriesApiHandler',
    priority,
    canHandle(request) {
      const url = new URL(request.url);
      return url.pathname.startsWith('/api/directories/') && request.method.toUpperCase() === 'GET';
    },
    async handle(request) {
      const url = new URL(request.url);
      const path = url.pathname;

      await delay(300);

      // Категории
      if (path === '/api/directories/categories') {
        try {
          const response = await fetch('/db/categories.json');

          if (!response.ok) {
            throw new Error('Failed to load categories');
          }

          const data = await response.json();

          return Response.json(data, { status: 200 });
        } catch {
          return Response.json({ message: 'Ошибка загрузки категорий' }, { status: 500 });
        }
      }

      // Подкатегории
      if (path === '/api/directories/subcategories') {
        try {
          const response = await fetch('/db/subcategories.json');

          if (!response.ok) {
            throw new Error('Failed to load subcategories');
          }

          const data = await response.json();

          return Response.json(data, { status: 200 });
        } catch {
          return Response.json({ message: 'Ошибка загрузки подкатегорий' }, { status: 500 });
        }
      }

      // Города
      if (path === '/api/directories/cities') {
        try {
          const response = await fetch('/db/cities.json');

          if (!response.ok) {
            throw new Error('Failed to load cities');
          }

          const data = await response.json();

          return Response.json(data, { status: 200 });
        } catch {
          return Response.json({ message: 'Ошибка загрузки городов' }, { status: 500 });
        }
      }

      return Response.json({ message: 'Not Found' }, { status: 404 });
    },
  };
}
