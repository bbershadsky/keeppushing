import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ cookies }) => {
  const userCookie = cookies.get('user-session');
  
  if (!userCookie) {
    return new Response(JSON.stringify({ user: null }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  try {
    const user = JSON.parse(userCookie.value);
    return new Response(JSON.stringify({ user }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch {
    return new Response(JSON.stringify({ user: null }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
