import { createAdminClient } from '@/lib/supabase/server-admin';
import { notifyUsers } from '@/lib/server/nearbySessionsAndBookmarks';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  // 1) Parse & validate
  const json = await req.json().catch(() => null);

  if (!json) {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { user_id, latitude, longitude, sighting_time, observedAt } = json;

  // Validate required fields
  if (latitude === undefined || longitude === undefined) {
    return NextResponse.json(
      { error: 'Missing required fields: latitude and longitude' },
      { status: 400 }
    );
  }

  // 2) Insert using admin client
  const sb = createAdminClient();
  // Map the incoming `sighting_time` to the DB column that exists
  // (some routes / migrations used `enforcement_report_time`). Use
  // `enforcement_report_time` here to match the current schema.
  const { data, error } = await sb
    .from('enforcement_sightings')
    .insert({
      user_id: user_id ?? null,
      latitude,
      longitude,
      enforcement_report_time:
        sighting_time || observedAt ? new Date(sighting_time || observedAt).toISOString() : null,
    })
    .select('*')
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // 3) Notify nearby users (bookmarks/parking)
  try {
    const alertId =
      data?.enforcement_id ?? (data as any)?.enforcement_sighting_id ?? (data as any)?.id ?? null;
    const observedAtIso =
      sighting_time || observedAt ? new Date(sighting_time || observedAt).toISOString() : undefined;
    await notifyUsers(latitude, longitude, observedAtIso, alertId ?? undefined);
  } catch (err) {
    console.error('Failed to notify users for enforcement sighting:', err);
  }

  // 4) Respond with created enforcement sighting
  return NextResponse.json({ enforcement: data }, { status: 201 });
}

// Optional: block GET
export function GET() {
  return NextResponse.json({ error: 'Use POST to create enforcement sightings.' }, { status: 405 });
}
