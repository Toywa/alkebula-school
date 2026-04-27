import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

type BookingEmailParams = {
  parentEmail: string;
  tutorEmail: string;
  parentName?: string;
  tutorName?: string;
  studentName: string;
  subject: string;
  curriculum?: string;
  classLevel?: string;
  date: string;
  time: string;
};

type EmailSendResult = {
  success: boolean;
  error?: string;
  results?: {
    parent?: unknown;
    tutor?: unknown;
    admin?: unknown;
  };
};

function extractErrorMessage(result: any, label: string) {
  if (!result) return `${label}: unknown error`;

  if (result.error) {
    if (typeof result.error === "string") return `${label}: ${result.error}`;
    if (typeof result.error.message === "string") {
      return `${label}: ${result.error.message}`;
    }
    try {
      return `${label}: ${JSON.stringify(result.error)}`;
    } catch {
      return `${label}: email send failed`;
    }
  }

  return null;
}

function wrapEmail(title: string, intro: string, body: string) {
  return `
    <div style="margin:0;padding:0;background:#f8fafc;font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
      <div style="max-width:680px;margin:0 auto;padding:32px 16px;">
        <div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:20px;overflow:hidden;">
          <div style="padding:28px 32px;border-bottom:1px solid #e2e8f0;background:linear-gradient(to bottom,#ffffff,#f8fafc);">
            <div style="font-size:12px;letter-spacing:0.28em;text-transform:uppercase;color:#64748b;font-weight:700;">
              The Alkebula School
            </div>
            <h1 style="margin:14px 0 0 0;font-size:32px;line-height:1.1;color:#0f172a;">
              ${title}
            </h1>
            <p style="margin:16px 0 0 0;font-size:16px;line-height:1.7;color:#475569;">
              ${intro}
            </p>
          </div>

          <div style="padding:28px 32px;">
            ${body}
          </div>

          <div style="padding:22px 32px;border-top:1px solid #e2e8f0;background:#f8fafc;">
            <p style="margin:0;font-size:13px;line-height:1.7;color:#64748b;">
              The Alkebula School<br/>
              Extraordinary Learning. Proven Results.
            </p>
          </div>
        </div>
      </div>
    </div>
  `;
}

function detailsBlock(items: Array<{ label: string; value: string }>) {
  const rows = items
    .map(
      (item) => `
        <tr>
          <td style="padding:10px 0;font-weight:700;color:#0f172a;width:160px;vertical-align:top;">
            ${item.label}
          </td>
          <td style="padding:10px 0;color:#334155;">
            ${item.value}
          </td>
        </tr>
      `
    )
    .join("");

  return `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
      ${rows}
    </table>
  `;
}

