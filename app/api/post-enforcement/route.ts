import { createAdminClient } from '@/lib/supabase/server-admin';
import { NextResponse } from 'next/server';
// import { z } from 'zod';

// TODO: Add schema validation if needed
// const Body = z.object({
//   latitude: z.number().min(-90).max(90),
//   longitude: z.number().min(-180).max(180),
//   enforcement_report_time: z.string().datetime().optional().nullable(),
// });

export async function POST(req: Request) {
  // 1) Parse request body
  const json = await req.json().catch(() => null);

  const { latitude, longitude, observedAt } = json ?? {};

  // 2) Basic validation
  if (typeof latitude !== 'number' || typeof longitude !== 'number') {
    return NextResponse.json(
      { error: 'latitude and longitude are required numbers' },
      { status: 400 }
    );
  }

  // 3) Insert using admin client (bypasses RLS)
  const sb = createAdminClient();
  const { data, error } = await sb
    .from('enforcement_sightings')
    .insert({
      latitude,
      longitude,
      user_id: null, // anonymous for now
      enforcement_report_time: observedAt
        ? new Date(observedAt).toISOString() // timestamptz is fine with ISO
        : null
    })
    .select('*')
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // 4) Respond with created enforcement report
  return NextResponse.json({ enforcement: data }, { status: 201 });
}

// Optional: block GET requests
export function GET() {
  return NextResponse.json({ error: 'Use client→Supabase for GET.' }, { status: 405 });
}
