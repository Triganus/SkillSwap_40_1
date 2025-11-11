import { delay } from 'msw';
import type { IRequestHandler } from '../types';
import type { INotification, NotificationType } from '@/entities/notification/model/types/types';
import type { DbUser } from '@/entities/user/model/types/types';
import type { UserListItem } from '@/entities/user/model-v2/types';
import { ensureData, mulberry32 } from './createUsersApiHandler';

const STORAGE_STATE_KEY = 'mock_notifications_state_v1';
const STORAGE_SEED_KEY = 'mock_notifications_seed_v1';

type NotificationState = {
  notifications: INotification[];
  seenPairs: string[];
  requestIndex: number;
  seed: number;
};

let inMemoryState: NotificationState | null = null;

export function createNotificationsApiHandler(priority = 95): IRequestHandler {
  return {
    id: 'NotificationsApiHandler',
    priority,
    canHandle(request) {
      const url = new URL(request.url);
      return url.pathname.startsWith('/api/notifications');
    },
    async handle(request) {
      const url = new URL(request.url);
      const { pathname } = url;

      await delay(250);

      if (request.method === 'GET' && pathname === '/api/notifications') {
        return handleGetNotifications();
      }

      if (request.method === 'PATCH') {
        const viewSingleMatch = pathname.match(/^\/api\/notifications\/([^/]+)\/view$/);
        if (viewSingleMatch) {
          const [, notificationId] = viewSingleMatch;
          return handleMarkViewed(notificationId);
        }

        if (pathname === '/api/notifications/mark-all-viewed') {
          return handleMarkAllViewed();
        }
      }

      return Response.json({ message: 'Not Found' }, { status: 404 });
    },
  };
}

async function handleGetNotifications(): Promise<Response> {
  const state = await ensureState();
  const { notifications } = state;

  const splitted = splitNotifications(notifications);
  persistState(state);

  return Response.json(splitted);
}

async function handleMarkViewed(notificationId: string): Promise<Response> {
  const state = await ensureState();

  const notification = state.notifications.find((item) => item.id === notificationId);
  if (!notification) {
    return Response.json({ message: 'Notification not found' }, { status: 404 });
  }

  notification.isViewed = true;
  persistState(state);

  return Response.json(notification);
}

async function handleMarkAllViewed(): Promise<Response> {
  const state = await ensureState();

  state.notifications.forEach((item) => {
    item.isViewed = true;
  });

  persistState(state);

  return Response.json(splitNotifications(state.notifications));
}

async function ensureState(): Promise<NotificationState> {
  if (inMemoryState) {
    await maybeExtendNotifications(inMemoryState);
    return inMemoryState;
  }

  const initialState = loadStateFromStorage() ?? (await createInitialState());
  await maybeExtendNotifications(initialState);

  inMemoryState = initialState;
  return inMemoryState;
}

