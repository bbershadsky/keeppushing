import type { APIRoute } from 'astro';
import { getUserChallenge, createUserChallenge, updateUserChallenge, getChallengeWithCompletions } from '../../lib/db';

// Get user's active challenge
export const GET: APIRoute = async ({ cookies }) => {
  const userCookie = cookies.get('user-session');
  
  if (!userCookie) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  try {
    const user = JSON.parse(userCookie.value);
    const challenge = await getChallengeWithCompletions(user.id);
    
    return new Response(JSON.stringify({ challenge }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching challenge:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch challenge' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// Create or update challenge
export const POST: APIRoute = async ({ request, cookies }) => {
  const userCookie = cookies.get('user-session');
  
  if (!userCookie) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  try {
    const user = JSON.parse(userCookie.value);
    const body = await request.json();
    const { startDate, currentPushups, targetPushups } = body;
    
    if (!startDate || !currentPushups || !targetPushups) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Check if user already has a challenge
    const existingChallenge = await getUserChallenge(user.id);
    
    let challenge;
    if (existingChallenge) {
      // Update existing challenge
      challenge = await updateUserChallenge(user.id, startDate, currentPushups, targetPushups);
    } else {
      // Create new challenge
      challenge = await createUserChallenge(user.id, startDate, currentPushups, targetPushups);
    }
    
    return new Response(JSON.stringify({ challenge }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error saving challenge:', error);
    return new Response(JSON.stringify({ error: 'Failed to save challenge' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