export async function sendBookingEmails({
  parentEmail,
  tutorEmail,
  parentName,
  tutorName,
  studentName,
  subject,
  curriculum,
  classLevel,
  date,
  time,
}: BookingEmailParams): Promise<EmailSendResult> {
  if (!process.env.RESEND_API_KEY) {
    return { success: false, error: "Missing RESEND_API_KEY" };
  }

  if (!process.env.EMAIL_FROM) {
    return { success: false, error: "Missing EMAIL_FROM" };
  }

  const results: {
    parent?: unknown;
    tutor?: unknown;
    admin?: unknown;
  } = {};

  const replyTo = process.env.ADMIN_EMAIL || undefined;

  const parentHtml = wrapEmail(
    "Lesson Booking Confirmed",
    `Hello${parentName ? ` ${parentName}` : ""}, your lesson booking has been received successfully.`,
    `
      <div style="margin-bottom:20px;color:#334155;font-size:15px;line-height:1.8;">
        We’re pleased to confirm your booking. Below are the lesson details.
      </div>

      <div style="padding:20px 22px;border:1px solid #e2e8f0;border-radius:16px;background:#ffffff;">
        ${detailsBlock([
          { label: "Student", value: studentName },
          { label: "Subject", value: subject },
          { label: "Curriculum", value: curriculum || "Not specified" },
          { label: "Class / Level", value: classLevel || "Not specified" },
          { label: "Date", value: date },
          { label: "Time", value: time },
          { label: "Tutor", value: tutorName || "Assigned Tutor" },
        ])}
      </div>
    `
  );

  const tutorHtml = wrapEmail(
    "New Lesson Booking",
    `A new lesson booking has been assigned to you.`,
    `
      <div style="margin-bottom:20px;color:#334155;font-size:15px;line-height:1.8;">
        Please review the lesson details below and prepare accordingly.
      </div>

      <div style="padding:20px 22px;border:1px solid #e2e8f0;border-radius:16px;background:#ffffff;">
        ${detailsBlock([
          { label: "Student", value: studentName },
          { label: "Subject", value: subject },
          { label: "Curriculum", value: curriculum || "Not specified" },
          { label: "Class / Level", value: classLevel || "Not specified" },
          { label: "Date", value: date },
          { label: "Time", value: time },
          { label: "Parent", value: parentName || "Parent" },
        ])}
      </div>
    `
  );

  const adminHtml = wrapEmail(
    "New Booking Created",
    `A new booking has just been created on The Alkebula School platform.`,
    `
      <div style="padding:20px 22px;border:1px solid #e2e8f0;border-radius:16px;background:#ffffff;">
        ${detailsBlock([
          { label: "Student", value: studentName },
          { label: "Parent Email", value: parentEmail || "Not supplied" },
          { label: "Tutor Email", value: tutorEmail || "Not supplied" },
          { label: "Tutor", value: tutorName || "Assigned Tutor" },
          { label: "Subject", value: subject },
          { label: "Curriculum", value: curriculum || "Not specified" },
          { label: "Class / Level", value: classLevel || "Not specified" },
          { label: "Date", value: date },
          { label: "Time", value: time },
        ])}
      </div>
    `
  );

  try {
    if (parentEmail) {
      const parentResult = await resend.emails.send({
        from: process.env.EMAIL_FROM,
        to: parentEmail,
        replyTo,
        subject: "Your lesson booking is confirmed",
        html: parentHtml,
      });

      results.parent = parentResult;

      const parentError = extractErrorMessage(parentResult, "parent");
      if (parentError) {
        return { success: false, error: parentError, results };
      }
    }

    if (tutorEmail) {
      const tutorResult = await resend.emails.send({
        from: process.env.EMAIL_FROM,
        to: tutorEmail,
        replyTo,
        subject: "You have a new lesson booking",
        html: tutorHtml,
      });

      results.tutor = tutorResult;

      const tutorError = extractErrorMessage(tutorResult, "tutor");
      if (tutorError) {
        return { success: false, error: tutorError, results };
      }
    }

    if (process.env.ADMIN_EMAIL) {
      const adminResult = await resend.emails.send({
        from: process.env.EMAIL_FROM,
        to: process.env.ADMIN_EMAIL,
        replyTo,
        subject: "New booking created",
        html: adminHtml,
      });

      results.admin = adminResult;

      const adminError = extractErrorMessage(adminResult, "admin");
      if (adminError) {
        return { success: false, error: adminError, results };
      }
    }

    return { success: true, results };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown email error",
      results,
    };
  }
}
export async function sendInterviewScheduledEmail({
  applicantEmail,
  applicantName,
  interviewAt,
  interviewNotes,
}: {
  applicantEmail: string;
  applicantName: string;
  interviewAt: string;
  interviewNotes?: string;
}) {
  if (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM) {
    return { success: false, error: "Missing email configuration" };
  }

  try {
    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: applicantEmail,
      replyTo: process.env.ADMIN_EMAIL || undefined,
      subject: "Tutor Interview Scheduled — The Alkebula School",
      html: `
        <div style="font-family:Arial,Helvetica,sans-serif;background:#f8fafc;padding:32px;color:#0f172a;">
          <div style="max-width:680px;margin:auto;background:white;border:1px solid #e2e8f0;border-radius:20px;overflow:hidden;">
            <div style="padding:28px 32px;background:#f8fafc;border-bottom:1px solid #e2e8f0;">
              <p style="font-size:12px;letter-spacing:0.25em;text-transform:uppercase;color:#64748b;font-weight:700;">
                The Alkebula School
              </p>
              <h1 style="margin:12px 0 0;font-size:30px;">Interview Scheduled</h1>
            </div>

            <div style="padding:28px 32px;font-size:15px;line-height:1.8;color:#334155;">
              <p>Dear ${applicantName},</p>

              <p>
                Thank you for applying to join The Alkebula School educator network.
                Your tutor interview has been scheduled.
              </p>

              <div style="margin:24px 0;padding:20px;border:1px solid #e2e8f0;border-radius:16px;background:#ffffff;">
                <p><strong>Interview Date/Time:</strong> ${new Date(interviewAt).toLocaleString()}</p>
                <p><strong>Notes:</strong> ${interviewNotes || "Further details will be shared by admin."}</p>
              </div>

              <p>
                Please be ready to discuss your teaching experience, curriculum strength,
                student support approach, and submitted documents.
              </p>

              <p>
                Warm regards,<br/>
                The Alkebula School
              </p>
            </div>

            <div style="padding:22px 32px;background:#f8fafc;border-top:1px solid #e2e8f0;">
              <p style="margin:0;font-size:13px;color:#64748b;">
                Extraordinary Learning. Proven Results.
              </p>
            </div>
          </div>
        </div>
      `,
    });

    if (result.error) {
      return {
        success: false,
        error:
          typeof result.error.message === "string"
            ? result.error.message
            : "Interview email failed",
      };
    }

    return { success: true, result };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Interview email failed",
    };
  }
}