function loadStateFromStorage(): NotificationState | null {
  try {
    const raw = localStorage.getItem(STORAGE_STATE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as NotificationState;

    const seedRaw = localStorage.getItem(STORAGE_SEED_KEY);
    if (typeof seedRaw === 'string') {
      parsed.seed = Number.parseInt(seedRaw, 10);
    }

    parsed.notifications = parsed.notifications ?? [];
    parsed.seenPairs = parsed.seenPairs ?? [];
    parsed.requestIndex = parsed.requestIndex ?? 0;
    parsed.seed = Number.isFinite(parsed.seed) ? parsed.seed : generateSeed();

    return parsed;
  } catch (error) {
    console.warn('[Mock] Failed to load notifications state:', error);
    return null;
  }
}

async function createInitialState(): Promise<NotificationState> {
  const seed = loadOrCreateSeed();
  const { notifications, seenPairs } = await generateNotifications(seed, 0);

  return {
    notifications,
    seenPairs,
    requestIndex: 0,
    seed,
  };
}

function loadOrCreateSeed(): number {
  try {
    const existing = localStorage.getItem(STORAGE_SEED_KEY);
    if (existing) {
      return Number.parseInt(existing, 10);
    }
  } catch (error) {
    console.warn('[Mock] Failed to read notifications seed:', error);
  }

  const seed = generateSeed();

  try {
    localStorage.setItem(STORAGE_SEED_KEY, String(seed));
  } catch (error) {
    console.warn('[Mock] Failed to persist notifications seed:', error);
  }

  return seed;
}

function generateSeed(): number {
  if (typeof crypto !== 'undefined' && 'getRandomValues' in crypto) {
    const buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    return buf[0];
  }
  return Math.floor(Date.now() % 4294967295);
}

async function maybeExtendNotifications(state: NotificationState): Promise<void> {
  const desiredCount = getDesiredCount(state.requestIndex);

  if (state.notifications.length < desiredCount) {
    const { notifications: generated, seenPairs } = await generateNotifications(
      state.seed,
      state.requestIndex,
      state.notifications,
      new Set(state.seenPairs)
    );

    state.notifications = generated;
    state.seenPairs = seenPairs;
  }

  if (state.requestIndex < Number.MAX_SAFE_INTEGER) {
    state.requestIndex += 1;
  }
}

function getDesiredCount(requestIndex: number): number {
  const base = 6;
  const increment = 2;
  const max = 30;
  const desired = base + requestIndex * increment;
  return desired > max ? max : desired;
}

async function generateNotifications(
  seed: number,
  requestIndex: number,
  existing: INotification[] = [],
  existingPairs?: Set<string>
): Promise<{ notifications: INotification[]; seenPairs: string[] }> {
  const target = existing.slice();
  const seen = existingPairs ?? new Set(existing.map((n) => buildPairKey(n.from.id, n.type)));

  const { users, skillPool } = await ensureData();
  if (!users.length) {
    return { notifications: target, seenPairs: Array.from(seen) };
  }

  const currentUser = pickCurrentUser(users);
  const generator = mulberry32(seed + requestIndex * 101);
  const availableTypes: NotificationType[] = [
    'exchange_request',
    'exchange_accepted',
    'exchange_declined',
    'new_message',
    'favorite_added',
    'skill_updated',
  ];

  const senders = users.filter((user) => user.id !== currentUser.id);
  const shuffledSenders = shuffleArray(senders, generator);
  const shuffledTypes = shuffleArray(availableTypes, generator);

  for (const sender of shuffledSenders) {
    for (const type of shuffledTypes) {
      const pairKey = buildPairKey(sender.id, type);
      if (seen.has(pairKey)) continue;

      const notification = buildNotification({
        type,
        from: sender,
        to: currentUser,
        generator,
        skillPool,
        index: target.length,
      });

      if (!notification) {
        continue;
      }

      seen.add(pairKey);
      target.push(notification);

      if (target.length >= getDesiredCount(requestIndex)) {
        return { notifications: target, seenPairs: Array.from(seen) };
      }
    }
  }

  return { notifications: target, seenPairs: Array.from(seen) };
}

function buildNotification({
  type,
  from,
  to,
  generator,
  skillPool,
  index,
}: {
  type: NotificationType;
  from: UserListItem;
  to: UserListItem;
  generator: () => number;
  skillPool: Array<{ id: string; name: string; categoryId: string }>;
  index: number;
}): INotification | null {
  const fromDb = toDbUser(from, skillPool);
  const toDb = toDbUser(to, skillPool);

  const relatedSkillId =
    from.canTeachSkills.length > 0
      ? pickItem(from.canTeachSkills, generator)
      : from.wantsToLearnSkills.length > 0
        ? pickItem(from.wantsToLearnSkills, generator)
        : undefined;

  const id = `notif_${from.id}_${type}_${index}`;
  const baseTimestamp = new Date('2024-06-01T12:00:00Z').getTime();
  const offset = Math.floor(generator() * 1000 * 60 * 60 * 24 * 14);
  const timestamp = baseTimestamp - offset;

  return {
    id,
    type,
    date: new Date(timestamp).toISOString(),
    from: fromDb,
    to: toDb,
    isViewed: index % 4 === 0,
    relatedSkillId,
    link: relatedSkillId ? `/skill/${relatedSkillId}` : `/profile/${from.id}`,
  };
}

function toDbUser(
  user: UserListItem,
  skillPool: Array<{ id: string; name: string; categoryId: string }>
): DbUser {
  const teachSkills =
    user.canTeachSkills?.map((skillId) => ({
      skill_id: skillId,
      skill_description: skillPool.find((skill) => skill.id === skillId)?.name ?? '',
    })) ?? [];

  const learnSkills =
    user.wantsToLearnSkills?.map((skillId) => ({
      skill_id: skillId,
      skill_description: skillPool.find((skill) => skill.id === skillId)?.name ?? '',
    })) ?? [];

  return {
    id: user.id,
    name: user.name,
    email: `${user.id}@mock.skillswap.local`,
    location: user.cityId,
    avatar_image: user.avatar ?? undefined,
    gender: user.gender === 'male' ? 'Мужской' : user.gender === 'female' ? 'Женский' : undefined,
    age: user.age,
    my_skills: {
      teach: teachSkills,
      learn: learnSkills,
    },
    offers: {
      incoming: [],
      outgoing: [],
      archived: [],
    },
    date_of_registration: new Date(user.createdAt).toISOString(),
  };
}

function pickCurrentUser(users: UserListItem[]): UserListItem {
  const preferredOrder = ['user1', 'user2', 'generated_0'];
  for (const id of preferredOrder) {
    const found = users.find((user) => user.id === id);
    if (found) return found;
  }
  return users[0];
}

function shuffleArray<T>(items: T[], random: () => number): T[] {
  const copy = items.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function pickItem<T>(items: T[], random: () => number): T {
  return items[Math.floor(random() * items.length)];
}

function buildPairKey(userId: string, type: NotificationType): string {
  return `${userId}:${type}`;
}

function splitNotifications(notifications: INotification[]): {
  new: INotification[];
  viewed: INotification[];
} {
  const fresh: INotification[] = [];
  const seen: INotification[] = [];

  notifications.forEach((notification) => {
    if (notification.isViewed) {
      seen.push(notification);
    } else {
      fresh.push(notification);
    }
  });

  return {
    new: fresh,
    viewed: seen,
  };
}

function persistState(state: NotificationState): void {
  try {
    localStorage.setItem(
      STORAGE_STATE_KEY,
      JSON.stringify({
        notifications: state.notifications,
        seenPairs: state.seenPairs,
        requestIndex: state.requestIndex,
        seed: state.seed,
      })
    );
  } catch (error) {
    console.warn('[Mock] Failed to persist notifications state:', error);
  }
}
