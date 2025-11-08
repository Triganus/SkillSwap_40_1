import type { IRequestHandler } from '../types';
import { delay } from 'msw';
import type { UserListItem, UserProfile } from '@/entities/user/model-v2';

const GENERATED_USER_COUNT = 30; // Дополнительно генерируем 30 пользователей
const STORAGE_KEY = 'mock_generated_users_v1'; // Ключ для localStorage

let cache: { users: UserListItem[]; skillPool: Array<{ id: string; name: string }> } | null = null;

// Утилиты для генерации детерминированных случайных данных
function mulberry32(a: number) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;

    let t = Math.imul(a ^ (a >>> 15), 1 | a);

    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;

    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick<T>(arr: T[], rnd: () => number) {
  return arr[Math.floor(rnd() * arr.length)];
}

function pickMany<T>(arr: T[], n: number, rnd: () => number): T[] {
  const copy = [...arr];
  const out: T[] = [];

  n = Math.min(n, copy.length);

  for (let i = 0; i < n; i++) {
    const idx = Math.floor(rnd() * copy.length);

    out.push(copy[idx]);
    copy.splice(idx, 1);
  }

  return out;
}

/**
 * Загружает пул навыков из локального JSON файла
 */
async function loadSkillPool(): Promise<Array<{ id: string; name: string }>> {
  try {
    const res = await fetch('/db/subcategories.json');

    if (!res.ok) {
      console.warn('[Mock] Failed to load subcategories, using fallback');

      return [];
    }

    const data = await res.json();

    return (
      data.subcategories?.map((s: { id: string; name: string }) => ({ id: s.id, name: s.name })) ||
      []
    );
  } catch (error) {
    console.error('[Mock] Error loading skill pool:', error);
    return [];
  }
}

/**
 * Загружает пользователей из файла /db/users-v2.json
 */
async function loadDbUsers(): Promise<UserListItem[]> {
  try {
    const res = await fetch('/db/users-v2.json');

    if (!res.ok) {
      console.warn('[Mock] Failed to load users from db, using empty array');

      return [];
    }

    const data = await res.json();

    interface DbUserV2 {
      id: string;
      name: string;
      email: string;
      birthDate: string;
      gender: 'male' | 'female' | 'not_specified';
      cityId: string; // Теперь используем ID города
      avatar: string | null;
      bio: string;
      canTeachSkillIds: string[];
      wantsToLearnSkillIds: string[];
      likedSkillIds: string[];
      createdAt: number;
    }

    return (
      data.users?.map((u: DbUserV2) => {
        const birthDate = new Date(u.birthDate);
        const age = new Date().getFullYear() - birthDate.getFullYear();

        const canTeachSkills = u.canTeachSkillIds;
        const wantsToLearnSkills = u.wantsToLearnSkillIds;

        return {
          id: u.id,
          name: u.name,
          cityId: u.cityId,
          age,
          gender: u.gender,
          avatar: u.avatar,
          canTeachSkills,
          wantsToLearnSkills,
          createdAt: u.createdAt,
        } as UserListItem;
      }) || []
    );
  } catch (error) {
    console.error('[Mock] Error loading db users:', error);

    return [];
  }
}
/**
 * Сохраняет сгенерированных пользователей в localStorage
 */
function saveGeneratedUsers(users: UserListItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));

    console.log('[Mock] Saved generated users to localStorage:', users.length);
  } catch (error) {
    console.warn('[Mock] Failed to save generated users:', error);
  }
}

/**
 * Загружает сгенерированных пользователей из localStorage
 */
function loadGeneratedUsers(): UserListItem[] | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) return null;

    const users = JSON.parse(stored) as UserListItem[];

    console.log('[Mock] Loaded generated users from localStorage:', users.length);

    return users;
  } catch (error) {
    console.warn('[Mock] Failed to load generated users:', error);

    return null;
  }
}

/**
 * Очищает сохраненных пользователей (для принудительной регенерации)
 * Использование: в консоли браузера выполните window.clearMockUsers()
 */
function clearGeneratedUsers(): void {
  localStorage.removeItem(STORAGE_KEY);

  cache = null;

  console.log('[Mock] Cleared generated users. Reload page to regenerate.');
}

if (typeof window !== 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).clearMockUsers = clearGeneratedUsers;

  console.log('[Mock] To regenerate users, run: window.clearMockUsers()');
}

/**
 * Генерирует дополнительных пользователей
 */
