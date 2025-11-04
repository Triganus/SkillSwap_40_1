import type { AuthUser } from '@entities/user/model/types/types';
import type { TagCategory } from '@shared/ui/Tag';

export interface CompleteRegistrationRequest {
  // Данные из шага 1
  email: string;
  password: string;
  // Данные из шага 2
  avatar?: string | null;
  name: string;
  birthDate: string;
  gender: string;
  city: string;
  interests: {
    categories: TagCategory[];
    subcategories: string[];
  };
  // Данные из шага 3
  skill: {
    title: string;
    category: TagCategory;
    subcategory: string;
    description: string;
    images: string[];
  };
}

export interface CompleteRegistrationResponse {
  accessToken: string;
  refreshToken?: string;
  user: AuthUser;
}

function hasStringMessage(x: unknown): x is { message: string } {
  return (
    typeof x === 'object' &&
    x !== null &&
    'message' in x &&
    typeof (x as { message?: unknown }).message === 'string'
  );
}

/**
 * Завершает процесс регистрации, отправляя все собранные данные.
 */
export async function completeRegistration(
  request: CompleteRegistrationRequest
): Promise<CompleteRegistrationResponse> {
  const res = await fetch('/api/registration/complete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

  const contentType = res.headers.get('content-type') ?? '';
  const isJson = contentType.includes('application/json');

  let data: unknown = null;

  try {
    data = isJson ? await res.json() : await res.text();
  } catch {
    // ignore
  }

  if (!res.ok) {
    const message =
      isJson && hasStringMessage(data) ? data?.message : `Registration failed (${res.status})`;

    throw new Error(message);
  }

  if (!isJson) {
    throw new Error('Expected JSON response');
  }

  return data as CompleteRegistrationResponse;
}
