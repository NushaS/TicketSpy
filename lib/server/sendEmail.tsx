import { Resend } from 'resend';
import * as React from 'react';

type SendEmailParams = {
  to: string;
  subject?: string;
  kind?: 'parking' | 'bookmark';
};

interface EmailTemplateProps {
  body: string;
}

const body2 =
  'There was a ticket or parking enforcement officer reported near one of your bookmarks';
const body1 = 'There was a ticket or parking enforcement officer reported near your parking spot';

function EmailBody({ body }: EmailTemplateProps) {
  return (
    <div>
      <h1>{body}</h1>
    </div>
  );
}

function getResendClient() {
  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) throw new Error('Missing RESEND_API_KEY');
  return new Resend(resendApiKey);
}

export async function sendNotificationEmail({ to, subject, kind = 'parking' }: SendEmailParams) {
  const resend = getResendClient();
  const from = 'TicketSpy <onboarding@resend.dev>';

  // choose template and default subject based on kind
  const react = kind === 'bookmark' ? <EmailBody body={body2} /> : <EmailBody body={body1} />;

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
