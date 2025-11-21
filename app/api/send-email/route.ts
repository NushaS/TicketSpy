import * as React from 'react';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { WelcomeEmail } from '@/app/emails/welcome-email';

export async function GET() {
  // fetch("/api/send-email") runs GET()
  const result = await sendTestEmailToLeo();
  return NextResponse.json(result);
}

async function sendTestEmailToLeo() {
  const emailFrom = 'TicketSpy <onboarding@resend.dev>';
  const emailTo = 'leitoparal@gmail.com';
  const emailSubject = 'TicketSpy test email';
  const emailTextData = 'John';

  const result = await sendWelcomeEmail(emailFrom, emailTo, emailSubject, emailTextData);
  return result;
}

async function sendWelcomeEmail(
  emailFrom: string,
  emailTo: string,
  emailSubject: string,
  emailTextData: string // can use emails/email-template.tsx to simplify
) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const { data, error } = await resend.emails.send({
      from: emailFrom,
      to: emailTo,
      subject: emailSubject,
      // html: emailHtml,
      react: WelcomeEmail({ firstName: emailTextData }), // "react" can replace "html"
    });

    if (error) {
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err) {
    return { success: false, error: err };
  }
}
