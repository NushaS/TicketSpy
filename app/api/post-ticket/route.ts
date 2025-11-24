import { createAdminClient } from '@/lib/supabase/server-admin';
import { logNearbyParkingSessions } from '@/lib/server/nearbyParkingSessions';
import { NextResponse } from 'next/server';
//import { z } from 'zod';

// TODO : Validate incoming request body

// const Body = z.object({
//   latitude: z.number().min(-90).max(90),
//   longitude: z.number().min(-180).max(180),
//   ticket_report_date: z.string().datetime().optional().nullable(), // ISO date string
//   ticket_report_hour: z
//     .string()
//     .regex(/^\d{2}:\d{2}$/)
//     .optional()
//     .nullable(), // e.g., "14:30"
//   violation_type: z.enum(['default parking ticket']).optional().nullable(), // current enum
// });

export async function POST(req: Request) {
  // 1) Parse & validate
  const json = await req.json().catch(() => null);
  if (!json) {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { latitude, longitude, ticket_report_date, ticket_report_hour, violation_type } = json;

  // 2) Insert using admin client
  const sb = createAdminClient();
  const { data, error } = await sb
    .from('tickets')
    .insert({
      latitude,
      longitude,
      ticket_report_date,
      ticket_report_hour,
      violation_type: violation_type ?? 'default parking ticket',
      user_id: null, // optional: fill later if needed
    })
    .select('*')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // 3) Trigger nearby parking session check server-side
  if (typeof latitude === 'number' && typeof longitude === 'number') {
    try {
      await logNearbyParkingSessions(latitude, longitude);
    } catch (err) {
      console.error('Failed to log nearby parking sessions:', err);
    }
  }

  // 4) Respond with created ticket
  return NextResponse.json({ ticket: data }, { status: 201 });
}

// Optional: block GET
export function GET() {
  return NextResponse.json({ error: 'Use client→Supabase for GET.' }, { status: 405 });
}
