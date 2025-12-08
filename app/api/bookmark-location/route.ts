import { createAdminClient } from '@/lib/supabase/server-admin';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  // 1) Parse & validate
  const json = await req.json().catch(() => null);

  if (!json) {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { latitude, longitude, name } = json;

  // Validate required fields
  if (latitude === undefined || longitude === undefined) {
    return NextResponse.json(
      { error: 'Missing required fields: latitude and longitude' },
      { status: 400 }
    );
  }

  const supabase = await createServerClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 2) Insert using admin client
  const sb = createAdminClient();

  const payload: Record<string, unknown> = {
    user_id: user.id,
    latitude,
    longitude,
  };

  if (typeof name === 'string' && name.trim()) {
    payload.name = name.trim();
  }

  const { data, error } = await sb
    .from('bookmarked_locations')
    .insert(payload)
    .select('*')
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // 3) Respond with created bookmark
  return NextResponse.json({ bookmark: data }, { status: 201 });
}

// Optional: block GET
export function GET() {
  return NextResponse.json({ error: 'Use POST to create bookmarks.' }, { status: 405 });
}
