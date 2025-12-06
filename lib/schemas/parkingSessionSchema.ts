import { z } from 'zod';

export const ParkingSessionSchema = z.object({
  parking_session_id: z.uuid(),
  user_id: z.uuid(),
  latitude: z.number(),
  longitude: z.number(),
  parking_session_start_datetime: z.coerce.date(), // supabase-format: '2025-12-05T22:27:35.627958+00:00'
  // Date() can use thisDate.getDate(), getHours(), etc.
});

// Zod created type from schema
export type ParkingSession = z.infer<typeof ParkingSessionSchema>;
