// Simple auth helpers for Google OAuth
// Uses direct Google OAuth without heavy auth libraries

export interface AuthUser {
  id: string;
  displayName?: string;
  primaryEmail?: string;
  picture?: string;
}

export function getUserFromCookies(cookies: { get: (name: string) => { value: string } | undefined }): AuthUser | null {
const userCookie = cookies.get('user-session'); 
  if (!userCookie) return null;
  
  try {
    return JSON.parse(userCookie.value);
  } catch {
    return null;
  }
}
