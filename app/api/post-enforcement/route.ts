import { NextRequest, NextResponse } from 'next/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    console.log('API route called: /api/post-enforcement');

    const body = await request.json();
    console.log('Request body:', body);

    const { latitude, longitude, observedAt, notes } = body; 
    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      console.error('Validation failed: latitude/longitude must be numbers');
      return NextResponse.json(
        { error: 'latitude and longitude are required numbers' },
        { status: 400 }
      );
    }

    console.log('All required fields present');

    // Create Supabase admin client with service role key (server-side only!)
    const supabase = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: { autoRefreshToken: false, persistSession: false },
      }
    );

    console.log('Created admin Supabase client with service role key');

    // Prepare insert payload
    const insertPayload: Record<string, any> = {
      user_id: null,          // anonymous submission
      latitude,
      longitude,
    };

    // If client supplied a valid ISO timestamp, use it; otherwise let DB default apply
    if (observedAt) {
      const ts = new Date(observedAt);
      if (isNaN(ts.getTime())) {
        console.warn('Invalid observedAt provided; ignoring and letting DB default now()');
      } else {
        insertPayload.enforcement_reported_at = ts.toISOString();
      }
    }

    // If you added a 'notes' column in the table, include it:
    if (typeof notes === 'string' && notes.trim().length > 0) {
      insertPayload.notes = notes.trim();
    }

    console.log('Enforcement Report Received:', {
      ...insertPayload,
      timestamp_server: new Date().toISOString(),
    });

    // Insert row (service role bypasses RLS)
    const { data, error } = await supabase
      .from('enforcement_sightings')
      .insert(insertPayload)
      .select('enforcement_id')
      .single();

    if (error) {
      console.error('Database insert error:', error);
      throw error;
    }

    console.log('Enforcement sighting saved to database:', data);

    return NextResponse.json(
      {
        success: true,
        message: 'Enforcement report submitted successfully',
        data: {
          enforcement_id: data?.enforcement_id ?? null,
          latitude,
          longitude,
          observedAt: insertPayload.enforcement_reported_at ?? 'db_default_now()',
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error processing enforcement report:', error);
    return NextResponse.json(
      { error: 'Failed to submit enforcement report' },
      { status: 500 }
    );
  }
}
