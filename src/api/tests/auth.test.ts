import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { login, type LoginRequest, type LoginResponse } from '../auth';
import type { AuthUser } from '@entities/user/model-v2/types';

describe('login', () => {
  let mockFetch: ReturnType<typeof vi.fn>;

  const fakeUser: AuthUser = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    avatar: null,
    token: 'test-token'
  };

  const request: LoginRequest = {
    email: 'john@example.com',
    password: 'password123',
  };

  const response: LoginResponse = {
    accessToken: 'fake-access-token',
    refreshToken: 'fake-refresh-token',
    user: fakeUser,
  };

  beforeEach(() => {
    mockFetch = vi.fn();
    // @ts-ignore
    global.fetch = mockFetch;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should login successfully', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      headers: {
        get: (key: string) =>
          key === 'content-type' ? 'application/json' : null,
      },
      json: async () => response,
    });

    const result = await login(request);
    expect(result).toEqual(response);
    expect(mockFetch).toHaveBeenCalledWith('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
  });

  it('should throw error on failed login with JSON message', async () => {
    const errorMessage = 'Invalid credentials';

    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      headers: {
        get: (key: string) =>
          key === 'content-type' ? 'application/json' : null,
      },
      json: async () => ({ message: errorMessage }),
    });

    await expect(login(request)).rejects.toThrow(errorMessage);
  });

  it('should throw error on failed login with non-JSON response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      headers: {
        get: () => 'text/plain',
      },
      text: async () => 'Server error',
    });

    await expect(login(request)).rejects.toThrow('Login failed (500)');
  });

  it('should throw error if response is not JSON on success', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      headers: {
        get: () => 'text/plain',
      },
      text: async () => 'ok',
    });

    await expect(login(request)).rejects.toThrow(
      'Unexpected response from server (non-JSON). Ensure MSW is enabled.'
    );
  });
});
