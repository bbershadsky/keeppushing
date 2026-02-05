import type { APIRoute } from 'astro';
import { getUserChallenge, completeDay, uncompleteDay } from '../../lib/db';

// Mark a day as complete
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
    const { dayNumber } = body;
    
    if (!dayNumber || dayNumber < 1 || dayNumber > 30) {
      return new Response(JSON.stringify({ error: 'Invalid day number' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const challenge = await getUserChallenge(user.id);
    
    if (!challenge) {
      return new Response(JSON.stringify({ error: 'No active challenge' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const completion = await completeDay(challenge.id, dayNumber);
    
    return new Response(JSON.stringify({ success: true, completion }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error completing day:', error);
    return new Response(JSON.stringify({ error: 'Failed to complete day' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// Unmark a day (remove completion)
export const DELETE: APIRoute = async ({ request, cookies }) => {
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
    const { dayNumber } = body;
    
    if (!dayNumber || dayNumber < 1 || dayNumber > 30) {
      return new Response(JSON.stringify({ error: 'Invalid day number' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const challenge = await getUserChallenge(user.id);
    
    if (!challenge) {
      return new Response(JSON.stringify({ error: 'No active challenge' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    await uncompleteDay(challenge.id, dayNumber);
    
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error uncompleting day:', error);
    return new Response(JSON.stringify({ error: 'Failed to uncomplete day' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
