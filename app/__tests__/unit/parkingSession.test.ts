import { ParkingSessionSchema } from '@/lib/schemas/parkingSessionSchema'; // adjust path

describe('ParkingSessionSchema', () => {
  it('parses valid parking session data', () => {
    const validData = {
      parking_session_id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      user_id: '2c963f66-5717-4562-b3fc-3fa85f64afa6',
      latitude: 47.6062,
      longitude: -122.3321,
      parking_session_start_datetime: '2025-12-05T22:27:35.627958+00:00',
    };

    const parsed = ParkingSessionSchema.parse(validData);
    // note: return z.array(ParkingSessionSchema).parse(data); is what fetchUserParkingSessions returns

    expect(parsed.parking_session_start_datetime).toBeInstanceOf(Date);
    expect(parsed.latitude).toBe(47.6062);
    expect(parsed.longitude).toBe(-122.3321);
  });

  it('throws an error for invalid datetime', () => {
    const invalidData = {
      parking_session_id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      user_id: '2c963f66-5717-4562-b3fc-3fa85f64afa6',
      latitude: 47.6062,
      longitude: -122.3321,
      parking_session_start_datetime: 'not-a-date',
    };

    expect(() => ParkingSessionSchema.parse(invalidData)).toThrow();
  });
});
