import { Resend } from 'resend';
import * as React from 'react';

type SendEmailParams = {
  to: string;
  subject?: string;
  firstName?: string;
};

interface EmailTemplateProps {
  firstName: string;
}

function EmailBody({ firstName }: EmailTemplateProps) {
  return (
    <div>
      <h1>youve got mail</h1>
    </div>
  );
}

export async function sendNotificationEmail({
  to,
  subject = 'TicketSpy notification',
  firstName = 'there',
}: SendEmailParams) {
  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) {
    throw new Error('Missing RESEND_API_KEY');
  }

  const resend = new Resend(resendApiKey);
  const from = 'TicketSpy <onboarding@resend.dev>';

  const { data, error } = await resend.emails.send({
    from,
    to,
    subject,
    react: EmailBody({ firstName }),
  });

  if (error) {
    throw new Error(`Failed to send email to ${to}: ${error.message ?? error.toString()}`);
  }

  return data;
}
