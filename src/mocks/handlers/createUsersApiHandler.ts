import type { IRequestHandler } from '../types';
import { delay } from 'msw';
import type { UserListItem, UserProfile, TeachingSkill } from '@/entities/user/model-v2';

const GENERATED_USER_COUNT = 30; // Дополнительно генерируем 30 пользователей
const STORAGE_KEY = 'mock_generated_users_v1'; // Ключ для localStorage

let cache: {
  users: UserListItem[];
  skillPool: Array<{ id: string; name: string; categoryId: string }>;
} | null = null;

// Хранилище лайков в памяти: Map<skillId, Set<userId>>
let likesCache: Map<string, Set<string>> | null = null;

/**
 * Инициализация лайков со случайными значениями
 */
function initializeLikes(users: UserListItem[]): Map<string, Set<string>> {
  const likes = new Map<string, Set<string>>();
  const seed = mulberry32(42); // Детерминированная случайность

  // Для каждого пользователя генерируем навык и случайные лайки
  users.forEach((user) => {
    if (user.canTeachSkills.length === 0) return;

    const skillId = `skill_${user.id}_0`;
    const likesCount = Math.floor(seed() * 16);
    const likedByUsers = new Set<string>();
    const shuffled = [...users].sort(() => seed() - 0.5);

    for (let i = 0; i < Math.min(likesCount, shuffled.length); i++) {
      likedByUsers.add(shuffled[i].id);
    }

    likes.set(skillId, likedByUsers);
  });

  return likes;
}

// Инициализация кеша лайков
function ensureLikesCache(users: UserListItem[]): Map<string, Set<string>> {
  if (!likesCache) {
    likesCache = initializeLikes(users);
  }
  return likesCache;
}

function enrichUsersWithLikes(
  users: UserListItem[],
  allUsers: UserListItem[],
  currentUserId?: string
): UserListItem[] {
  const likes = ensureLikesCache(allUsers);

  return users.map((user) => {
    if (!user.canTeachSkills.length) {
      return user;
    }

    const primarySkillId = `skill_${user.id}_0`;
    const likedBy = likes.get(primarySkillId) || new Set<string>();
    const likesCount = likedBy.size;
    const isLikedByCurrentUser = currentUserId ? likedBy.has(currentUserId) : false;

    return {
      ...user,
      primarySkillId,
      primarySkillLikesCount: likesCount,
      isLikedByCurrentUser,
    };
  });
}

