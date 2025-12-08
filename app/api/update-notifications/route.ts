import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const { parking, bookmark, notification_distance_miles } = await request.json();

    // Basic required fields check
    if (parking === undefined || bookmark === undefined) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }
    if (
      notification_distance_miles !== undefined &&
      (typeof notification_distance_miles !== 'number' ||
        notification_distance_miles < 0.05 ||
        notification_distance_miles > 2)
    ) {
      return NextResponse.json({ error: 'Invalid notification distance' }, { status: 400 });
    }

    const supabase = await createClient();
    const { data, error: userError } = await supabase.auth.getUser();

    if (userError || !data.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Update the public users table for the authenticated user only
    const updatePayload: Record<string, unknown> = {
      parking_notifications_on: parking,
      bookmark_notifications_on: bookmark,
    };
    if (notification_distance_miles !== undefined) {
      updatePayload.notification_distance_miles = notification_distance_miles;
    }

    const { error } = await supabase
      .from('users')
      .update(updatePayload)
      .eq('user_id', data.user.id);

    if (error) {
      console.error('Error updating notifications:', error);
      return NextResponse.json({ error: 'Failed to update notifications' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Notification preferences updated.',
    });
  } catch (err) {
    console.error('Notif update error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
