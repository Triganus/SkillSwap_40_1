# Skills Slice

Redux slice для управления навыками.

## Структура файлов

```
src/entities/skill/model/
├── skillsSlice.ts   # Основной slice с редюсерами, экшенами и селекторами
├── types.ts         # Типы для состояния и IUserPublic
├── index.ts         # Экспорт всех публичных API
└── types/
    └── types.ts     # Типы для Skill
```

## Использование

### 1. Загрузка навыков

```typescript
import { useAppDispatch } from '@/shared/hooks/redux';
import { fetchSkills } from '@entities/skill/model';

const MyComponent = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchSkills());
  }, [dispatch]);

  return <div>...</div>;
};
```

### 2. Поиск навыков

```typescript
import { useAppDispatch, useAppSelector } from '@/shared/hooks/redux';
import { setSearchQuery, filterSkills, getSearchResults, getSearchQuery } from '@entities/skill/model';

const SearchComponent = () => {
  const dispatch = useAppDispatch();
  const searchQuery = useAppSelector(getSearchQuery);
  const searchResults = useAppSelector(getSearchResults);

  const handleSearch = (query: string) => {
    dispatch(setSearchQuery(query));
    dispatch(filterSkills());
  };

  return (
    <div>
      <input
        value={searchQuery}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Поиск навыков..."
      />
      <ul>
        {searchResults.map((skill) => (
          <li key={skill.id}>{skill.title}</li>
        ))}
      </ul>
    </div>
  );
};
```

### 3. Получение популярных и новых навыков

```typescript
import { useAppSelector } from '@/shared/hooks/redux';
import { getPopularSkills, getNewSkills } from '@entities/skill/model';

const SkillsPage = () => {
  const popularSkills = useAppSelector(getPopularSkills);
  const newSkills = useAppSelector(getNewSkills);

  return (
    <div>
      <section>
        <h2>Популярные навыки</h2>
        {popularSkills.map((skill) => (
          <SkillCard key={skill.id} skill={skill} />
        ))}
      </section>

      <section>
        <h2>Новые навыки</h2>
        {newSkills.map((skill) => (
          <SkillCard key={skill.id} skill={skill} />
        ))}
      </section>
    </div>
  );
};
```

## API

### Экшены

- **`setSearchQuery(query: string)`** - обновляет поисковый запрос
- **`fetchSkills()`** - асинхронный экшен, загружает все навыки с API
- **`filterSkills()`** - обновляет popularSkills, newSkills, searchResults на
  основе skills и searchQuery

### Селекторы

- **`getSkills(state: RootState)`** - возвращает все навыки
- **`getPopularSkills(state: RootState)`** - возвращает популярные навыки
  (первые 10)
- **`getNewSkills(state: RootState)`** - возвращает новые навыки
  (отсортированные по дате)
- **`getSearchResults(state: RootState)`** - возвращает результаты поиска
- **`getSearchQuery(state: RootState)`** - возвращает текущий поисковый запрос
- **`getSkillsLoading(state: RootState)`** - возвращает статус загрузки
- **`getSkillsError(state: RootState)`** - возвращает ошибку, если есть

### Типы

```typescript
interface SkillsState {
  skills: Skill[];
  popularSkills: Skill[];
  newSkills: Skill[];
  searchResults: Skill[];
  searchQuery: string;
  loading: boolean;
  error: string | null;
}

interface IUserPublic {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  createdAt: string;
}

interface Skill {
  id: string;
  title: string;
  description: string;
  type: 'teaching' | 'learning';
  category: TagCategory;
  authorId: string;
  createdAt: string;
}
```

## Примечания

- После загрузки навыков через `fetchSkills()` автоматически вызывается
  `filterSkills()` для инициализации популярных и новых навыков.
- Популярные навыки определяются как первые 10 из списка (можно расширить логику
  на основе рейтинга).
- Новые навыки сортируются по дате создания в убывающем порядке и берутся
  первые 10.
- Поиск выполняется по полям: title, description, category.
