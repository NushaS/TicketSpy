import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const { userId, displayName, email } = await request.json();

    // Validate input
    if (!userId || !displayName || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    // Create Supabase admin client inside the handler
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

    // Update display_name in public users table
    const { error: usersError } = await supabaseAdmin
      .from('users')
      .update({ display_name: displayName, email: email })
      .eq('user_id', userId);

    if (usersError) {
      console.error('Error updating users table:', usersError);
      return NextResponse.json({ error: 'Failed to update display name' }, { status: 500 });
    }

    // Update email in auth.users table using admin API
    const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(userId, { email });

    if (authError) {
      console.error('Error updating auth email:', authError);
      return NextResponse.json({ error: 'Failed to update email' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
    });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
