import { Resend } from "resend";

type RecipientRole = "admin" | "educator" | "parent";
type SenderRole = "admin" | "educator" | "parent";

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error("RESEND_API_KEY is missing.");
  }

  return new Resend(apiKey);
}

function getEmailFrom() {
  return (
    process.env.EMAIL_FROM ||
    "The Alkebula School <noreply@alkebulaschool.com>"
  );
}

function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || "https://www.alkebulaschool.com";
}

function getDashboardUrl(role: RecipientRole) {
  const siteUrl = getSiteUrl();

  if (role === "admin") return `${siteUrl}/admin/messages`;
  if (role === "educator") return `${siteUrl}/educator/messages`;
  return `${siteUrl}/parent/support`;
}

export async function sendInternalMessageNotificationEmail({
  recipientEmail,
  recipientRole,
  senderRole,
  subject,
}: {
  recipientEmail: string;
  recipientRole: RecipientRole;
  senderRole: SenderRole;
  subject: string;
}) {
  const resend = getResendClient();
  const dashboardUrl = getDashboardUrl(recipientRole);

  return resend.emails.send({
    from: getEmailFrom(),
    to: recipientEmail,
    subject: `New message from The Alkebula School: ${subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.7; color: #0f172a; max-width: 640px; margin: 0 auto;">
        <h2 style="margin-bottom: 12px;">New Message on The Alkebula School</h2>

        <p>You have received a new internal message from <strong>${senderRole}</strong>.</p>

        <p><strong>Subject:</strong> ${subject}</p>

        <p>Please log in to your dashboard to read and respond.</p>

        <p style="margin-top: 24px;">
          <a href="${dashboardUrl}" style="display:inline-block;background:#0f172a;color:white;padding:12px 18px;border-radius:10px;text-decoration:none;font-weight:bold;">
            Open Message
          </a>
        </p>

        <p style="margin-top: 28px; color: #64748b; font-size: 13px;">
          This is an automated notification from The Alkebula School.
        </p>
      </div>
    `,
  });
}