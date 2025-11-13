import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  completeRegistration,
  type CompleteRegistrationRequest,
  type CompleteRegistrationResponse,
} from '../registration';
import type { AuthUser } from '@entities/user/model/types/types';
import type { TagCategory } from '@shared/ui/Tag';

describe('completeRegistration', () => {
  let mockFetch: ReturnType<typeof vi.fn>;

  const fakeUser: AuthUser = {
    id: '1',
    name: 'Jane Doe',
    email: 'jane@example.com',
  };

  const request: CompleteRegistrationRequest = {
    email: 'jane@example.com',
    password: 'securePass123',
    avatar: null,
    name: 'Jane Doe',
    birthDate: '1990-01-01',
    gender: 'female',
    city: 'New York',
    interests: {
      categories: ['art' as TagCategory],
      subcategories: ['painting'],
    },
    skill: {
      title: 'Painter',
      category: 'art' as TagCategory,
      subcategory: 'painting',
      description: 'I love painting',
      images: [],
    },
  };

  const response: CompleteRegistrationResponse = {
    accessToken: 'fake-access-token',
    refreshToken: 'fake-refresh-token',
    user: fakeUser,
  };

  beforeEach(() => {
    mockFetch = vi.fn();
    global.fetch = mockFetch;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should complete registration successfully', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      headers: { get: (key: string) => (key === 'content-type' ? 'application/json' : null) },
      json: async () => response,
    });

    const result = await completeRegistration(request);

    expect(result).toEqual(response);
    expect(mockFetch).toHaveBeenCalledWith('/api/registration/complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
  });

  it('should throw error on failed registration with JSON message', async () => {
    const errorMessage = 'Email already taken';

    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      headers: { get: (key: string) => (key === 'content-type' ? 'application/json' : null) },
      json: async () => ({ message: errorMessage }),
    });

    await expect(completeRegistration(request)).rejects.toThrow(errorMessage);
  });

  it('should throw error on failed registration with non-JSON response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      headers: { get: () => 'text/plain' },
      text: async () => 'Server error',
    });

    await expect(completeRegistration(request)).rejects.toThrow('Registration failed (500)');
  });

  it('should throw error if successful response is not JSON', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      headers: { get: () => 'text/plain' },
      text: async () => 'ok',
    });

    await expect(completeRegistration(request)).rejects.toThrow('Expected JSON response');
  });
});
