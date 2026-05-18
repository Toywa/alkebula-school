import { Resend } from "resend";

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error("RESEND_API_KEY is missing.");
  }

  return new Resend(apiKey);
}

function getEmailFrom() {
  return process.env.EMAIL_FROM || "The Alkebula School <noreply@alkebulaschool.com>";
}

export async function sendInternalMessageNotificationEmail({
  recipientEmail,
  recipientRole,
  senderRole,
  subject,
}: {
  recipientEmail: string;
  recipientRole: "admin" | "educator" | "parent";
  senderRole: "admin" | "educator" | "parent";
  subject: string;
}) {
  const resend = getResendClient();

  const dashboardUrl =
    recipientRole === "admin"
      ? "https://www.alkebulaschool.com/admin/messages"
      : recipientRole === "educator"
      ? "https://www.alkebulaschool.com/educator/messages"
      : "https://www.alkebulaschool.com/parent/support";

  return resend.emails.send({
    from: getEmailFrom(),
    to: recipientEmail,
    subject: `New message from The Alkebula School: ${subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.7; color: #0f172a;">
        <h2 style="margin-bottom: 12px;">New Internal Message</h2>

        <p>You have received a new message from <strong>${senderRole}</strong> on The Alkebula School platform.</p>

        <p><strong>Subject:</strong> ${subject}</p>

        <p>Please log in to your dashboard to read and respond.</p>

        <p>
          <a href="${dashboardUrl}" style="display:inline-block;background:#0f172a;color:white;padding:12px 18px;border-radius:10px;text-decoration:none;font-weight:bold;">
            Open Message
          </a>
        </p>

        <p style="margin-top: 24px; color: #64748b; font-size: 13px;">
          This is an automated notification from The Alkebula School.
        </p>
      </div>
    `,
  });
}