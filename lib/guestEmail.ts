import { Resend } from "resend";
import { ceremonyVenue, couple, event, zoomMeeting } from "@/lib/data";
import { SITE_URL } from "@/lib/site";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Sends the guest their own confirmation — the whole reason email is
// required on the RSVP form. Reused by both the initial RSVP submission and
// the "resend my confirmation" flow, so a guest who lost the original email
// gets an identical one rather than a different-looking copy.
export async function sendGuestConfirmationEmail(data: {
  to: string;
  name: string;
  attending: "yes" | "no";
  guests: number;
  accessCode: string | null;
  qrToken: string | null;
}): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from) return false;

  const detailsUrl = `${SITE_URL}/details`;

  try {
    const resend = new Resend(apiKey);

    if (data.attending === "no") {
      const { error } = await resend.emails.send({
        from,
        to: data.to,
        subject: `See You on Zoom! — ${couple.groomName} & ${couple.brideName}'s Wedding`,
        html: `
          <div style="font-family: Georgia, serif; max-width: 480px; margin: 0 auto; color: #1c2841;">
            <p>Dear ${escapeHtml(data.name)},</p>
            <p>Thank you for letting us know — we're so glad you'll still be with us in spirit on ${couple.weddingDateDisplay}! Here's how to join the celebration live on Zoom.</p>

            ${
              zoomMeeting.meetingId || zoomMeeting.passcode
                ? `<div style="text-align: center; background: #1c2841; border-radius: 12px; padding: 20px; margin: 24px 0;">
                    <p style="margin: 0 0 6px; color: #ffd9b3; font-size: 12px; letter-spacing: 2px; text-transform: uppercase;">Zoom Details</p>
                    ${zoomMeeting.meetingId ? `<p style="margin: 0 0 4px; color: #ffffff; font-size: 14px;">Meeting ID: <strong>${escapeHtml(zoomMeeting.meetingId)}</strong></p>` : ""}
                    ${zoomMeeting.passcode ? `<p style="margin: 0; color: #ffffff; font-size: 14px;">Passcode: <strong>${escapeHtml(zoomMeeting.passcode)}</strong></p>` : ""}
                  </div>`
                : ""
            }

            ${
              zoomMeeting.link
                ? `<p style="text-align: center; margin: 24px 0;">
                    <a href="${zoomMeeting.link}" style="background: #1c2841; color: #ffffff; padding: 12px 28px; border-radius: 999px; text-decoration: none; font-size: 14px;">Join the Livestream</a>
                  </p>`
                : ""
            }

            <p style="margin-top: 32px;">With love,<br />${couple.groomName} &amp; ${couple.brideName}</p>
          </div>
        `,
      });
      if (error) throw error;
      return true;
    }

    const qrImageUrl = data.qrToken ? `${SITE_URL}/api/qr/${encodeURIComponent(data.qrToken)}` : null;

    const { error } = await resend.emails.send({
      from,
      to: data.to,
      subject: `You're Confirmed! 🎉 ${couple.groomName} & ${couple.brideName}'s Wedding`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 480px; margin: 0 auto; color: #1c2841;">
          <p>Dear ${escapeHtml(data.name)},</p>
          <p>We're so glad you'll be celebrating with us! Here's everything you need for the day.</p>

          <div style="background: #fdf6f0; border-radius: 12px; padding: 20px; margin: 24px 0;">
            <p style="margin: 0 0 12px; font-weight: bold;">Ceremony — ${escapeHtml(ceremonyVenue.name)}</p>
            <p style="margin: 0 0 4px; font-size: 14px;">${couple.weddingDateDisplay}, ${escapeHtml(ceremonyVenue.time)}</p>
            <p style="margin: 0 0 16px; font-size: 14px;">${escapeHtml(ceremonyVenue.address)}</p>
            <p style="margin: 0 0 12px; font-weight: bold;">Reception — ${escapeHtml(event.name)}</p>
            <p style="margin: 0 0 4px; font-size: 14px;">${couple.weddingDateDisplay}, ${escapeHtml(event.time)}</p>
            <p style="margin: 0 0 16px; font-size: 14px;">${escapeHtml(event.address)}</p>
            ${event.dressCode ? `<p style="margin: 0; font-size: 14px;"><strong>Dress code:</strong> ${escapeHtml(event.dressCode)}</p>` : ""}
          </div>

          <p>Guests confirmed: <strong>${data.guests}</strong></p>

          <div style="text-align: center; background: #1c2841; border-radius: 12px; padding: 20px; margin: 24px 0;">
            <p style="margin: 0 0 6px; color: #ffd9b3; font-size: 12px; letter-spacing: 2px; text-transform: uppercase;">Your Access Code</p>
            <p style="margin: 0; color: #ffffff; font-size: 28px; letter-spacing: 4px; font-weight: bold;">${data.accessCode}</p>
          </div>

          ${
            qrImageUrl
              ? `<div style="text-align: center; margin: 24px 0;">
                  <img src="${qrImageUrl}" width="160" height="160" alt="Check-in QR code" style="border-radius: 12px; border: 1px solid #eee;" />
                </div>`
              : ""
          }

          <p style="font-size: 14px;">Present your access code or QR code at the entrance on the day — a screenshot works fine.</p>

          <p style="text-align: center; margin: 32px 0;">
            <a href="${detailsUrl}" style="background: #1c2841; color: #ffffff; padding: 12px 28px; border-radius: 999px; text-decoration: none; font-size: 14px;">View Full Wedding Details</a>
          </p>

          <p style="margin-top: 32px;">With love,<br />${couple.groomName} &amp; ${couple.brideName}</p>
        </div>
      `,
    });
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Guest confirmation email failed:", error);
    return false;
  }
}
