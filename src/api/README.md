# API Functions

Этот модуль содержит функции для загрузки данных из JSON файлов.

## Доступные функции

### `fetchSkills(): Promise<Skill[]>`
Загружает список всех навыков из `/db/skills.json`.

**Возвращает:** Promise с массивом объектов типа `Skill`

**Пример использования:**
```typescript
import { fetchSkills } from './api';

const skills = await fetchSkills();
console.log(skills); // [{ id: "1", title: "React Development", ... }, ...]
```

### `fetchUsers(): Promise<User[]>`
Загружает список всех пользователей из `/db/users.json`.

**Возвращает:** Promise с массивом объектов типа `User`

**Пример использования:**
```typescript
import { fetchUsers } from './api';

const users = await fetchUsers();
console.log(users); // [{ id: "user1", name: "Алексей Иванов", ... }, ...]
```

## Типы данных

### Skill
```typescript
interface Skill {
  id: string;
  title: string;
  description: string;
  type: 'teaching' | 'learning';
  category: string;
  tags: string[];
  authorId: string;
  createdAt: string;
}
```

### User
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  skills: string[];
  createdAt: string;
}
```

## Обработка ошибок

Все функции включают обработку ошибок:
- HTTP ошибки (404, 500, etc.)
- Ошибки парсинга JSON
- Сетевые ошибки

Ошибки логируются в консоль и пробрасываются дальше для обработки в компонентах.

## Тестирование

Для тестирования API функций можно использовать:
1. Компонент `ApiTest` в `src/components/ApiTest.tsx`
2. Функцию `testApiFunctions()` в `src/test-api.tsx`
3. Консоль браузера: `window.testApiFunctions()`
