import { Resend } from 'resend';
import * as React from 'react';

type SendEmailParams = {
  to: string;
  subject?: string;
  kind?: 'parking' | 'bookmark';
  latitude?: number;
  longitude?: number;
};

interface EmailTemplateProps {
  body: string;
  latitude?: number | null;
  longitude?: number | null;
}

const BOOKMARK_BODY =
  'There was a ticket or parking enforcement officer reported near one of your bookmarks';
const PARKING_BODY =
  'There was a ticket or parking enforcement officer reported near your parking spot';

function EmailBody({ body, latitude, longitude }: EmailTemplateProps) {
  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif' }}>
      <h1 style={{ fontSize: '18px', margin: '8px 0' }}>{body}</h1>

      {/* Show coordinates only when provided (useful for bookmarked locations) */}
      {typeof latitude === 'number' && typeof longitude === 'number' && (
        <div style={{ marginTop: '8px', fontSize: '14px' }}>
          <strong>Location of your bookmarked spot:</strong>
          <div>Latitude: {latitude.toFixed(6)}</div>
          <div>Longitude: {longitude.toFixed(6)}</div>
        </div>
      )}
      <p style={{ marginTop: '12px', fontSize: '13px', color: '#555' }}>
        Please check the area if this affects you.
      </p>
    </div>
  );
}

function getResendClient() {
  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) throw new Error('Missing RESEND_API_KEY');
  return new Resend(resendApiKey);
}

export async function sendNotificationEmail({
  to,
  subject,
  kind = 'parking',
  latitude,
  longitude,
}: SendEmailParams) {
  const resend = getResendClient();
  const from = 'TicketSpy <no-reply@ticketspy.org>'; // ticketspy.app DOMAIN VERIFIED! no-reply email allowed

  // choose template and default subject based on kind
  const body = kind === 'bookmark' ? BOOKMARK_BODY : PARKING_BODY;

  const react =
    kind === 'bookmark' ? (
      <EmailBody body={body} latitude={latitude ?? null} longitude={longitude ?? null} />
    ) : (
      <EmailBody body={body} />
    );

  const defaultSubject =
    kind === 'bookmark'
      ? 'TicketSpy — bookmark notification'
      : 'TicketSpy — parking session notification';

  const { data, error } = await resend.emails.send({
    from,
    to,
    subject: subject ?? defaultSubject,
    react,
  });

  if (error) {
    throw new Error(
      `Failed to send ${kind} notification email to ${to}: ${error.message ?? error.toString()}`
    );
  }

  return data;
}