function generateAdditionalUsers(
  count: number,
  skillPool: Array<{ id: string; name: string }>,
  startId: number
): UserListItem[] {
  const seed = mulberry32(42);
  const cityIds = [
    'city_msk',
    'city_spb',
    'city_kzn',
    'city_ekb',
    'city_nsk',
    'city_sam',
    'city_rst',
    'city_perm',
  ];
  const maleNames = [
    'Александр',
    'Дмитрий',
    'Максим',
    'Артём',
    'Иван',
    'Никита',
    'Михаил',
    'Сергей',
    'Андрей',
    'Егор',
  ];
  const femaleNames = [
    'Анна',
    'Мария',
    'Елена',
    'Ольга',
    'Екатерина',
    'Наталья',
    'Дарья',
    'Алина',
    'Виктория',
    'Ирина',
  ];

  const users: UserListItem[] = [];

  const baseDate = new Date('2024-05-01').getTime();

  for (let i = 0; i < count; i++) {
    const gender = pick(['male', 'female'] as const, seed);
    const firstName = gender === 'male' ? pick(maleNames, seed) : pick(femaleNames, seed);
    const name = `${firstName} ${String.fromCharCode(65 + Math.floor(seed() * 26))}.`;
    const age = 18 + Math.floor(seed() * 35);
    const createdAt = baseDate + Math.floor(seed() * 1000 * 60 * 60 * 24 * 180); // последние 180 дней от baseDate
    const avatarSeed = Math.floor(seed() * 10000);
    const genderParam = gender === 'male' ? 'men' : 'women';
    const avatar = `https://randomuser.me/api/portraits/${genderParam}/${avatarSeed % 100}.jpg`;

    const canTeachSkills = pickMany(skillPool, 1 + Math.floor(seed() * 3), seed).map((s) => s.id); // ✅ ID
    const wantsToLearnSkills = pickMany(
      skillPool.filter((s) => !canTeachSkills.includes(s.id)),
      1 + Math.floor(seed() * 4),
      seed
    ).map((s) => s.id);

    users.push({
      id: `generated_${startId + i}`,
      name,
      cityId: pick(cityIds, seed),
      age,
      gender,
      avatar,
      canTeachSkills,
      wantsToLearnSkills,
      createdAt,
    });
  }

  return users;
}

async function ensureData(): Promise<{
  users: UserListItem[];
  skillPool: Array<{ id: string; name: string }>;
}> {
  if (cache) return cache;

  const skillPool = await loadSkillPool();
  const dbUsers = await loadDbUsers();

  let generatedUsers = loadGeneratedUsers();

  if (!generatedUsers || generatedUsers.length !== GENERATED_USER_COUNT) {
    console.log('[Mock] Generating new users...');

    generatedUsers = generateAdditionalUsers(GENERATED_USER_COUNT, skillPool, dbUsers.length);

    saveGeneratedUsers(generatedUsers);
  } else {
    console.log('[Mock] Using cached generated users');
  }

  const allUsers = [...dbUsers, ...generatedUsers];

  cache = { users: allUsers, skillPool };

  return cache;
}

interface QueryParams {
  page?: number;
  limit?: number;
  q?: string;
  categories?: string;
  subcategories?: string;
  cities?: string;
  gender?: string;
  sort?: 'newest' | 'oldest';
  searchType?: 'want_to_learn' | 'can_teach';
}

function applyQuery(users: UserListItem[], params: QueryParams): UserListItem[] {
  let list = [...users];

  const { q, cities, gender, sort, subcategories, searchType } = params;

  if (q) {
    const needle = q.toLowerCase();

    list = list.filter(
      (u) =>
        u.name.toLowerCase().includes(needle) ||
        u.cityId.toLowerCase().includes(needle) || // Поиск по cityId
        u.canTeachSkills.some((s) => s.toLowerCase().includes(needle)) ||
        u.wantsToLearnSkills.some((s) => s.toLowerCase().includes(needle))
    );
  }

  if (cities) {
    const set = new Set(cities.split(',').map((c) => c.toLowerCase()));

    list = list.filter((u) => set.has(u.cityId.toLowerCase()));
  }

  if (gender && ['male', 'female'].includes(gender)) {
    list = list.filter((u) => u.gender === gender);
  }

  if (subcategories) {
    const selected = new Set(subcategories.split(',').map((s) => s.toLowerCase()));

    list = list.filter((u) => {
      const teachHit = u.canTeachSkills.some((s) => selected.has(s.toLowerCase()));
      const learnHit = u.wantsToLearnSkills.some((s) => selected.has(s.toLowerCase()));

      if (!searchType) {
        return teachHit || learnHit;
      }

      if (searchType === 'want_to_learn') {
        return teachHit;
      }
      if (searchType === 'can_teach') {
        return learnHit;
      }

      return teachHit || learnHit;
    });
  } else if (searchType) {
    // Если выбран тип поиска без конкретных навыков
    list = list.filter((u) => {
      if (searchType === 'want_to_learn') return u.canTeachSkills.length > 0;
      if (searchType === 'can_teach') return u.wantsToLearnSkills.length > 0;
      return true;
    });
  }

  if (sort === 'oldest') list.sort((a, b) => a.createdAt - b.createdAt);
  else list.sort((a, b) => b.createdAt - a.createdAt);

  return list;
}

