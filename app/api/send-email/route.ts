import { NextResponse } from 'next/server';
import { sendNotificationEmail } from '@/lib/server/sendEmail';

export async function GET() {
  // fetch("/api/send-email") runs GET()
  try {
    const data = await sendNotificationEmail({
      to: 'leitoparal@gmail.com',
      subject: 'TicketSpy test email',
    });
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
