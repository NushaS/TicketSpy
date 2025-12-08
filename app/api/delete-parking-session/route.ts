import { createAdminClient } from '@/lib/supabase/server-admin';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('id');

    if (!sessionId) {
      return NextResponse.json({ error: 'Missing required parameter: id' }, { status: 400 });
    }

    const supabase = await createServerClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = user.id;

    const sb = createAdminClient();

    // Delete the parking session for the specific user
    const { error } = await sb
      .from('parking_sessions')
      .delete()
      .eq('parking_session_id', sessionId)
      .eq('user_id', userId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Parking session deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting parking session:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  return NextResponse.json({ error: 'Use DELETE to delete parking sessions.' }, { status: 405 });
}

export function GET() {
  return NextResponse.json({ error: 'Use DELETE to delete parking sessions.' }, { status: 405 });
}
