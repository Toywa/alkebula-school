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
  hourlyRate?: number;
  lessonAmount?: number;
  platformCommission?: number;
  tutorPayoutAmount?: number;
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

function money(value?: number) {
  if (!value || Number.isNaN(value)) return "Not specified";
  return `USD ${Number(value).toFixed(2)}`;
}

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
          <td style="padding:10px 0;font-weight:700;color:#0f172a;width:180px;vertical-align:top;">
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
  hourlyRate,
  lessonAmount,
  platformCommission,
  tutorPayoutAmount,
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
          { label: "Curriculum / Level", value: curriculum || "Not specified" },
          { label: "Class / Level", value: classLevel || "Not specified" },
          { label: "Date", value: date },
          { label: "Time", value: time },
          { label: "Tutor", value: tutorName || "Assigned Tutor" },
          { label: "Hourly Rate", value: money(hourlyRate) },
          { label: "Lesson Amount", value: money(lessonAmount || hourlyRate) },
        ])}
      </div>

      <p style="margin:22px 0 0 0;font-size:14px;line-height:1.8;color:#64748b;">
        Payment instructions will be shared through the official payment channel once enabled.
      </p>
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
          { label: "Curriculum / Level", value: curriculum || "Not specified" },
          { label: "Class / Level", value: classLevel || "Not specified" },
          { label: "Date", value: date },
          { label: "Time", value: time },
          { label: "Parent", value: parentName || "Parent" },
          { label: "Tutor Payout", value: money(tutorPayoutAmount) },
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
          { label: "Curriculum / Level", value: curriculum || "Not specified" },
          { label: "Class / Level", value: classLevel || "Not specified" },
          { label: "Date", value: date },
          { label: "Time", value: time },
          { label: "Hourly Rate", value: money(hourlyRate) },
          { label: "Lesson Amount", value: money(lessonAmount || hourlyRate) },
          { label: "Platform Commission", value: money(platformCommission) },
          { label: "Tutor Payout", value: money(tutorPayoutAmount) },
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
      if (parentError) return { success: false, error: parentError, results };
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
      if (tutorError) return { success: false, error: tutorError, results };
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
      if (adminError) return { success: false, error: adminError, results };
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
      html: wrapEmail(
        "Interview Scheduled",
        `Dear ${applicantName}, your tutor interview has been scheduled.`,
        `
          <p style="font-size:15px;line-height:1.8;color:#334155;">
            Thank you for applying to join The Alkebula School educator network.
            Your tutor interview has been scheduled.
          </p>

          <div style="margin:24px 0;padding:20px;border:1px solid #e2e8f0;border-radius:16px;background:#ffffff;">
            ${detailsBlock([
              {
  label: "Interview Time",
  value: `${new Date(interviewAt).toLocaleString("en-GB", {
    timeZone: "Europe/London",
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })} London time / GMT. Nairobi equivalent: ${new Date(interviewAt).toLocaleString("en-GB", {
    timeZone: "Africa/Nairobi",
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })} EAT (UTC+3).`,
},
              { label: "Notes", value: interviewNotes || "Further details will be shared by admin." },
            ])}
          </div>

          <p style="font-size:15px;line-height:1.8;color:#334155;">
            Please be ready to discuss your teaching experience, curriculum strength,
            student support approach, and submitted documents.
          </p>
        `
      ),
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

export async function sendInvoiceEmail({
  parentEmail,
  parentName,
  studentName,
  tutorName,
  subject,
  date,
  time,
  amountUsd,
}: {
  parentEmail: string;
  parentName: string;
  studentName: string;
  tutorName: string;
  subject: string;
  date: string;
  time: string;
  amountUsd: number;
}) {
  if (!process.env.RESEND_API_KEY) {
    return { success: false, error: "Missing RESEND_API_KEY" };
  }

  if (!process.env.EMAIL_FROM) {
    return { success: false, error: "Missing EMAIL_FROM" };
  }

  try {
    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: parentEmail,
      replyTo: process.env.ADMIN_EMAIL || undefined,
      subject: "Your Lesson Invoice — The Alkebula School",
      html: wrapEmail(
        "Lesson Invoice",
        `Dear ${parentName}, your lesson booking invoice has been created.`,
        `
          <div style="padding:20px 22px;border:1px solid #e2e8f0;border-radius:16px;background:#ffffff;">
            ${detailsBlock([
              { label: "Student", value: studentName },
              { label: "Tutor", value: tutorName },
              { label: "Subject", value: subject },
              { label: "Date", value: date },
              { label: "Time", value: time },
              { label: "Amount Due", value: `USD ${amountUsd}` },
            ])}
          </div>

          <p style="margin:24px 0 0 0;font-size:15px;line-height:1.8;color:#475569;">
            Payment instructions will be shared through the official payment channel once enabled.
          </p>
        `
      ),
    });

    if (result.error) {
      return {
        success: false,
        error:
          typeof result.error.message === "string"
            ? result.error.message
            : "Invoice email failed",
      };
    }

    return { success: true, result };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Invoice email failed",
    };
  }
}

