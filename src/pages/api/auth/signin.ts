import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request, redirect }) => {
  const url = new URL(request.url);
  
  const clientId = import.meta.env.GOOGLE_CLIENT_ID;
  
  if (!clientId) {
    return new Response(JSON.stringify({ error: 'Google OAuth not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  // Build Google OAuth URL
  const redirectUri = `${url.origin}/api/auth/callback`;
  const scope = 'openid email profile';
  const state = crypto.randomUUID(); // CSRF protection
  
  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('scope', scope);
  authUrl.searchParams.set('state', state);
  authUrl.searchParams.set('access_type', 'offline');
  authUrl.searchParams.set('prompt', 'consent');
  
  return redirect(authUrl.toString(), 302);
};
