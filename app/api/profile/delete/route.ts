import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Supabase admin client
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: { autoRefreshToken: false, persistSession: false },
  }
);

export async function DELETE(request: Request) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    // Delete user from auth.users table
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId);
    if (authError) {
      console.error('Error deleting user in auth:', authError);
      return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
    }

    // Optional: delete user from public.users table
    const { error: usersError } = await supabaseAdmin.from('users').delete().eq('user_id', userId);

    if (usersError) {
      console.error('Error deleting from users table:', usersError);
      return NextResponse.json({ error: 'Failed to delete user record' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Account deleted' });
  } catch (err) {
    console.error('Delete user error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
