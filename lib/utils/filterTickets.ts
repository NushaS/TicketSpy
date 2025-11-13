export type TimeUnit = 'days' | 'weeks' | 'months';

export type Filters = {
  timeRange?: { amount: number; unit: TimeUnit } | null;
  weekdays?: { monThu: boolean; friSun: boolean } | null;
  timesOfDay?: { morning: boolean; afternoon: boolean; night: boolean } | null;
};

type TicketRow = Record<string, any> & {
  latitude?: number | string | null;
  longitude?: number | string | null;
  ticket_report_date?: string | null;
  ticket_report_hour?: string | number | null;
};

function parseHour(value?: string | number | null): number | null {
  if (value == null) return null;
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  const s = String(value).trim();
  const part = s.split(':')[0];
  const n = Number(part);
  return Number.isFinite(n) ? Math.max(0, Math.min(23, Math.floor(n))) : null;
}

function withinTimeRange(
  dateStr: string | undefined | null,
  range?: Filters['timeRange']
): boolean {
  if (!range) return true;
  if (!dateStr) return false;
  const t = Date.parse(dateStr);
  if (Number.isNaN(t)) return false;
  const d = new Date(t);
  const now = new Date();
  const cutoff = new Date(now);
  if (range.unit === 'days') cutoff.setDate(now.getDate() - range.amount);
  else if (range.unit === 'weeks') cutoff.setDate(now.getDate() - range.amount * 7);
  else if (range.unit === 'months') cutoff.setMonth(now.getMonth() - range.amount);
  return d >= cutoff;
}

function matchesWeekday(
  dateStr: string | undefined | null,
  weekdays?: Filters['weekdays']
): boolean {
  if (!weekdays) return true;
  if (!dateStr) return false;
  const t = Date.parse(dateStr);
  if (Number.isNaN(t)) return false;
  const d = new Date(t);
  const dow = d.getDay(); // 0=Sun,1=Mon,...6=Sat
  if (weekdays.monThu && dow >= 1 && dow <= 4) return true;
  if (weekdays.friSun && (dow === 5 || dow === 6 || dow === 0)) return true;
  return false;
}

function matchesTimeOfDay(hour: number | null, timesOfDay?: Filters['timesOfDay']): boolean {
  if (!timesOfDay) return true;
  if (hour === null) return false;
  if (timesOfDay.morning && hour >= 6 && hour < 12) return true;
  if (timesOfDay.afternoon && hour >= 12 && hour < 18) return true;
  if (timesOfDay.night) {
    if (hour >= 18 && hour <= 23) return true;
    if (hour >= 0 && hour < 6) return true;
  }
  return false;
}

export function filterTickets(rows: TicketRow[] = [], filters?: Filters) {
  return (rows ?? [])
    .filter((r) => {
      const lat = Number(r.latitude);
      const lon = Number(r.longitude);
      if (!Number.isFinite(lat) || !Number.isFinite(lon)) return false;

      if (filters?.timeRange) {
        if (!withinTimeRange(r.ticket_report_date ?? r.date ?? undefined, filters.timeRange))
          return false;
      }

      if (filters?.weekdays) {
        if (!matchesWeekday(r.ticket_report_date ?? r.date ?? undefined, filters.weekdays))
          return false;
      }

      if (filters?.timesOfDay) {
        const hour = parseHour(r.ticket_report_hour ?? r.time ?? undefined);
        if (!matchesTimeOfDay(hour, filters.timesOfDay)) return false;
      }

      return true;
    })
    .map((r) => ({
      latitude: Number(r.latitude),
      longitude: Number(r.longitude),
      intensity: 1,
    }));
}
