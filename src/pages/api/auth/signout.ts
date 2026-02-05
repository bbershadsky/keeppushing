import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ cookies }) => {
  // Clear all auth cookies
  cookies.delete('user-session', { path: '/' });
  cookies.delete('access-token', { path: '/' });
  
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};
