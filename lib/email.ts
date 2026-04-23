import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

type BookingEmailParams = {
  parentEmail: string;
  tutorEmail: string;
  studentName: string;
  subject: string;
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

export async function sendBookingEmails({
  parentEmail,
  tutorEmail,
  studentName,
  subject,
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

  try {
    if (parentEmail) {
      const parentResult = await resend.emails.send({
        from: process.env.EMAIL_FROM,
        to: parentEmail,
        subject: "Lesson Booking Confirmed",
        html: `
          <h2>Booking Confirmed</h2>
          <p>Dear Parent,</p>
          <p>Your lesson has been successfully booked.</p>
          <p><strong>Student:</strong> ${studentName}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Date:</strong> ${date}</p>
          <p><strong>Time:</strong> ${time}</p>
        `,
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
        subject: "New Lesson Booking",
        html: `
          <h2>New Booking Assigned</h2>
          <p>A new lesson has been booked.</p>
          <p><strong>Student:</strong> ${studentName}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Date:</strong> ${date}</p>
          <p><strong>Time:</strong> ${time}</p>
        `,
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
        subject: "New Booking Created",
        html: `
          <h2>Booking Created</h2>
          <p>${studentName} - ${subject}</p>
          <p>${date} at ${time}</p>
        `,
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