export default async function handler(request) {
  if (request.method !== 'GET') {
    return new Response(JSON.stringify({ message: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const limit = parseInt(url.searchParams.get('limit') || '9', 10);

    // Получаем базовый URL для статических файлов
    const baseUrl = url.origin;
    const dataResponse = await fetch(`${baseUrl}/db/users-v2.json`);
    
    if (!dataResponse.ok) {
      throw new Error(`Failed to load users data: ${dataResponse.status}`);
    }
    
    const data = await dataResponse.json();
    const users = data.users || [];

    // Сортируем по дате создания (новые первыми)
    const sorted = [...users].sort((a, b) => b.createdAt - a.createdAt);
    
    const start = (page - 1) * limit;
    const slice = sorted.slice(start, start + limit);

    // Обогащаем пользователей данными о лайках (упрощенная версия)
    const enrichedUsers = slice.map(user => ({
      ...user,
      canTeachSkills: user.canTeachSkillIds || [],
      wantsToLearnSkills: user.wantsToLearnSkillIds || [],
      primarySkillLikesCount: 0,
    }));

    return new Response(JSON.stringify({
      users: enrichedUsers,
      hasMore: start + limit < sorted.length,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching recommended users:', error);
    return new Response(JSON.stringify({ message: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

