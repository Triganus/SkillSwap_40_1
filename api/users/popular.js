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
    const limit = parseInt(url.searchParams.get('limit') || '3', 10);

    // Получаем базовый URL для статических файлов
    const baseUrl = url.origin;
    const dataResponse = await fetch(`${baseUrl}/db/users-v2.json`);
    
    if (!dataResponse.ok) {
      throw new Error(`Failed to load users data: ${dataResponse.status}`);
    }
    
    const data = await dataResponse.json();
    const users = data.users || [];

    // Обогащаем пользователей данными
    const enrichedUsers = users.map(user => ({
      ...user,
      canTeachSkills: user.canTeachSkillIds || [],
      wantsToLearnSkills: user.wantsToLearnSkillIds || [],
      primarySkillLikesCount: 0,
    }));

    // Сортируем по количеству лайков (популярность), затем по дате
    const sorted = [...enrichedUsers].sort((a, b) => {
      const likesA = a.primarySkillLikesCount ?? 0;
      const likesB = b.primarySkillLikesCount ?? 0;

      if (likesB !== likesA) {
        return likesB - likesA;
      }

      return b.createdAt - a.createdAt;
    });

    const start = (page - 1) * limit;
    const slice = sorted.slice(start, start + limit);

    return new Response(JSON.stringify({
      users: slice,
      hasMore: start + limit < sorted.length,
      total: sorted.length,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching popular users:', error);
    return new Response(JSON.stringify({ message: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

