# Архитектура SkillSwap

Проект построен по методологии **[Feature-Sliced Design (FSD)](https://feature-sliced.design/)**.
Цель — масштабируемость, читаемость и изоляция фич.

🌐 Общая структура
src/
├── api/              # API-методы (моки через fetch)
├── app/              # Инициализация приложения
├── entities/         # Чистые типы данных (без логики)
├── features/         # Бизнес-логика (фичи)
├── widgets/          # Композитные UI-блоки
├── pages/            # Страницы-роуты
└── shared/           # Универсальные компоненты и утилиты

📁 Детальная структура

📁 src/api/
Ответственность: загрузка данных из public/db/.

api/
├── skills-api.ts     # fetch('/db/skills.json')
├── users-api.ts      # fetch('/db/users.json')
└── index.ts          # экспорт всех методов

✅ Использует fetch
✅ Все ответы типизированы через @entities

📁 src/app/
Ответственность: точка входа, провайдеры, роутинг, store.

app/
├── App.tsx           # корневой компонент
├── App.css           # глобальные стили
├── main.tsx          # монтирование в DOM
├── Provider.tsx      # обёртка над всеми провайдерами
├── router/
│   ├── AppRouter.tsx # настройка маршрутов (React Router v7)
│   ├── routeConfig.ts# массив маршрутов (опционально)
│   └── index.ts
└── store/
    └── store.ts      # Redux store (configureStore)

✅ Используется Redux Toolkit
✅ Роутинг через react-router-dom@7   

📁 src/entities/
Ответственность: только типы данных — без логики, без UI.

entities/
├── skill/
│   └── model/
│       └── types/
│           └── types.ts   # interface Skill { ... }
├── user/
│   └── model/
│       └── types/
│           └── types.ts   # interface User { ... }
└── request/
    └── model/
        └── types/
            └── types.ts   # interface ExchangeRequest { ... }

✅ Пример (entities/skill/model/types/types.ts):

export type SkillType = 'teaching' | 'learning';

export interface Skill {
  id: string;
  title: string;
  description: string;
  type: SkillType;
  category: string;
  tags: string[];
  authorId: string;
  imageUrl?: string;
  createdAt: string;
}

📁 src/features/
Ответственность: бизнес-логика одной функции.

features/
├── auth/
│   ├── ui/
│   │   ├── LoginForm.tsx
│   │   └── RegisterForm.tsx
│   ├── model/
│   │   ├── authSlice.ts      # Redux-слайс
│   │   └── useAuth.ts        # хук авторизации
│   └── index.ts              # публичный API
├── profile/
│   ├── ui/
│   │   ├── ProfileHeader.tsx
│   │   ├── MySkillsList.tsx
│   │   └── MyRequestsList.tsx
│   ├── model/
│   │   ├── profileSlice.ts
│   │   └── useProfileData.ts
│   └── index.ts
├── search-filters/
│   ├── ui/
│   │   ├── SearchInput.tsx
│   │   └── CategoryFilter.tsx
│   ├── model/
│   │   ├── searchFiltersSlice.ts
│   │   └── useSearchFilters.ts
│   └── index.ts
└── skills/
    ├── ui/
    │   ├── SkillsList.tsx
    │   └── CreateSkillForm.tsx
    ├── model/
    │   └── skill-slice/
    │       └── skillsSlice.ts
    └── index.ts

✅ Одна фича = одна бизнес-функция
✅ Компоненты в ui/, логика в model/
✅ Экспорт только через index.ts

📁 src/widgets/
Ответственность: UI-блоки, собирающие фичи и shared.

widgets/
├── Header/
│   ├── Header.tsx
│   ├── Header.module.scss
│   └── index.ts
├── SkillCard/
│   ├── SkillCard.tsx
│   ├── SkillCard.module.scss
│   └── index.ts
└── FiltersBar/
    ├── FiltersBar.tsx
    ├── FiltersBar.module.scss
    └── index.ts

✅ Композиция: SkillCard = shared/ui/Card + features/like-icon + entities/skill
✅ Стили — через CSS Modules

📁 src/pages/
Ответственность: одна страница = один роут.

pages/
├── home/
│   ├── ui/HomePage.tsx
│   └── index.ts
├── skill/
│   ├── ui/SkillPage.tsx
│   └── index.ts
├── create-skill/
│   ├── ui/CreateSkillPage.tsx
│   └── index.ts
├── favorites/
│   ├── ui/FavoritesPage.tsx
│   └── index.ts
├── profile/
│   ├── ui/ProfilePage.tsx
│   └── index.ts
├── login/
│   ├── ui/LoginPage.tsx
│   └── index.ts
├── register/
│   ├── ui/RegisterPage.tsx
│   └── index.ts
└── not-found404/
    ├── ui/NotFoundPage.tsx
    └── index.ts

✅ Минимум логики — только композиция из widgets и features
✅ Роутинг через AppRouter.tsx

📁 src/shared/
Ответственность: универсальные, переиспользуемые элементы.

shared/
├── assets/           # иконки, логотипы
├── hooks/
│   ├── useLocalStorage.ts
│   ├── useDebounce.ts
│   ├── useClickOutside.ts
│   └── index.ts
├── lib/
│   ├── constants.ts
│   ├── helpers.ts
│   ├── validators.ts
│   └── index.ts
├── types/            # общие типы (если не в entities)
│   └── index.ts
└── ui/               # атомарные компоненты
    ├── button/
    ├── input/
    ├── card-section/
    ├── likeButton/
    └── ... (все остальные)

✅ Компоненты — максимально простые и типизированные

🔗 Правила импортов (FSD)
✅ Разрешено
pages     → widgets, features, entities, shared
widgets   → features, entities, shared
features  → entities, shared
entities  → shared
shared    → ничего

❌ Запрещено
shared    → entities, features, widgets, pages
entities  → features, widgets, pages
features  → widgets, pages
widgets   → pages

🧠 State Management
Глобальное состояние: Redux Toolkit
Слайсы: хранятся в features/*/model/
Store: инициализируется в src/app/store/store.ts
Локальное состояние: useState, useReducer

🎨 Стилизация
Глобальные стили: src/app/App.css
Компонентные стили: CSS Modules (.module.scss)
Stylelint: настроен, ошибки исправляются через npm run stylelint:fix

🧪 Тестирование (в планах)
Jest + React Testing Library
Цель: ≥70% покрытия ядра
Тесты лежат рядом с компонентами: Component.test.tsx

🚀 CI/CD
Файл .github/workflows/ci.yml проверяет:
линтинг (ESLint, Stylelint),
форматирование (Prettier),
сборку (npm run build),
типизацию (TypeScript).

✅ Рекомендации команде
Один компонент = одна папка с index.ts
Типизируй всё — избегай any
Логика в хуках, рендер в компонентах
Redux только для глобального состояния
Перед коммитом — npm run check

📚 Источники
Feature-Sliced Design
Redux Toolkit
React TypeScript Cheatsheet