// Утилиты для генерации детерминированных случайных данных
export function mulberry32(a: number) {
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
async function loadSkillPool(): Promise<Array<{ id: string; name: string; categoryId: string }>> {
  try {
    const res = await fetch('/db/subcategories.json');

    if (!res.ok) {
      console.warn('[Mock] Failed to load subcategories, using fallback');

      return [];
    }

    const data = await res.json();

    return (
      data.subcategories?.map((s: { id: string; name: string; categoryId: string }) => ({
        id: s.id,
        name: s.name,
        categoryId: s.categoryId,
      })) || []
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
  skillPool: Array<{ id: string; name: string; categoryId: string }>,
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
    const genderPrefix = gender === 'male' ? 'male' : 'female';
    // Используем модуль 50 для циклического переиспользования аватаров
    const avatarIndex = String(avatarSeed % 50).padStart(2, '0');
    const avatar = `/src/mocks/avatars/${genderPrefix}-${avatarIndex}.jpg`;

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

export async function ensureData(): Promise<{
  users: UserListItem[];
  skillPool: Array<{ id: string; name: string; categoryId: string }>;
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

function applyQuery(
  users: UserListItem[],
  params: QueryParams,
  skillPool: Array<{ id: string; name: string; categoryId: string }>
): UserListItem[] {
  let list = [...users];

  const { q, cities, gender, sort, subcategories, searchType } = params;

  if (q) {
    const needle = q.toLowerCase();

    list = list.filter((u) => {
      if (u.name.toLowerCase().includes(needle)) return true;
      if (u.cityId.toLowerCase().includes(needle)) return true;
      if (
        u.canTeachSkills.some((s) => s.toLowerCase().includes(needle)) ||
        u.wantsToLearnSkills.some((s) => s.toLowerCase().includes(needle))
      ) {
        return true;
      }

      const canTeachSkillNames = u.canTeachSkills
        .map((skillId) => skillPool.find((s) => s.id === skillId)?.name)
        .filter(Boolean);

      const wantsToLearnSkillNames = u.wantsToLearnSkills
        .map((skillId) => skillPool.find((s) => s.id === skillId)?.name)
        .filter(Boolean);

      const allSkillNames = [...canTeachSkillNames, ...wantsToLearnSkillNames];

      return allSkillNames.some((skillName) => skillName?.toLowerCase().includes(needle));
    });
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

      // Логика "похожие пользователи":
      // "Могу научить" (can_teach) → ищем тех, кто ТОЖЕ МОЖЕТ НАУЧИТЬ (canTeachSkills)
      // "Хочу научиться" (want_to_learn) → ищем тех, кто ТОЖЕ ХОЧЕТ НАУЧИТЬСЯ (wantsToLearnSkills)
      if (searchType === 'can_teach') {
        // Пользователь может научить → ищем тех, у кого этот навык тоже в canTeachSkills
        return teachHit;
      }
      if (searchType === 'want_to_learn') {
        // Пользователь хочет научиться → ищем тех, у кого этот навык тоже в wantsToLearnSkills
        return learnHit;
      }

      return teachHit || learnHit;
    });
  } else if (searchType) {
    // Если выбран тип поиска без конкретных навыков
    list = list.filter((u) => {
      // Логика "похожие пользователи":
      // "Могу научить" → показываем тех, кто ТОЖЕ МОЖЕТ НАУЧИТЬ (canTeachSkills)
      // "Хочу научиться" → показываем тех, кто ТОЖЕ ХОЧЕТ НАУЧИТЬСЯ (wantsToLearnSkills)
      if (searchType === 'can_teach') return u.canTeachSkills.length > 0;
      if (searchType === 'want_to_learn') return u.wantsToLearnSkills.length > 0;
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

      const { users, skillPool } = await ensureData();
      const currentUserId = url.searchParams.get('currentUserId') || undefined;

      // /api/users/popular?limit=3
      if (base === '/api/users/popular') {
        const limit = Number(url.searchParams.get('limit') || '3');
        const seed = mulberry32(12345);
        const popular = [...users]
          .sort(() => seed() - 0.5) // Стабильная "случайная" сортировка
          .slice(0, limit);

        return Response.json({ users: enrichUsersWithLikes(popular, users, currentUserId) });
      }

      // /api/users/new?limit=3
      if (base === '/api/users/new') {
        const limit = Number(url.searchParams.get('limit') || '3');
        const newest = [...users].sort((a, b) => b.createdAt - a.createdAt).slice(0, limit);

        return Response.json({ users: enrichUsersWithLikes(newest, users, currentUserId) });
      }

      // /api/users/recommended
      if (base === '/api/users/recommended') {
        const page = Number(url.searchParams.get('page') || '1');
        const limit = Number(url.searchParams.get('limit') || '9');
        const sorted = [...users].sort((a, b) => b.createdAt - a.createdAt);
        const start = (page - 1) * limit;
        const slice = sorted.slice(start, start + limit);

        return Response.json({
          users: enrichUsersWithLikes(slice, users, currentUserId),
          hasMore: start + limit < sorted.length,
        });
      }

      // /api/users/similar - похожие пользователи
      if (base === '/api/users/similar') {
        const userId = url.searchParams.get('userId');
        const canTeachSkills =
          url.searchParams.get('canTeachSkills')?.split(',').filter(Boolean) || [];
        const wantsToLearnSkills =
          url.searchParams.get('wantsToLearnSkills')?.split(',').filter(Boolean) || [];
        const limit = Number(url.searchParams.get('limit') || '10');

        if (!userId) {
          return Response.json({ message: 'userId is required' }, { status: 400 });
        }

        const currentUserSkillIds = new Set(canTeachSkills);
        const currentUserWantsIds = new Set(wantsToLearnSkills);

        // Фильтруем пользователей, исключая текущего
        const similarUsers = users
          .filter((u) => u.id !== userId)
          .map((u) => {
            // Подсчитываем совпадения навыков
            const teachingMatches = u.canTeachSkills.filter(
              (skillId) => currentUserSkillIds.has(skillId) || currentUserWantsIds.has(skillId)
            ).length;

            const learningMatches = u.wantsToLearnSkills.filter(
              (skillId) => currentUserSkillIds.has(skillId) || currentUserWantsIds.has(skillId)
            ).length;

            return {
              user: u,
              matchScore: teachingMatches + learningMatches,
            };
          })
          .filter((item) => item.matchScore > 0) // Только с совпадениями
          .sort((a, b) => b.matchScore - a.matchScore) // Сортируем по количеству совпадений
          .slice(0, limit) // Берем топ N
          .map((item) => item.user);

        return Response.json({ users: enrichUsersWithLikes(similarUsers, users, currentUserId) });
      }

      // /api/users/:id - PATCH - обновление профиля
      const profileMatch = base.match(/^\/api\/users\/(.+)$/);

      if (profileMatch && !profileMatch[1].includes('/')) {
        const id = profileMatch[1];
        const found = users.find((u) => u.id === id);

        if (!found) return Response.json({ message: 'Not found' }, { status: 404 });

        // PATCH - обновление профиля
        if (request.method === 'PATCH') {
          try {
            const updates = await request.json();

            // Обновляем поля пользователя
            if (updates.name !== undefined) found.name = updates.name;
            if (updates.cityId !== undefined) found.cityId = updates.cityId;
            if (updates.age !== undefined) found.age = updates.age;
            if (updates.gender !== undefined) found.gender = updates.gender;
            if (updates.avatar !== undefined) found.avatar = updates.avatar;
            if (updates.canTeachSkills !== undefined) found.canTeachSkills = updates.canTeachSkills;
            if (updates.wantsToLearnSkills !== undefined)
              found.wantsToLearnSkills = updates.wantsToLearnSkills;

            const { profile } = toProfile(found);

            // Если передан bio, обновляем его в профиле
            if (updates.bio !== undefined) {
              profile.bio = updates.bio;
            }

            return Response.json(profile);
          } catch {
            return Response.json({ message: 'Invalid request body' }, { status: 400 });
          }
        }

        // GET - получение профиля
        const { profile, skills } = toProfile(found);

        return Response.json({ profile, skills });
      }

      // /api/users/:userId/likes/:skillId - toggle like по skillId
      const likeMatch = base.match(/^\/api\/users\/([^/]+)\/likes\/([^/]+)$/);

      if (likeMatch && request.method === 'POST') {
        const [, currentUserId, skillId] = likeMatch;
        const likes = ensureLikesCache(users);

        if (!likes.has(skillId)) {
          likes.set(skillId, new Set());
        }

        const skillLikes = likes.get(skillId)!;
        const wasLiked = skillLikes.has(currentUserId);

        if (wasLiked) {
          skillLikes.delete(currentUserId);
        } else {
          skillLikes.add(currentUserId);
        }

        const likesCount = skillLikes.size;

        return Response.json({ liked: !wasLiked, likesCount });
      }

      // /api/users/:currentUserId/likes/by-user/:skillOwnerUserId - toggle like по userId владельца
      const likeByUserMatch = base.match(/^\/api\/users\/([^/]+)\/likes\/by-user\/([^/]+)$/);

      if (likeByUserMatch && request.method === 'POST') {
        const [, currentUserId, skillOwnerUserId] = likeByUserMatch;

        // Находим пользователя-владельца навыка
        const owner = users.find((u) => u.id === skillOwnerUserId);

        if (!owner) {
          return Response.json({ message: 'Skill owner not found' }, { status: 404 });
        }

        // Получаем первый навык владельца (у нас один навык на пользователя)
        const { skills } = toProfile(owner);

        if (!skills.length) {
          return Response.json({ message: 'User has no skills' }, { status: 404 });
        }

        const skillId = skills[0].id;
        const likes = ensureLikesCache(users);

        if (!likes.has(skillId)) {
          likes.set(skillId, new Set());
        }

        const skillLikes = likes.get(skillId)!;
        const wasLiked = skillLikes.has(currentUserId);

        if (wasLiked) {
          skillLikes.delete(currentUserId);
        } else {
          skillLikes.add(currentUserId);
        }

        const likesCount = skillLikes.size;

        return Response.json({ liked: !wasLiked, skillId, likesCount });
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
        const filtered = applyQuery(users, params, skillPool);
        const total = filtered.length;
        const start = (params.page! - 1) * params.limit!;
        const pageItems = filtered.slice(start, start + params.limit!);

        return Response.json({
          users: enrichUsersWithLikes(pageItems, users, currentUserId),
          hasMore: start + params.limit! < total,
          total,
        });
      }

      return Response.json({ message: 'Not Found' }, { status: 404 });
    },
  };
}

function toProfile(u: UserListItem): { profile: UserProfile; skills: TeachingSkill[] } {
  const { skillPool } = cache || { skillPool: [] };
  const seed = mulberry32(parseInt(u.id.replace(/\D/g, ''), 10) || 42);

  const localImages = [
    '/src/mocks/images/image-01.jpg',
    '/src/mocks/images/image-02.jpg',
    '/src/mocks/images/image-03.jpg',
    '/src/mocks/images/image-04.jpg',
    '/src/mocks/images/image-05.jpg',
    '/src/mocks/images/image-06.jpg',
    '/src/mocks/images/image-07.jpg',
    '/src/mocks/images/image-08.jpg',
    '/src/mocks/images/image-09.jpg',
    '/src/mocks/images/image-10.jpg',
    '/src/mocks/images/image-11.jpg',
    '/src/mocks/images/image-12.jpg',
    '/src/mocks/images/image-13.jpg',
    '/src/mocks/images/image-14.jpg',
    '/src/mocks/images/image-15.jpg',
    '/src/mocks/images/image-16.jpg',
    '/src/mocks/images/image-17.jpg',
    '/src/mocks/images/image-18.jpg',
    '/src/mocks/images/image-19.jpg',
    '/src/mocks/images/image-20.jpg',
  ];

  const skillDescriptions = [
    'Научу основам и поделюсь практическими навыками. Индивидуальный подход к каждому ученику.',
    'Делюсь своим многолетним опытом и знаниями. Гарантирую качественное обучение.',
    'Помогу освоить с нуля или усовершенствовать существующие навыки. Профессиональный подход.',
    'Обучу всем тонкостям и нюансам. Практика и теория в идеальном балансе.',
    'Передам свои знания и опыт. Доступно объясню любые сложные моменты.',
  ];

  // Создаем ОТДЕЛЬНЫЕ объекты навыков
  const skills: TeachingSkill[] = u.canTeachSkills.map((subcategoryId, index) => {
    const skillInfo = skillPool.find((s) => s.id === subcategoryId);
    const images: string[] = [];

    for (let i = 0; i < 5; i++) {
      const randomIndex = Math.floor(seed() * localImages.length);

      images.push(localImages[randomIndex]);
    }

    const descriptionIndex = Math.floor(seed() * skillDescriptions.length);
    const skillId = `skill_${u.id}_${index}`;

    // Получаем лайки для этого навыка из кеша
    const likes = likesCache || new Map();
    const likedByUserIds: string[] = Array.from(likes.get(skillId) || []);

    return {
      id: skillId,
      userId: u.id,
      title: skillInfo?.name || 'Навык',
      description: skillDescriptions[descriptionIndex],
      categoryId: skillInfo?.categoryId || 'other',
      subcategoryId: subcategoryId,
      images,
      createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
      likesCount: likedByUserIds.length,
      likedByUserIds,
    };
  });

  const profile: UserProfile = {
    id: u.id,
    name: u.name,
    cityId: u.cityId,
    age: u.age,
    gender: u.gender,
    avatar: u.avatar,
    bio: `Привет! Меня зовут ${u.name}. Я готов делиться своими знаниями и навыками.`,
    canTeachSkills: u.canTeachSkills,
    wantsToLearnSkills: u.wantsToLearnSkills,
    likedSkillIds: [],
  };

  return { profile, skills };
}
