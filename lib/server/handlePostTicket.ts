// lib/server/handlePostTicket.ts
import { createAdminClient } from '@/lib/supabase/server-admin';
import { notifyUsers } from '@/lib/server/nearbySessionsAndBookmarks';
import { ViolationType, isValidViolationType } from '@/lib/enums/ticketViolationType';

export interface TicketPayload {
  latitude: number;
  longitude: number;
  ticket_report_date?: string;
  ticket_report_hour?: string;
  ticket_violation_type?: string;
}

export async function handlePostTicket(payload: TicketPayload) {
  const { latitude, longitude, ticket_report_date, ticket_report_hour, ticket_violation_type } =
    payload;

  const sb = createAdminClient();

  const { data, error } = await sb
    .from('tickets')
    .insert({
      latitude,
      longitude,
      ticket_report_date,
      ticket_report_hour,
      ticket_violation_type: isValidViolationType(ticket_violation_type)
        ? ticket_violation_type
        : ViolationType.Other,
      user_id: null, // currently null for testing
    })
    .select('*')
    .single();

  if (error) throw error;

  const ticket_report_timestamp =
    ticket_report_date && ticket_report_hour
      ? `${ticket_report_date}T${ticket_report_hour}`
      : new Date().toISOString();

  if (typeof latitude === 'number' && typeof longitude === 'number') {
    try {
      await notifyUsers(latitude, longitude, ticket_report_timestamp, data.ticket_id);
    } catch (err) {
      console.error('Failed to log nearby parking sessions:', err);
    }
  }

  return data;
}
