import { Resend } from "resend";

type RescheduleEmailInput = {
  tutorEmail: string;
  parentEmail?: string | null;
  studentName?: string | null;
  subject?: string | null;
  curriculum?: string | null;
  oldDate?: string | null;
  oldStartTime?: string | null;
  oldEndTime?: string | null;
  newDate?: string | null;
  newStartTime?: string | null;
  newEndTime?: string | null;
  adminNotes?: string | null;
  lessonId: string;
  status: "resolved" | "rejected";
};

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

function safe(value?: string | null) {
  return value || "—";
}

export async function sendRescheduleResolutionEmails({
  tutorEmail,
  parentEmail,
  studentName,
  subject,
  curriculum,
  oldDate,
  oldStartTime,
  oldEndTime,
  newDate,
  newStartTime,
  newEndTime,
  adminNotes,
  lessonId,
  status,
}: RescheduleEmailInput) {
  const resend = getResendClient();
  const siteUrl = getSiteUrl();

  const classroomUrl = `${siteUrl}/classroom/${lessonId}`;
  const tutorDashboardUrl = `${siteUrl}/educator/dashboard`;
  const parentDashboardUrl = `${siteUrl}/parent/bookings`;

  const isResolved = status === "resolved";

  const subjectLine = isResolved
    ? `Lesson Rescheduled: ${safe(subject)}`
    : `Reschedule Request Update: ${safe(subject)}`;

  const heading = isResolved
    ? "Lesson Rescheduled Successfully"
    : "Reschedule Request Update";

  const statusMessage = isResolved
    ? "The lesson below has been rescheduled by The Alkebula School admin."
    : "The reschedule request below has been reviewed by The Alkebula School admin.";

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.7; color: #0f172a; max-width: 680px; margin: 0 auto;">
      <h2 style="margin-bottom: 12px;">${heading}</h2>

      <p>${statusMessage}</p>

      <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:14px;padding:18px;margin:20px 0;">
        <p><strong>Student:</strong> ${safe(studentName)}</p>
        <p><strong>Subject:</strong> ${safe(subject)}</p>
        <p><strong>Curriculum:</strong> ${safe(curriculum)}</p>

        <hr style="border:none;border-top:1px solid #e2e8f0;margin:14px 0;" />

        <p><strong>Original Lesson:</strong> ${safe(oldDate)} · ${safe(oldStartTime)} - ${safe(oldEndTime)}</p>
        <p><strong>New Lesson Time:</strong> ${safe(newDate)} · ${safe(newStartTime)} - ${safe(newEndTime)}</p>

        ${
          adminNotes
            ? `<p><strong>Admin Note:</strong> ${adminNotes}</p>`
            : ""
        }
      </div>

      ${
        isResolved
          ? `<p style="margin-top:24px;">
              <a href="${classroomUrl}" style="display:inline-block;background:#0f172a;color:white;padding:12px 18px;border-radius:10px;text-decoration:none;font-weight:bold;">
                Open Classroom
              </a>
            </p>`
          : ""
      }

      <p style="margin-top:20px;color:#64748b;font-size:13px;">
        This is an automated notification from The Alkebula School.
      </p>
    </div>
  `;

  const emails = [];

  if (tutorEmail) {
    emails.push(
      resend.emails.send({
        from: getEmailFrom(),
        to: tutorEmail,
        subject: subjectLine,
        html: `${html}
          <p style="font-family:Arial,sans-serif;max-width:680px;margin:18px auto;">
            <a href="${tutorDashboardUrl}">Open educator dashboard</a>
          </p>`,
      })
    );
  }

  if (parentEmail) {
    emails.push(
      resend.emails.send({
        from: getEmailFrom(),
        to: parentEmail,
        subject: subjectLine,
        html: `${html}
          <p style="font-family:Arial,sans-serif;max-width:680px;margin:18px auto;">
            <a href="${parentDashboardUrl}">Open parent dashboard</a>
          </p>`,
      })
    );
  }

  return Promise.allSettled(emails);
}