import { createAdminClient } from '@/lib/supabase/server-admin';
import { sendNotificationEmail } from '@/lib/server/sendEmail';

function milesBetweenPoints(
  latitudeA: number,
  longitudeA: number,
  latitudeB: number,
  longitudeB: number
) {
  // Haversine distance in miles
  const toRad = (value: number) => (value * Math.PI) / 180;
  const earthRadiusMiles = 3958.8;

  const latDelta = toRad(latitudeB - latitudeA);
  const lonDelta = toRad(longitudeB - longitudeA);

  const a =
    Math.sin(latDelta / 2) * Math.sin(latDelta / 2) +
    Math.cos(toRad(latitudeA)) *
      Math.cos(toRad(latitudeB)) *
      Math.sin(lonDelta / 2) *
      Math.sin(lonDelta / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusMiles * c;
}

// type ParkingSessionRow = {
//   parking_session_id: string;
//   user_id: string | null;
//   latitude: number | null;
//   longitude: number | null;
// };

// type BookmarkRow = {
//   bookmark_id: string;
//   user_id: string | null;
//   latitude: number | null;
//   longitude: number | null;
// };

type UserRow = {
  user_id: string;
  parking_notifications_on: boolean | null;
  bookmark_notifications_on: boolean | null;
  email: string | null;
  display_name?: string | null;
  notification_distance_miles?: number | null;
};

export async function notifyUsers(
  latitude: number,
  longitude: number,
  enforcement_report_time: string | Date | undefined,
  alertId: string
) {
  const ONE_DAY_MS = 24 * 60 * 60 * 1000;
  const report_time = enforcement_report_time
    ? new Date(enforcement_report_time).getTime()
    : Date.now();
  const isRecent = Date.now() - report_time <= ONE_DAY_MS;

  if (!isRecent) {
    console.log('Skipping user notification, parking report not in last 24 hours.');
    return {
      nearbySessions: [],
      nearbyBookmarks: [],
      notifiedParkingUsers: [],
      notifiedBookmarkUsers: [],
    };
  }

  const sb = createAdminClient();

  const [
    { data: parkingSessions, error: parkingError },
    { data: bookmarks, error: bookmarkError },
  ] = await Promise.all([
    sb.from('parking_sessions').select('parking_session_id, user_id, latitude, longitude'),
    sb.from('bookmarked_locations').select('bookmark_id, user_id, latitude, longitude'),
  ]);

  if (parkingError) {
    throw new Error(`Failed to fetch parking sessions: ${parkingError.message}`);
  }
  if (bookmarkError) {
    throw new Error(`Failed to fetch bookmarked locations: ${bookmarkError.message}`);
  }

  // Pre-filter by the maximum supported radius (2 miles) to limit user lookups
  const nearbySessions =
    parkingSessions?.filter((session) => {
      const lat = Number(session.latitude);
      const lon = Number(session.longitude);
      if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
        return false;
      }

      const distanceMiles = milesBetweenPoints(latitude, longitude, lat, lon);

      return distanceMiles <= 2;
    }) ?? [];

  const nearbyBookmarks =
    bookmarks?.filter((bookmark) => {
      const lat = Number(bookmark.latitude);
      const lon = Number(bookmark.longitude);
      if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
        return false;
      }

      const distanceMiles = milesBetweenPoints(latitude, longitude, lat, lon);

      return distanceMiles <= 2;
    }) ?? [];

  const userIds = new Set<string>();
  nearbySessions.forEach((session) => {
    if (session.user_id) userIds.add(session.user_id);
  });
  nearbyBookmarks.forEach((bookmark) => {
    if (bookmark.user_id) userIds.add(bookmark.user_id);
  });

  const { data: userPrefs = [], error: userPrefsError } =
    userIds.size > 0
      ? await sb
          .from('users')
          .select(
            'user_id, parking_notifications_on, bookmark_notifications_on, email, display_name, notification_distance_miles'
          )
          .in('user_id', Array.from(userIds))
      : { data: [] as UserRow[], error: null };

  if (userPrefsError) {
    throw new Error(`Failed to fetch user notification preferences: ${userPrefsError.message}`);
  }

  const userMap = new Map<string, UserRow>();
  userPrefs?.forEach((user) => {
    userMap.set(user.user_id, user);
  });

  const notifiedParkingUsers: string[] = [];
  const notifiedBookmarkUsers: string[] = [];
  const emailSends: Promise<unknown>[] = [];
  const bookmarkNotifications = new Map<
    string,
    { bookmarkIds: string[]; latitude?: number | null; longitude?: number | null }
  >();

  nearbySessions.forEach((session) => {
    if (!session.user_id) return;
    const user = userMap.get(session.user_id);
    if (!user) return;
    // respect the user's distance preference per session
    const distanceMiles = milesBetweenPoints(
      latitude,
      longitude,
      session.latitude as number,
      session.longitude as number
    );
    const allowedDistance = Number(user.notification_distance_miles ?? 1);
    if (user.parking_notifications_on && distanceMiles <= allowedDistance) {
      notifiedParkingUsers.push(session.user_id);
      if (user.email) {
        emailSends.push(
          sendNotificationEmail({
            to: user.email,
            subject: 'TicketSpy: Parking alert near your parked car',
            alertId,
          }).catch((err) => {
            console.error('Failed to send parking notification email:', err);
          })
        );
      }
      console.log(
        `Parking notification sent to user ${session.user_id} (session ${session.parking_session_id}, distance ${distanceMiles.toFixed(2)} mi, threshold ${allowedDistance} mi)`
      );
    }
  });

  nearbyBookmarks.forEach((bookmark) => {
    if (!bookmark.user_id) return;
    const user = userMap.get(bookmark.user_id);
    if (!user) return;
    const distanceMiles = milesBetweenPoints(
      latitude,
      longitude,
      bookmark.latitude as number,
      bookmark.longitude as number
    );
    const allowedDistance = Number(user.notification_distance_miles ?? 1);
    if (
      user.bookmark_notifications_on &&
      distanceMiles <= allowedDistance &&
      !notifiedParkingUsers.includes(bookmark.user_id)
    ) {
      notifiedBookmarkUsers.push(bookmark.user_id);
      const existing = bookmarkNotifications.get(bookmark.user_id) ?? {
        bookmarkIds: [],
        latitude: undefined,
        longitude: undefined,
      };
      existing.bookmarkIds.push(String(bookmark.bookmark_id));
      // keep first lat/long for context if present
      if (existing.latitude === undefined && typeof bookmark.latitude === 'number')
        existing.latitude = bookmark.latitude;
      if (existing.longitude === undefined && typeof bookmark.longitude === 'number')
        existing.longitude = bookmark.longitude;
      bookmarkNotifications.set(bookmark.user_id, existing);
      console.log(
        `Bookmark notification sent to user ${bookmark.user_id} (bookmark ${bookmark.bookmark_id})`
      );
    }
  });

  // Send one email per user for bookmarks with aggregated bookmark ids
  bookmarkNotifications.forEach((payload, userId) => {
    const user = userMap.get(userId);
    if (!user?.email) return;
    emailSends.push(
      sendNotificationEmail({
        to: user.email,
        subject: 'TicketSpy: Parking alert near your bookmarks',
        kind: 'bookmark',
        latitude: payload.latitude ?? undefined,
        longitude: payload.longitude ?? undefined,
        alertId,
        bookmarkIds: payload.bookmarkIds,
      }).catch((err) => {
        console.error('Failed to send bookmark notification email:', err);
      })
    );
  });

  // fire and wait for queued email sends
  await Promise.all(emailSends);

  return {
    nearbySessions,
    nearbyBookmarks,
    notifiedParkingUsers,
    notifiedBookmarkUsers,
  };
}
