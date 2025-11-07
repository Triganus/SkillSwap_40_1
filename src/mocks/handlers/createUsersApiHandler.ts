import type { IRequestHandler } from '../types';
import { delay } from 'msw';

// Типы упрощённые для генерации
interface GeneratedUser {
  id: string;
  name: string;
  city: string;
  age: number;
  gender: 'male' | 'female' | 'not_specified';
  avatar: string | null;
  createdAt: number;
  canTeachSkills: string[]; // названия подкатегорий
  wantsToLearnSkills: string[];
  bio: string;
  likes: number;
  views: number;
}

const USER_COUNT = 120; // Константа количества генерируемых пользователей
let cache: { users: GeneratedUser[]; skillPool: string[] } | null = null;

// Утилиты для генерации детерминированных случайных данных
function mulberry32(a: number) {
  return function () {
    a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296;
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
 * Используем прямой fetch к /db/subcategories.json вместо /api/
 */
async function loadSkillPool(): Promise<string[]> {
  try {
    // Используем публичный JSON напрямую, без API
    const res = await fetch('/db/subcategories.json');
    if (!res.ok) {
      console.warn('[Mock] Failed to load subcategories, using fallback');
      return [];
    }
    const data = await res.json();
    return data.subcategories?.map((s: { name: string }) => s.name) || [];
  } catch (error) {
    console.error('[Mock] Error loading skill pool:', error);
    return [];
  }
}

async function ensureData(): Promise<{ users: GeneratedUser[]; skillPool: string[] }> {
  if (cache) return cache;
  const skillPool = await loadSkillPool();
  const seed = mulberry32(42);
  const cities = ['Москва','Санкт-Петербург','Казань','Екатеринбург','Новосибирск','Самара'];
  const firstNames = ['Анна','Иван','Мария','Павел','Елена','Дмитрий','Сергей','Ольга','Никита','Ксения'];
  const users: GeneratedUser[] = [];
  for (let i=0;i<USER_COUNT;i++) {
    const gender = pick(['male','female','not_specified'] as const, seed);
    const name = pick(firstNames, seed) + ' ' + (i+1);
    const age = 18 + Math.floor(seed()*30);
    const createdAt = Date.now() - Math.floor(seed()*1000*60*60*24*90); // последние 90 дней
    const canTeachSkills = pickMany(skillPool, 1 + Math.floor(seed()*4), seed);
    const wantsToLearnSkills = pickMany(skillPool.filter(s=>!canTeachSkills.includes(s)), 1 + Math.floor(seed()*4), seed);
    users.push({
      id: uuid(),
      name,
      city: pick(cities, seed),
      age,
      gender,
      avatar: null,
      createdAt,
      canTeachSkills,
      wantsToLearnSkills,
      bio: `${Math.floor(age/10)*10}+ специалист` ,
      likes: Math.floor(seed()*500),
      views: Math.floor(seed()*3000),
    });
  }
  cache = { users, skillPool };
  return cache;
}

interface QueryParams {
  page?: number; limit?: number; q?: string; categories?: string; subcategories?: string; cities?: string; gender?: string; sort?: 'newest'|'oldest'; searchType?: 'all'|'want_to_learn'|'can_teach';
}

function applyQuery(users: GeneratedUser[], params: QueryParams) {
  let list = [...users];
  const { q, cities, gender, sort, subcategories, searchType } = params;
  if (q) {
    const needle = q.toLowerCase();
    list = list.filter(u =>
      u.name.toLowerCase().includes(needle) ||
      u.city.toLowerCase().includes(needle) ||
      u.bio.toLowerCase().includes(needle) ||
      u.canTeachSkills.some(s=>s.toLowerCase().includes(needle)) ||
      u.wantsToLearnSkills.some(s=>s.toLowerCase().includes(needle))
    );
  }
  if (cities) {
    const set = new Set(cities.split(',').map(c=>c.toLowerCase()));
    list = list.filter(u => set.has(u.city.toLowerCase()));
  }
  if (gender && ['male','female'].includes(gender)) {
    list = list.filter(u => u.gender === gender);
  }
  if (subcategories) {
    const selected = new Set(subcategories.split(',').map(s=> s.toLowerCase()));
    list = list.filter(u => {
      const teachHit = u.canTeachSkills.some(s=> selected.has(s.toLowerCase()));
      const learnHit = u.wantsToLearnSkills.some(s=> selected.has(s.toLowerCase()));
      switch (searchType) {
        case 'want_to_learn':
          return teachHit;
        case 'can_teach':
          return learnHit;
        case 'all':
        default:
          return teachHit || learnHit;
      }
    });
  } else if (searchType && searchType !== 'all') {
    // Если выбран тип поиска без конкретных навыков, исключаем пользователей без соответствующих массивов
    list = list.filter(u => {
      if (searchType === 'want_to_learn') return u.canTeachSkills.length > 0;
      if (searchType === 'can_teach') return u.wantsToLearnSkills.length > 0;
      return true;
    });
  }
  if (sort === 'oldest') list.sort((a,b)=> a.createdAt - b.createdAt);
  else list.sort((a,b)=> b.createdAt - a.createdAt);
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
        const limit = Number(url.searchParams.get('limit')||'3');
        const popular = [...users].sort((a,b)=> (b.views + b.likes*2) - (a.views + a.likes*2)).slice(0, limit);
        return Response.json({ users: popular.map(strip) });
      }
      // /api/users/new?limit=3
      if (base === '/api/users/new') {
        const limit = Number(url.searchParams.get('limit')||'3');
        const newest = [...users].sort((a,b)=> b.createdAt - a.createdAt).slice(0, limit);
        return Response.json({ users: newest.map(strip) });
      }
      // /api/users/recommended
      if (base === '/api/users/recommended') {
        const page = Number(url.searchParams.get('page')||'1');
        const limit = Number(url.searchParams.get('limit')||'9');
        const sorted = [...users].sort((a,b)=> (b.likes) - (a.likes));
        const start = (page-1)*limit; const slice = sorted.slice(start, start+limit);
        return Response.json({ users: slice.map(strip), hasMore: start+limit < sorted.length });
      }
      // /api/users/:id
      const profileMatch = base.match(/^\/api\/users\/(.+)$/);
      if (profileMatch && !profileMatch[1].includes('/')) {
        const id = profileMatch[1];
        const found = users.find(u=>u.id === id);
        if (!found) return Response.json({ message:'Not found' }, { status:404 });
        return Response.json(toProfile(found));
      }
      // /api/users (список с фильтрацией)
      if (base === '/api/users') {
        const params: QueryParams = {
          page: Number(url.searchParams.get('page')||'1'),
          limit: Number(url.searchParams.get('limit')||'9'),
          q: url.searchParams.get('q')|| undefined,
          categories: url.searchParams.get('categories')|| undefined,
          subcategories: url.searchParams.get('subcategories')|| undefined,
          cities: url.searchParams.get('cities')|| undefined,
          gender: url.searchParams.get('gender')|| undefined,
          sort: (url.searchParams.get('sort') as QueryParams['sort']) || 'newest',
          searchType: (url.searchParams.get('searchType') as QueryParams['searchType']) || 'all',
        };
        const filtered = applyQuery(users, params);
        const total = filtered.length;
        const start = (params.page!-1)*params.limit!;
        const pageItems = filtered.slice(start, start+params.limit!);
        return Response.json({ users: pageItems.map(strip), hasMore: start+params.limit! < total, total });
      }

      return Response.json({ message: 'Not Found' }, { status: 404 });
    },
  };
}

function strip(u: GeneratedUser) {
  return {
    id: u.id,
    name: u.name,
    city: u.city,
    age: u.age,
    gender: u.gender,
    avatar: u.avatar,
    canTeachSkills: u.canTeachSkills,
    wantsToLearnSkills: u.wantsToLearnSkills,
    createdAt: u.createdAt,
  };
}

function toProfile(u: GeneratedUser) {
  return {
    id: u.id,
    name: u.name,
    city: u.city,
    age: u.age,
    gender: u.gender,
    avatar: u.avatar,
    bio: u.bio,
    canTeachSkillIds: u.canTeachSkills.map((s)=> s.toLowerCase().replace(/\s+/g,'-')), // деривация ID
    wantsToLearnSkills: u.wantsToLearnSkills,
    likedSkillIds: [],
  };
}

// Удаляем использование crypto.randomUUID, заменяя на простой генератор
function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
