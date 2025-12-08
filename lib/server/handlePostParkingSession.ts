import { createAdminClient } from '@/lib/supabase/server-admin';

export async function handlePostParkingSession(data: {
  user_id: string;
  latitude: number;
  longitude: number;
}) {
  const { user_id, latitude, longitude } = data;

  if (latitude === undefined || longitude === undefined) {
    throw new Error('Missing required fields: latitude and longitude');
  }

  const sb = createAdminClient();

  // End existing sessions
  await sb.from('parking_sessions').delete().eq('user_id', user_id);

  // Insert new session
  const { data: sessionData, error } = await sb
    .from('parking_sessions')
    .insert({ user_id, latitude, longitude })
    .select('*')
    .single();

  if (error) throw new Error(error.message);

  return sessionData;
}
