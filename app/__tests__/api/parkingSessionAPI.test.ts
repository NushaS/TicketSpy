import { handlePostParkingSession } from '@/lib/server/handlePostParkingSession';
import { createAdminClient } from '@/lib/supabase/server-admin';

jest.mock('@/lib/supabase/server-admin');

describe('POST /api/new-parking-session', () => {
  let mockDelete: jest.Mock;
  let mockInsert: jest.Mock;
  let mockSelect: jest.Mock;
  let mockSingle: jest.Mock;

  beforeEach(() => {
    jest.resetAllMocks();

    // Final resolved value for insert → select → single()
    mockSingle = jest.fn().mockResolvedValue({
      data: {
        parking_session_id: '123',
        user_id: 'user-1',
        latitude: 47.6062,
        longitude: -122.3321,
      },
      error: null,
    });

    mockSelect = jest.fn(() => ({ single: mockSingle }));
    mockInsert = jest.fn(() => ({ select: mockSelect }));
    mockDelete = jest.fn(() => ({ eq: jest.fn(() => ({ delete: mockDelete })) }));

    (createAdminClient as jest.Mock).mockReturnValue({
      from: jest.fn((table: string) => {
        if (table === 'parking_sessions') {
          return {
            delete: mockDelete,
            insert: mockInsert,
          };
        }
      }),
    });
  });

  it('creates a new parking session for valid input', async () => {
    const input = {
      user_id: 'user-1',
      latitude: 47.6062,
      longitude: -122.3321,
    };

    const res = await handlePostParkingSession(input);

    expect(res).toBeDefined();
    expect(res.user_id).toBe('user-1');

    expect(mockDelete).toHaveBeenCalled(); // old sessions deleted
    expect(mockInsert).toHaveBeenCalled(); // new session inserted
    expect(mockSelect).toHaveBeenCalled();
    expect(mockSingle).toHaveBeenCalled();
  });

  it('throws error if latitude/longitude missing', async () => {
    const input = {
      user_id: 'user-1',
      latitude: undefined as any,
      longitude: undefined as any,
    };

    await expect(handlePostParkingSession(input)).rejects.toThrow(/Missing required fields/);
  });

  it('throws error if supabase insert fails', async () => {
    // Override single() to return an error once
    mockSingle.mockResolvedValueOnce({
      data: null,
      error: { message: 'DB insert failed' },
    });

    const input = {
      user_id: 'user-1',
      latitude: 47.6062,
      longitude: -122.3321,
    };

    await expect(handlePostParkingSession(input)).rejects.toThrow(/DB insert failed/);
  });
});
