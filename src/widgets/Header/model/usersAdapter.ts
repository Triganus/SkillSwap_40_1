import type { HeaderUser } from '../type';

export type RawUser = {
  id: string;
  name: string;
  avatar_image?: string;
};

export type RawUsersResponse = {
  users: RawUser[];
};

let cache: HeaderUser[] | null = null;

export async function fetchHeaderUsers(): Promise<HeaderUser[]> {
  if (cache) return cache;

  const res = await fetch('/db/users.json');
  if (!res.ok) throw new Error(`Failed to load users.json: ${res.status}`);

  const data: RawUsersResponse = await res.json();
  const mapped: HeaderUser[] = (data.users ?? []).map((u) => ({
    id: u.id,
    name: u.name,
    avatarSrc: u.avatar_image,
  }));

  cache = mapped;
  return mapped;
}

