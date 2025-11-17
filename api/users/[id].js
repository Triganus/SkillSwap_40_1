export default async function handler(request) {
  const url = new URL(request.url);
  const pathParts = url.pathname.split('/');
  const userId = pathParts[pathParts.length - 1];

  if (request.method === 'GET') {
    try {
      // Получаем базовый URL для статических файлов
      const baseUrl = url.origin;
      const dataResponse = await fetch(`${baseUrl}/db/users-v2.json`);
      
      if (!dataResponse.ok) {
        throw new Error(`Failed to load users data: ${dataResponse.status}`);
      }
      
      const data = await dataResponse.json();
      const users = data.users || [];

      const user = users.find(u => u.id === userId);

      if (!user) {
        return new Response(JSON.stringify({ message: 'User not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // Обогащаем пользователя данными
      const enrichedUser = {
        ...user,
        canTeachSkills: user.canTeachSkillIds || [],
        wantsToLearnSkills: user.wantsToLearnSkillIds || [],
      };

      return new Response(JSON.stringify(enrichedUser), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('Error fetching user:', error);
      return new Response(JSON.stringify({ message: 'Internal server error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } else if (request.method === 'PATCH') {
    try {
      const updateData = await request.json();
      
      // Получаем базовый URL для статических файлов
      const baseUrl = url.origin;
      const dataResponse = await fetch(`${baseUrl}/db/users-v2.json`);
      
      if (!dataResponse.ok) {
        throw new Error(`Failed to load users data: ${dataResponse.status}`);
      }
      
      const data = await dataResponse.json();
      const users = data.users || [];

      const userIndex = users.findIndex(u => u.id === userId);

      if (userIndex === -1) {
        return new Response(JSON.stringify({ message: 'User not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      users[userIndex] = { ...users[userIndex], ...updateData };

      // В реальном приложении здесь была бы запись в БД
      // Для демо просто возвращаем обновленного пользователя
      return new Response(JSON.stringify(users[userIndex]), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('Error updating user:', error);
      return new Response(JSON.stringify({ message: 'Internal server error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } else {
    return new Response(JSON.stringify({ message: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

