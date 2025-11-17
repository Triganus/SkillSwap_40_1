export default async function handler(request) {
  if (request.method !== 'GET') {
    return new Response(JSON.stringify({ message: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const url = new URL(request.url);
    // Получаем базовый URL для статических файлов
    const baseUrl = url.origin;
    const dataResponse = await fetch(`${baseUrl}/db/cities.json`);
    
    if (!dataResponse.ok) {
      throw new Error(`Failed to load cities data: ${dataResponse.status}`);
    }
    
    const data = await dataResponse.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching cities:', error);
    return new Response(JSON.stringify({ message: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

