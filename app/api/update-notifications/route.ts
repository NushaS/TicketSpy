import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const { userId, parking, bookmark } = await request.json();

    // Basic required fields check
    if (!userId || parking === undefined || bookmark === undefined) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    // Create Supabase admin client
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Update the public users table
    const { error } = await supabaseAdmin
      .from('users')
      .update({
        parking_notifications_on: parking,
        bookmark_notifications_on: bookmark,
      })
      .eq('user_id', userId);

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