export async function sendTutorApprovedEmail({
  tutorEmail,
  tutorName,
}: {
  tutorEmail: string;
  tutorName: string;
}) {
  if (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM) {
    return {
      success: false,
      error: "Missing email configuration",
    };
  }

  try {
    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: tutorEmail,
      replyTo: process.env.ADMIN_EMAIL || undefined,
      subject: "Congratulations — Your Alkebula Educator Application Is Approved",
      html: wrapEmail(
        "Welcome to The Alkebula School",
        `Congratulations ${tutorName}! Your educator application has been approved.`,
        `
          <p style="font-size:15px;line-height:1.8;color:#334155;">
            We are delighted to welcome you into The Alkebula School educator network.
            Your profile has passed our review stage, and you can now activate your educator account.
          </p>

          <div style="margin:28px 0;padding:22px;border:1px solid #e2e8f0;border-radius:16px;background:#ffffff;">
            <p style="margin:0 0 12px 0;font-size:15px;font-weight:700;color:#0f172a;">
              Next Step: Activate Your Educator Account
            </p>

            <p style="margin:0;font-size:15px;line-height:1.8;color:#475569;">
              Please create your educator account using the SAME email address you used during your application.
            </p>

            <div style="margin-top:22px;">
              <a
                href="https://www.alkebulaschool.com/auth/sign-up"
                style="display:inline-block;background:#0f172a;color:#ffffff;text-decoration:none;padding:14px 22px;border-radius:12px;font-weight:700;font-size:14px;"
              >
                Create Educator Account
              </a>
            </div>
          </div>

          <div style="margin:28px 0;padding:22px;border:1px solid #fde68a;border-radius:16px;background:#fffbeb;">
            <p style="margin:0 0 10px 0;font-size:15px;font-weight:700;color:#92400e;">
              Tutor Terms & Conditions
            </p>

            <p style="margin:0;font-size:15px;line-height:1.8;color:#78350f;">
              Before creating your educator account, please read the Tutor Terms & Conditions carefully.
              Creating your educator account and using the platform means you accept The Alkebula School tutor terms,
              professional standards, lesson conduct expectations, payment rules, and rescheduling policy.
            </p>

            <ul style="margin:16px 0 0 20px;padding:0;font-size:15px;line-height:1.8;color:#78350f;">
              <li>
                Tutor earnings follow a 70/30 revenue-sharing model: the tutor receives 70% of the lesson fee,
                while The Alkebula School retains 30% as platform commission.
              </li>
              <li>
                Tutor reschedule requests should be made at least 24 hours before the scheduled lesson,
                except in genuine emergencies.
              </li>
              <li>
                Tutors must attend lessons sober, alert, respectful, and professionally prepared.
              </li>
              <li>
                Drunkenness, intoxication, being high on drugs, abusive language, demeaning remarks,
                intimidation, or unprofessional conduct during lessons is strictly prohibited.
              </li>
              <li>
                Private payment arrangements outside The Alkebula School are not allowed.
              </li>
              <li>
                If a parent or student misses a lesson, or requests a reschedule less than 24 hours before the lesson,
                The Alkebula School will discuss the circumstances with the parent and tutor and reach a fair,
                amicable decision on whether the lesson should be paid for, rescheduled, or otherwise resolved.
              </li>
            </ul>

            <p style="margin:18px 0 0 0;">
              <a
                href="https://www.alkebulaschool.com/legal/tutor-terms"
                style="color:#92400e;font-weight:700;text-decoration:underline;"
              >
                Read Tutor Terms & Conditions
              </a>
            </p>
          </div>

          <p style="font-size:15px;line-height:1.8;color:#334155;">
            Once signed in, you will be able to access your educator dashboard,
            publish availability, receive lesson bookings, track upcoming lessons,
            and monitor your earnings.
          </p>
        `
      ),
    });

    if (result.error) {
      return {
        success: false,
        error:
          typeof result.error.message === "string"
            ? result.error.message
            : "Approval email failed",
      };
    }

    return {
      success: true,
      result,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Approval email failed",
    };
  }
}