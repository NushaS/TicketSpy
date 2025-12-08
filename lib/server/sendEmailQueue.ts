import { sendNotificationEmail } from '@/lib/server/sendEmail';

type EmailPayload = Parameters<typeof sendNotificationEmail>[0];

const emailQueue: EmailPayload[] = [];
let processing = false;

/**
 * Enqueue an email to be sent.
 */
export function enqueueEmail(email: EmailPayload) {
  emailQueue.push(email);
  processQueue();
}

/**
 * Process the email queue in batches of 2/sec.
 */
async function processQueue() {
  if (processing) return;
  processing = true;

  while (emailQueue.length > 0) {
    // Take up to 2 emails from the queue
    const batch = emailQueue.splice(0, 2);
    await Promise.all(
      batch.map((e) =>
        sendNotificationEmail(e).catch((err) => {
          console.error('Failed to send notification email:', err);
        })
      )
    );
    // Wait 1 second after every 2 emails
    if (emailQueue.length > 0) await new Promise((res) => setTimeout(res, 1000));
  }

  processing = false;
}
