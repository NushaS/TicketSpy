import { createAdminClient } from '@/lib/supabase/server-admin';
import { notifyUsers } from '@/lib/server/nearbySessionsAndBookmarks';
import { NextResponse } from 'next/server';
import { ViolationType, isValidViolationType } from '@/lib/enums/ticketViolationType';

export async function POST(req: Request) {
  // 1) Parse & validate
  const json = await req.json().catch(() => null);
  if (!json) {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { latitude, longitude, ticket_report_date, ticket_report_hour, ticket_violation_type } =
    json;

  // 2) Insert using admin client
  const sb = createAdminClient();
  const { data, error } = await sb
    .from('tickets')
    .insert({
      latitude,
      longitude,
      ticket_report_date,
      ticket_report_hour,
      ticket_violation_type: isValidViolationType(ticket_violation_type) // Semicolon here is Object assigning, not type assigning
        ? ticket_violation_type
        : ViolationType.Other,
      user_id: null,
    })
    .select('*')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  let ticket_report_timestamp: string | null = null;
  if (ticket_report_date && ticket_report_hour) {
    ticket_report_timestamp = `${ticket_report_date}T${ticket_report_hour}`;
  }

  // 3) Trigger nearby parking session check server-side
  if (typeof latitude === 'number' && typeof longitude === 'number') {
    try {
      await notifyUsers(
        latitude,
        longitude,
        ticket_report_timestamp ?? new Date().toISOString(),
        data.ticket_id
      );
    } catch (err) {
      console.error('Failed to log nearby parking sessions:', err);
    }
  }

  // 4) Respond with created ticket
  return NextResponse.json({ ticket: data }, { status: 201 });
}

// block GET
export function GET() {
  return NextResponse.json({ error: 'Use client→Supabase for GET.' }, { status: 405 });
}
