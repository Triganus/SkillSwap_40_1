# SkillSwap — Платформа обмена навыками

> MVP-проект: «Я научу / Хочу научиться»

## Установка зависимостей
При первом запуске выполните команду npm install.

## Запуск Dev-сервера
Выполните команду npm run dev.

## Линтинг
Для запуска ESLint выполните команду npm run lint.

# Архитектура
Проект использует Feature-Sliced Design. Подробнее — см. ARCHITECTURE.md.

📁 Структура

src/
├── app/          # инициализация
├── entities/     # типы данных
├── features/     # бизнес-логика
├── widgets/      # UI-блоки
├── pages/        # страницы
└── shared/       # общие компоненты и хуки

🧪 Тесты
Планируется: Jest + React Testing Library (покрытие ≥70%).




## MSW (Mock Service Worker)

Система мокирования API реализована через MSW с архитектурой Chain of Responsibility на основе функциональных фабрик (без классов). Обработчик — это простой объект с методами `canHandle` и `handle`, создаваемый фабричной функцией. Оркестратор также создаётся фабрикой и управляет порядком обработки по приоритетам.

- Переключатель через переменную окружения: `VITE_ENABLE_MSW` (`true`/`false`).
- Прод‑tree‑shaking: флаг `__ENABLE_MSW__` задаётся в `vite.config.ts` через `define`, что позволяет полностью исключить MSW‑код из прод‑сборки при `VITE_ENABLE_MSW=false`.
- В проекте должен существовать файл `public/mockServiceWorker.js`. Если его нет — выполните `npx msw init public --save`.

### Как включить локально

1. Скопируйте `.env.example` в `.env` и установите:
   ```bash
   VITE_ENABLE_MSW=true
   ```
2. Запустите dev‑сервер:
   ```bash
   npm run dev
   ```
3. Приложение динамически импортирует воркер и стартует его:
   ```ts
   // src/main.tsx (фрагмент)
   if (__ENABLE_MSW__) {
     try {
       const { worker } = await import('./mocks/browser');
       await worker.start({
         onUnhandledRequest: 'bypass',
         serviceWorker: { url: '/mockServiceWorker.js' },
       });
     } catch (e) {
       console.error('[MSW][bootstrap] dynamic import failed:', e);
     }
   }
   ```
   Примечание: воркер перехватывает только `/api/*` маршруты, остальные запросы (страницы/ассеты) идут в обход.

### Структура (фабричный подход)

```
src/
└── mocks/
    ├── browser.ts                              # Инициализация MSW worker + делегирование в оркестратор
    ├── types.ts                                # Интерфейсы IRequestHandler, IRequestOrchestrator, Logger
    ├── orchestrator/
    │   └── createRequestOrchestrator.ts        # Фабрика оркестратора (Chain of Responsibility)
    └── handlers/
        ├── createAuthApiHandler.ts             # Пример фабрики обработчика (login)
        └── index.ts                            # Регистрация всех обработчиков
```

### Интерфейсы и контракт

Обработчик — простой объект, возвращённый фабрикой:
```ts
export interface IRequestHandler {
  id: string;
  priority?: number; // чем выше — тем раньше проверяется
  canHandle(request: Request): boolean | Promise<boolean>;
  handle(request: Request): Promise<Response>;
}

export interface IRequestOrchestrator {
  registerHandler(handler: IRequestHandler): void;
  reset(): void;
  handleRequest(request: Request): Promise<Response | undefined>; // undefined => bypass реальному API
  getHandlers(): readonly IRequestHandler[];
}
```
Оркестратор, созданный через `createRequestOrchestrator(logger?)`, поддерживает регистрацию обработчиков, хранит их по убыванию `priority` и вызывает первый подходящий.

### Делегирование воркеру

Воркер настраивается перехватывать только API‑маршруты и делегирует обработку оркестратору. Не‑API запросы всегда обходятся (passthrough):
```ts
// src/mocks/browser.ts (фрагмент)
export const worker = setupWorker(
  http.get('/api/*', delegate),
  http.post('/api/*', delegate),
  http.put('/api/*', delegate),
  http.patch('/api/*', delegate),
  http.delete('/api/*', delegate),
  http.options('/api/*', delegate),
  http.head('/api/*', delegate),
);
```

### Пример: добавить новый обработчик (фабрика)

1) Создайте файл `src/mocks/handlers/createMyFeatureHandler.ts`:
```ts
import type { IRequestHandler } from '../types';

export function createMyFeatureHandler(priority = 50): IRequestHandler {
  return {
    id: 'MyFeatureHandler',
    priority,
    canHandle(req) {
      const url = new URL(req.url);
      return url.pathname.startsWith('/api/my-feature') && req.method.toUpperCase() === 'GET';
    },
    async handle(_req) {
      return new Response(JSON.stringify({ items: [] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    },
  };
}
```
2) Зарегистрируйте его в `src/mocks/handlers/index.ts`:
```ts
import type { IRequestOrchestrator } from '../types';
import { createAuthApiHandler } from './createAuthApiHandler';
import { createMyFeatureHandler } from './createMyFeatureHandler';

export function registerHandlers(orchestrator: IRequestOrchestrator): void {
  orchestrator.registerHandler(createAuthApiHandler(100));
  orchestrator.registerHandler(createMyFeatureHandler(50));
}
```

### Отладка

- Включены подробные логи: на вход (`⇢ METHOD PATH`), результат (`⇠ mocked/bypass … status N`), а также события воркера `request:start`, `response:mocked`, `response:bypass`, `request:unhandled`.
- В `main.tsx` добавлены `console.time` вокруг динамического импорта и `worker.start` для диагностики задержек.
- При использовании Storybook воркер по умолчанию не стартует (guard по `location.pathname`), для моков в сторибуке используйте `msw-storybook-addon`.

### CI/CD и выключение в проде

- Для prod/CI установите `VITE_ENABLE_MSW=false` — флаг `__ENABLE_MSW__` станет `false`, и весь MSW‑код будет удалён бандлером (dead‑code elimination).
- Убедитесь, что `public/mockServiceWorker.js` присутствует в репозитории (либо добавьте шаг `npx msw init public --save` для локальной разработки).
- Никаких дополнительных шагов по выключению не требуется.

### Рекомендации по стилю (фабричный подход)

- Пишите фабрики как чистые функции: все зависимости (логгеры, конфиг, фичи) передавайте аргументами.
- Не импортируйте браузер‑небезопасные модули (например, `node:*`, `storybook/internal/*`) в код, выполняемый в браузере.
- Держите `canHandle` максимально детерминированным и быстрым, без I/O.
- Используйте явные `priority` и небольшие, сфокусированные обработчики (одна ответственность на фабрику).
- Соблюдайте строгую типизацию TypeScript, избегайте `any`.
- Тестируйте обработчики как обычные функции/объекты (Vitest): легко мокируются и изолируются.

### Ссылки
- MSW v2: https://mswjs.io/
- Vite `define`: https://vite.dev/config/shared-options.html#define
- Руководство по воркеру: https://mswjs.io/docs/integrations/browser
