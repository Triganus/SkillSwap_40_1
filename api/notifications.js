export default async function handler(request) {
  const url = new URL(request.url);
  
  if (request.method === 'GET') {
    // Возвращаем пустой список уведомлений
    return new Response(JSON.stringify({ new: [], viewed: [] }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } else if (request.method === 'PATCH' && url.pathname.includes('mark-all-viewed')) {
    // Отмечаем все как прочитанные
    return new Response(JSON.stringify({ new: [], viewed: [] }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } else {
    return new Response(JSON.stringify({ message: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

