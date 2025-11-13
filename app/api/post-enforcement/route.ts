import { createAdminClient } from '@/lib/supabase/server-admin';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  if (!json) {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { latitude, longitude, user_id } = json as {
    latitude?: number;
    longitude?: number;
    user_id?: string | null;
  };

  if (typeof latitude !== 'number' || typeof longitude !== 'number') {
    return NextResponse.json(
      { error: 'latitude and longitude are required numbers' },
      { status: 400 }
    );
  }

  const sb = createAdminClient();
  const reported_at = new Date().toISOString();

  const { data, error } = await sb
    .from('enforcement_sightings')
    .insert({ latitude, longitude, user_id: user_id ?? null, reported_at })
    .select('*')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ enforcement: data }, { status: 201 });
}

export function GET() {
  return NextResponse.json({ error: 'Use client→Supabase for GET.' }, { status: 405 });
}