export function createUsersApiHandler(priority = 90): IRequestHandler {
  return {
    id: 'UsersApiHandler',
    priority,
    canHandle(request) {
      const url = new URL(request.url);

      return url.pathname.startsWith('/api/users');
    },
    async handle(request) {
      const url = new URL(request.url);
      const base = url.pathname;

      await delay(250);

      const { users } = await ensureData();

      // /api/users/popular?limit=3
      if (base === '/api/users/popular') {
        const limit = Number(url.searchParams.get('limit') || '3');
        const seed = mulberry32(12345);
        const popular = [...users]
          .sort(() => seed() - 0.5) // Стабильная "случайная" сортировка
          .slice(0, limit);

        return Response.json({ users: popular });
      }

      // /api/users/new?limit=3
      if (base === '/api/users/new') {
        const limit = Number(url.searchParams.get('limit') || '3');
        const newest = [...users].sort((a, b) => b.createdAt - a.createdAt).slice(0, limit);

        return Response.json({ users: newest });
      }

      // /api/users/recommended
      if (base === '/api/users/recommended') {
        const page = Number(url.searchParams.get('page') || '1');
        const limit = Number(url.searchParams.get('limit') || '9');
        const sorted = [...users].sort((a, b) => b.createdAt - a.createdAt);
        const start = (page - 1) * limit;
        const slice = sorted.slice(start, start + limit);

        return Response.json({ users: slice, hasMore: start + limit < sorted.length });
      }

      // /api/users/:id
      const profileMatch = base.match(/^\/api\/users\/(.+)$/);

      if (profileMatch && !profileMatch[1].includes('/')) {
        const id = profileMatch[1];
        const found = users.find((u) => u.id === id);

        if (!found) return Response.json({ message: 'Not found' }, { status: 404 });

        return Response.json(toProfile(found));
      }

      // /api/users (список с фильтрацией)
      if (base === '/api/users') {
        const params: QueryParams = {
          page: Number(url.searchParams.get('page') || '1'),
          limit: Number(url.searchParams.get('limit') || '9'),
          q: url.searchParams.get('q') || undefined,
          categories: url.searchParams.get('categories') || undefined,
          subcategories: url.searchParams.get('subcategories') || undefined,
          cities: url.searchParams.get('cities') || undefined,
          gender: url.searchParams.get('gender') || undefined,
          sort: (url.searchParams.get('sort') as QueryParams['sort']) || 'newest',
          searchType:
            (url.searchParams.get('searchType') as QueryParams['searchType']) || undefined,
        };
        const filtered = applyQuery(users, params);
        const total = filtered.length;
        const start = (params.page! - 1) * params.limit!;
        const pageItems = filtered.slice(start, start + params.limit!);

        return Response.json({ users: pageItems, hasMore: start + params.limit! < total, total });
      }

      return Response.json({ message: 'Not Found' }, { status: 404 });
    },
  };
}

function toProfile(u: UserListItem): UserProfile {
  const { skillPool } = cache || { skillPool: [] };
  const skillMap = new Map(skillPool.map((s) => [s.name.toLowerCase(), s.id]));

  return {
    id: u.id,
    name: u.name,
    cityId: u.cityId, // Используем cityId
    age: u.age,
    gender: u.gender,
    avatar: u.avatar,
    bio: `${u.cityId}, ${u.age} лет`, // Используем cityId (название получим в компоненте)
    canTeachSkillIds: u.canTeachSkills.map((name) => skillMap.get(name.toLowerCase()) || name),
    wantsToLearnSkills: u.wantsToLearnSkills,
    likedSkillIds: [],
  };
}
