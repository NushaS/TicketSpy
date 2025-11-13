// this hook is not being used anywhere

import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import type { Filters } from '@/lib/utils/filterTickets';

/**
 * Fetch tickets from Supabase. Supports a simple server-side timeRange filter
 * (days/weeks/months) to reduce the amount of data returned. More complex
 * filters (weekday/time-of-day) remain client-side for now.
 */
export function useTicketTable(filters?: Pick<Filters, 'timeRange'>) {
  const fetchTickets = async () => {
    const supabase = createClient();
    let query = supabase.from('tickets').select('*');

    // Server-side timeRange filtering: compute cutoff ISO and apply .gte
    if (filters?.timeRange) {
      const now = new Date();
      const cutoff = new Date(now);
      const { amount, unit } = filters.timeRange;
      if (unit === 'days') cutoff.setDate(now.getDate() - amount);
      else if (unit === 'weeks') cutoff.setDate(now.getDate() - amount * 7);
      else if (unit === 'months') cutoff.setMonth(now.getMonth() - amount);

      // store cutoff as ISO date-only (UTC) to compare against ticket_report_date
      const cutoffISO = cutoff.toISOString();
      query = query.gte('ticket_report_date', cutoffISO);
    }

    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
  };

  const query = useQuery({
    queryKey: ['tickets', filters ?? null],
    queryFn: fetchTickets,
    staleTime: 1000 * 60,
  });

  return {
    ...query,
    refetch: query.refetch,
  };
}
