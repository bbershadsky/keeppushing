import { neon } from '@neondatabase/serverless';

// Create a SQL query function using the Neon serverless driver
const sql = neon(import.meta.env.DATABASE_URL);

export { sql };

// Types for our database tables
export interface UserChallenge {
  id: string;
  user_id: string;
  start_date: string;
  current_pushups: number;
  target_pushups: number;
  created_at: string;
  updated_at: string;
}

export interface DayCompletion {
  id: string;
  challenge_id: string;
  day_number: number;
  completed_at: string;
}

// Database helper functions
export async function getUserChallenge(userId: string): Promise<UserChallenge | null> {
  const result = await sql`
    SELECT * FROM user_challenges WHERE user_id = ${userId} LIMIT 1
  `;
  return result[0] as UserChallenge || null;
}

export async function createUserChallenge(
  userId: string,
  startDate: string,
  currentPushups: number,
  targetPushups: number
): Promise<UserChallenge> {
  const result = await sql`
    INSERT INTO user_challenges (user_id, start_date, current_pushups, target_pushups)
    VALUES (${userId}, ${startDate}, ${currentPushups}, ${targetPushups})
    RETURNING *
  `;
  return result[0] as UserChallenge;
}

export async function updateUserChallenge(
  userId: string,
  startDate: string,
  currentPushups: number,
  targetPushups: number
): Promise<UserChallenge> {
  const result = await sql`
    UPDATE user_challenges 
    SET start_date = ${startDate}, current_pushups = ${currentPushups}, target_pushups = ${targetPushups}
    WHERE user_id = ${userId}
    RETURNING *
  `;
  return result[0] as UserChallenge;
}

export async function getCompletedDays(challengeId: string): Promise<DayCompletion[]> {
  const result = await sql`
    SELECT * FROM day_completions WHERE challenge_id = ${challengeId} ORDER BY day_number
  `;
  return result as DayCompletion[];
}

export async function completeDay(challengeId: string, dayNumber: number): Promise<DayCompletion> {
  const result = await sql`
    INSERT INTO day_completions (challenge_id, day_number)
    VALUES (${challengeId}, ${dayNumber})
    ON CONFLICT (challenge_id, day_number) DO NOTHING
    RETURNING *
  `;
  return result[0] as DayCompletion;
}

export async function uncompleteDay(challengeId: string, dayNumber: number): Promise<void> {
  await sql`
    DELETE FROM day_completions WHERE challenge_id = ${challengeId} AND day_number = ${dayNumber}
  `;
}

export async function getChallengeWithCompletions(userId: string) {
  const challenge = await getUserChallenge(userId);
  if (!challenge) return null;
  
  const completions = await getCompletedDays(challenge.id);
  const completedDays = completions.map(c => c.day_number);
  
  return {
    ...challenge,
    completedDays
  };
}
