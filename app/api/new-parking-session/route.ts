import { createAdminClient } from '@/lib/supabase/server-admin';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  // 1) Parse & validate
  const json = await req.json().catch(() => null);

  if (!json) {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { user_id, latitude, longitude } = json;

  // Validate required fields
  if (latitude === undefined || longitude === undefined) {
    return NextResponse.json(
      { error: 'Missing required fields: latitude and longitude' },
      { status: 400 }
    );
  }

  // 2) Check for existing active parking session for this user
  const sb = createAdminClient();

  // First, end any existing active sessions for this user
  await sb.from('parking_sessions').delete().eq('user_id', user_id);

  // 3) Insert new parking session
  const { data, error } = await sb
    .from('parking_sessions')
    .insert({
      user_id: user_id ?? null,
      latitude,
      longitude,
    })
    .select('*')
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // 4) Respond with created parking session
  return NextResponse.json({ parking_session: data }, { status: 201 });
}
