// Единая API функция для всех endpoints
import { categoriesData, subcategoriesData, citiesData, gendersData, usersData } from './directories/data.js';

export default async function handler(request) {
  const url = new URL(request.url);
  // В Vercel при использовании rewrites, оригинальный путь может быть в query параметре или заголовке
  // Но проще всего использовать pathname напрямую, так как rewrites должны сохранять его
  let pathname = url.pathname;
  
  // Если pathname это просто /api, значит нужно получить путь из query или заголовка
  if (pathname === '/api' || pathname === '/api/') {
    // Пробуем получить из query параметра (если Vercel передает через rewrites)
    const pathParam = url.searchParams.get('path') || url.searchParams.get('slug');
    if (pathParam) {
      pathname = `/api/${pathParam}`;
    } else {
      // Пробуем из заголовков
      const originalPath = request.headers.get('x-vercel-original-path') || 
                           request.headers.get('x-invoke-path');
      if (originalPath) {
        pathname = originalPath.startsWith('/api') ? originalPath : `/api${originalPath}`;
      }
    }
  }
  
  const method = request.method;
  
  // Логирование для отладки
  console.log('[API Handler]', { 
    pathname, 
    method, 
    url: request.url,
    searchParams: Object.fromEntries(url.searchParams.entries()),
    headers: Object.fromEntries(request.headers.entries())
  });

  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  // Handle OPTIONS requests
  if (method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    // Directories endpoints
    if (pathname === '/api/directories/categories' && method === 'GET') {
      return new Response(JSON.stringify(categoriesData), {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    if (pathname === '/api/directories/subcategories' && method === 'GET') {
      return new Response(JSON.stringify(subcategoriesData), {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    if (pathname === '/api/directories/cities' && method === 'GET') {
      return new Response(JSON.stringify(citiesData), {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    if (pathname === '/api/directories/genders' && method === 'GET') {
      return new Response(JSON.stringify(gendersData), {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // Users endpoints
    if (pathname === '/api/users/recommended' && method === 'GET') {
      const page = parseInt(url.searchParams.get('page') || '1', 10);
      const limit = parseInt(url.searchParams.get('limit') || '9', 10);
      const users = usersData.users || [];
      const sorted = [...users].sort((a, b) => b.createdAt - a.createdAt);
      const start = (page - 1) * limit;
      const slice = sorted.slice(start, start + limit);
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
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    if (pathname === '/api/users/popular' && method === 'GET') {
      const page = parseInt(url.searchParams.get('page') || '1', 10);
      const limit = parseInt(url.searchParams.get('limit') || '3', 10);
      const users = usersData.users || [];
      const enrichedUsers = users.map(user => ({
        ...user,
        canTeachSkills: user.canTeachSkillIds || [],
        wantsToLearnSkills: user.wantsToLearnSkillIds || [],
        primarySkillLikesCount: 0,
      }));
      const sorted = [...enrichedUsers].sort((a, b) => {
        const likesA = a.primarySkillLikesCount ?? 0;
        const likesB = b.primarySkillLikesCount ?? 0;
        if (likesB !== likesA) return likesB - likesA;
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
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    if (pathname === '/api/users/new' && method === 'GET') {
      const page = parseInt(url.searchParams.get('page') || '1', 10);
      const limit = parseInt(url.searchParams.get('limit') || '3', 10);
      const users = usersData.users || [];
      const sorted = [...users].sort((a, b) => b.createdAt - a.createdAt);
      const start = (page - 1) * limit;
      const slice = sorted.slice(start, start + limit);
      const enrichedUsers = slice.map(user => ({
        ...user,
        canTeachSkills: user.canTeachSkillIds || [],
        wantsToLearnSkills: user.wantsToLearnSkillIds || [],
        primarySkillLikesCount: 0,
      }));

      return new Response(JSON.stringify({
        users: enrichedUsers,
        hasMore: start + limit < sorted.length,
        total: sorted.length,
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // /api/users with filtering
    if (pathname === '/api/users' && method === 'GET') {
      const page = parseInt(url.searchParams.get('page') || '1', 10);
      const limit = parseInt(url.searchParams.get('limit') || '9', 10);
      const q = url.searchParams.get('q');
      const subcategories = url.searchParams.get('subcategories');
      const cities = url.searchParams.get('cities');
      const gender = url.searchParams.get('gender');
      const sort = url.searchParams.get('sort') || 'newest';
      let users = usersData.users || [];

      if (q) {
        const query = q.toLowerCase();
        users = users.filter(user => 
          user.name.toLowerCase().includes(query) ||
          user.bio.toLowerCase().includes(query)
        );
      }

      if (subcategories) {
        const subcategoryIds = subcategories.split(',').filter(Boolean);
        users = users.filter(user => 
          subcategoryIds.some(id => 
            user.canTeachSkillIds.includes(id) || 
            user.wantsToLearnSkillIds.includes(id)
          )
        );
      }

      if (cities) {
        const cityIds = cities.split(',').filter(Boolean);
        users = users.filter(user => cityIds.includes(user.cityId));
      }

      if (gender) {
        users = users.filter(user => user.gender === gender);
      }

      if (sort === 'newest') {
        users.sort((a, b) => b.createdAt - a.createdAt);
      } else if (sort === 'oldest') {
        users.sort((a, b) => a.createdAt - b.createdAt);
      }

      const total = users.length;
      const start = (page - 1) * limit;
      const slice = users.slice(start, start + limit);
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
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // /api/users/:id
    const userIdMatch = pathname.match(/^\/api\/users\/([^/]+)$/);
    if (userIdMatch && method === 'GET') {
      const userId = userIdMatch[1];
      const users = usersData.users || [];
      const user = users.find(u => u.id === userId);

      if (!user) {
        return new Response(JSON.stringify({ message: 'User not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      }

      const enrichedUser = {
        ...user,
        canTeachSkills: user.canTeachSkillIds || [],
        wantsToLearnSkills: user.wantsToLearnSkillIds || [],
      };

      return new Response(JSON.stringify(enrichedUser), {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    if (userIdMatch && method === 'PATCH') {
      const userId = userIdMatch[1];
      const updateData = await request.json();
      const users = usersData.users || [];
      const userIndex = users.findIndex(u => u.id === userId);

      if (userIndex === -1) {
        return new Response(JSON.stringify({ message: 'User not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      }

      users[userIndex] = { ...users[userIndex], ...updateData };

      return new Response(JSON.stringify(users[userIndex]), {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // Auth endpoints
    if (pathname === '/api/auth/login' && method === 'POST') {
      const { email, password } = await request.json();

      if (!email || !password) {
        return new Response(JSON.stringify({ message: 'Email and password are required' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      }

      const users = usersData.users || [];
      const user = users.find(u => u.email?.toLowerCase() === email.toLowerCase()) || users[0];

      if (!user) {
        return new Response(JSON.stringify({ message: 'Invalid credentials' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      }

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
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // Registration endpoint
    if (pathname === '/api/registration/complete' && method === 'POST') {
      const body = await request.json();
      const { email, name, birthDate, gender, city, skill } = body;

      if (!email || !name) {
        return new Response(JSON.stringify({ message: 'Email and name are required' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      }

      const createdAt = Date.now();
      const userId = `user_${createdAt}`;

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
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // Notifications endpoint
    if (pathname === '/api/notifications' && method === 'GET') {
      return new Response(JSON.stringify({ new: [], viewed: [] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    if (pathname === '/api/notifications/mark-all-viewed' && method === 'PATCH') {
      return new Response(JSON.stringify({ new: [], viewed: [] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // 404 for unknown routes
    return new Response(JSON.stringify({ message: 'Not Found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  } catch (error) {
    console.error('API Error:', error);
    return new Response(JSON.stringify({ message: 'Internal server error', error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
}

