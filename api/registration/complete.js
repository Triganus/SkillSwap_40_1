import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function handler(request) {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ message: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await request.json();
    const { email, name, birthDate, gender, city, skill } = body;

    if (!email || !name) {
      return new Response(JSON.stringify({ message: 'Email and name are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const createdAt = Date.now();
    const userId = `user_${createdAt}`;

    // В реальном приложении здесь была бы запись в БД
    // Для демо просто возвращаем успешный ответ
    const mockUser = {
      id: userId,
      email: email,
      name: name,
      avatar_image: body.avatar || undefined,
      date_of_birth: birthDate,
      gender: gender || 'not_specified',
      location: city,
      date_of_registration: new Date(createdAt).toISOString(),
      my_skills: {
        teach: [
          {
            skill_id: `skill_${userId}_0`,
            skill_description: skill?.description || '',
          },
        ],
      },
    };

    return new Response(JSON.stringify({
      accessToken: `mock-access-token-${userId}`,
      refreshToken: `mock-refresh-token-${userId}`,
      user: mockUser,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error during registration:', error);
    return new Response(JSON.stringify({ message: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

