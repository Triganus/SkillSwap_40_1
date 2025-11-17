import { usersData } from '../directories/data.js';

export default async function handler(request) {
  if (request.method !== 'GET') {
    return new Response(JSON.stringify({ message: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const url = new URL(request.url);
    let users = usersData.users || [];

    // Простая фильтрация
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const limit = parseInt(url.searchParams.get('limit') || '9', 10);
    const q = url.searchParams.get('q');
    const subcategories = url.searchParams.get('subcategories');
    const cities = url.searchParams.get('cities');
    const gender = url.searchParams.get('gender');
    const sort = url.searchParams.get('sort') || 'newest';

    // Фильтрация по поисковому запросу
    if (q) {
      const query = q.toLowerCase();
      users = users.filter(user => 
        user.name.toLowerCase().includes(query) ||
        user.bio.toLowerCase().includes(query)
      );
    }

    // Фильтрация по подкатегориям
    if (subcategories) {
      const subcategoryIds = subcategories.split(',').filter(Boolean);
      users = users.filter(user => 
        subcategoryIds.some(id => 
          user.canTeachSkillIds.includes(id) || 
          user.wantsToLearnSkillIds.includes(id)
        )
      );
    }

    // Фильтрация по городам
    if (cities) {
      const cityIds = cities.split(',').filter(Boolean);
      users = users.filter(user => cityIds.includes(user.cityId));
    }

    // Фильтрация по полу
    if (gender) {
      users = users.filter(user => user.gender === gender);
    }

    // Сортировка
    if (sort === 'newest') {
      users.sort((a, b) => b.createdAt - a.createdAt);
    } else if (sort === 'oldest') {
      users.sort((a, b) => a.createdAt - b.createdAt);
    }

    const total = users.length;
    const start = (page - 1) * limit;
    const slice = users.slice(start, start + limit);

    // Обогащаем пользователей данными
    const enrichedUsers = slice.map(user => ({
      ...user,
      canTeachSkills: user.canTeachSkillIds || [],
      wantsToLearnSkills: user.wantsToLearnSkillIds || [],
      primarySkillLikesCount: 0,
    }));

    return new Response(JSON.stringify({
      users: enrichedUsers,
      hasMore: start + limit < total,
      total,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return new Response(JSON.stringify({ message: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

