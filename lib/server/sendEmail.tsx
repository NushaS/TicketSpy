import { Resend } from 'resend';
import * as React from 'react';

type SendEmailParams = {
  to: string;
  subject?: string;
  kind?: 'parking' | 'bookmark';
  latitude?: number;
  longitude?: number;
  alertId?: string; // id to deep link the user to /alert?id=...
  bookmarkNames?: string[]; // optional list of bookmark names affected
};

interface EmailTemplateProps {
  body: string;
  latitude?: number | null;
  longitude?: number | null;
  alertUrl?: string | null;
  bookmarkNames?: string[];
}

const BOOKMARK_BODY =
  'There was a ticket or parking enforcement officer reported near your bookmarks';
const PARKING_BODY =
  'There was a ticket or parking enforcement officer reported near your parking spot';

function EmailBody({ body, alertUrl, bookmarkNames }: EmailTemplateProps) {
  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif' }}>
      <h1 style={{ fontSize: '18px', margin: '8px 0' }}>{body}</h1>

      <p style={{ marginTop: '12px', fontSize: '13px', color: '#555' }}>
        Please check the area if this affects you.
      </p>
      {Array.isArray(bookmarkNames) && bookmarkNames.length > 0 && (
        <div style={{ marginTop: '10px', fontSize: '13px', color: '#222' }}>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>Affected bookmarks:</div>
          <ul style={{ paddingLeft: '18px', margin: 0 }}>
            {bookmarkNames.map((name, idx) => (
              <li key={`${name}-${idx}`} style={{ marginBottom: 2 }}>
                {name}
              </li>
            ))}
          </ul>
        </div>
      )}
      {alertUrl && (
        <p style={{ marginTop: '10px' }}>
          <a
            href={alertUrl}
            style={{
              display: 'inline-block',
              padding: '10px 14px',
              borderRadius: '6px',
              background: '#2563eb',
              color: 'white',
              textDecoration: 'none',
              fontWeight: 600,
            }}
          >
            View on map
          </a>
        </p>
      )}
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
  alertId,
  bookmarkNames,
}: SendEmailParams) {
  const resend = getResendClient();
  const from = 'TicketSpy <no-reply@ticketspy.org>'; // ticketspy.app DOMAIN VERIFIED! no-reply email allowed

  // choose template and default subject based on kind
  const body = kind === 'bookmark' ? BOOKMARK_BODY : PARKING_BODY;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  const alertUrl = alertId ? `${baseUrl.replace(/\/$/, '')}/alert?id=${alertId}` : null;

  const react =
    kind === 'bookmark' ? (
      <EmailBody body={body} alertUrl={alertUrl} bookmarkNames={bookmarkNames} />
    ) : (
      <EmailBody body={body} alertUrl={alertUrl} />
    );

  const defaultSubject =
    kind === 'bookmark'
      ? 'TicketSpy — bookmark notification'
      : 'TicketSpy — parking session notification';

  const { data, error } = await resend.emails.send({
    from,
    to,
    subject: subject ?? defaultSubject,
    // Resend accepts react component and renders it
    react,
  });

  if (error) {
    throw new Error(
      `Failed to send ${kind} notification email to ${to}: ${error.message ?? error.toString()}`
    );
  }

  return data;
}
