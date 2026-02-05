import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request, redirect, cookies }) => {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const error = url.searchParams.get('error');
  
  if (error) {
    console.error('OAuth error:', error);
    return redirect('/?error=oauth_denied', 302);
  }
  
  if (!code) {
    return redirect('/?error=no_code', 302);
  }
  
  try {
    const clientId = import.meta.env.GOOGLE_CLIENT_ID;
    const clientSecret = import.meta.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = `${url.origin}/api/auth/callback`;
    
    // Exchange code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });
    
    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('Token exchange failed:', errorText);
      return redirect('/?error=token_failed', 302);
    }
    
    const tokens = await tokenResponse.json();
    
    // Get user info from Google
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
    
    if (!userResponse.ok) {
      console.error('Failed to get user info');
      return redirect('/?error=user_info_failed', 302);
    }
    
    const googleUser = await userResponse.json();
    
    // Create user session object
    const user = {
      id: googleUser.id,
      displayName: googleUser.name,
      primaryEmail: googleUser.email,
      picture: googleUser.picture,
    };
    
    // Set session cookie
    const cookieOptions = {
      httpOnly: false, // Allow client to read for display
      secure: import.meta.env.PROD,
      sameSite: 'lax' as const,
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    };
    
    cookies.set('user-session', JSON.stringify(user), cookieOptions);
    
    // Also store access token for API calls (httpOnly for security)
    cookies.set('access-token', tokens.access_token, {
      ...cookieOptions,
      httpOnly: true,
    });
    
    return redirect('/', 302);
  } catch (error) {
    console.error('Auth callback error:', error);
    return redirect('/?error=auth_failed', 302);
  }
};
