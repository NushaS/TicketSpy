// Replaces app/test-ticket2/page.tsx
import { handlePostTicket, TicketPayload } from '@/lib/server/handlePostTicket';
import { createAdminClient } from '@/lib/supabase/server-admin';
import { notifyUsers } from '@/lib/server/nearbySessionsAndBookmarks';
import { ViolationType } from '@/lib/enums/ticketViolationType';

jest.mock('@/lib/supabase/server-admin');
jest.mock('@/lib/server/nearbySessionsAndBookmarks');

const mockInsert = jest.fn();

describe('handlePostTicket', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (createAdminClient as jest.Mock).mockReturnValue({
      from: jest.fn().mockReturnValue({
        insert: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            single: mockInsert,
          }),
        }),
      }),
    });
    (notifyUsers as jest.Mock).mockResolvedValue(undefined);
  });

  it('creates a ticket successfully', async () => {
    mockInsert.mockResolvedValue({
      data: { ticket_id: 'random-uuid', latitude: 47.6062, longitude: -122.3321 },
      error: null,
    });

    const payload: TicketPayload = {
      latitude: 47.6062,
      longitude: -122.3321,
      ticket_report_date: '2025-12-05',
      ticket_report_hour: '22:27:35',
      ticket_violation_type: ViolationType.Other,
    };

    const result = await handlePostTicket(payload);

    expect(result).toBeDefined();
    expect(result.ticket_id).toBe('random-uuid');
    expect(mockInsert).toHaveBeenCalled();
    expect(notifyUsers).toHaveBeenCalled();
  });

  it('throws when Supabase insert fails', async () => {
    mockInsert.mockResolvedValue({
      data: null,
      error: { message: 'DB error' },
    });

    const payload: TicketPayload = { latitude: 47.6062, longitude: -122.3321 };

    await expect(handlePostTicket(payload)).rejects.toEqual({ message: 'DB error' });
    expect(mockInsert).toHaveBeenCalled();
    expect(notifyUsers).not.toHaveBeenCalled();
  });
});
