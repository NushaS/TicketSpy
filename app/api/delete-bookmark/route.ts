import { createAdminClient } from '@/lib/supabase/server-admin';
import { NextResponse } from 'next/server';

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const bookmarkId = searchParams.get('id');
    const userId = searchParams.get('user_id');

    if (!bookmarkId || !userId) {
      return NextResponse.json(
        { error: 'Missing required parameters: id and user_id' },
        { status: 400 }
      );
    }

    const sb = createAdminClient();

    // Delete the bookmark for the specific user
    const { error } = await sb
      .from('bookmarked_locations')
      .delete()
      .eq('bookmark_id', bookmarkId)
      .eq('user_id', userId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Bookmark deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting bookmark:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  return NextResponse.json({ error: 'Use DELETE to delete bookmarks.' }, { status: 405 });
}

export function GET() {
  return NextResponse.json({ error: 'Use DELETE to delete bookmarks.' }, { status: 405 });
}
