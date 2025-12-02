import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const { displayName, email } = await request.json();

    // Validate input
    if (!displayName || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    const supabase = await createClient();
    const { data, error: userError } = await supabase.auth.getUser();

    if (userError || !data.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Update display_name in public users table
    const { error: usersError } = await supabase
      .from('users')
      .update({ display_name: displayName, email: email })
      .eq('user_id', data.user.id);

    if (usersError) {
      console.error('Error updating users table:', usersError);
      return NextResponse.json({ error: 'Failed to update display name' }, { status: 500 });
    }

    // Update email for the authenticated user via their session
    const { error: authError } = await supabase.auth.updateUser({ email });

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
