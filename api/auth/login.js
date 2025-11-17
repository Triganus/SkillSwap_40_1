export default async function handler(request) {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ message: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return new Response(JSON.stringify({ message: 'Email and password are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const url = new URL(request.url);
    // Получаем базовый URL для статических файлов
    const baseUrl = url.origin;
    const dataResponse = await fetch(`${baseUrl}/db/users-v2.json`);
    
    if (!dataResponse.ok) {
      throw new Error(`Failed to load users data: ${dataResponse.status}`);
    }
    
    const data = await dataResponse.json();
    const users = data.users || [];

    // Ищем пользователя по email
    const user = users.find(u => u.email?.toLowerCase() === email.toLowerCase()) || users[0];

    if (!user) {
      return new Response(JSON.stringify({ message: 'Invalid credentials' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Формируем ответ с токенами
    const mockUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      token: `mock-access-token-${user.id}`,
    };

    return new Response(JSON.stringify({
      accessToken: `mock-access-token-${user.id}`,
      refreshToken: `mock-refresh-token-${user.id}`,
      user: mockUser,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error during login:', error);
    return new Response(JSON.stringify({ message: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

