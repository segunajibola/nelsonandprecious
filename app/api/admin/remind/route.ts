import { Resend } from "resend";
import { airtableConfigured, listInvites } from "@/lib/airtable";
import { isAuthorized } from "@/lib/adminAuth";
import { couple } from "@/lib/data";
import { SITE_URL } from "@/lib/site";
import { escapeHtml } from "@/lib/utils";

// Only reaches guests who have an email on file but haven't responded yet.
// That email only exists if the couple entered one when generating the
// invite (see the optional email field in /admin) — there's no other way to
// know a guest's address before they've submitted the RSVP form themselves.
export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return Response.json({ error: "Incorrect password." }, { status: 401 });
  }
  if (!airtableConfigured()) {
    return Response.json({ error: "Airtable isn't configured." }, { status: 500 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from) {
    return Response.json({ error: "Email sending isn't configured." }, { status: 500 });
  }

  try {
    const invites = await listInvites();
    const pending = invites.filter((invite) => invite.attending === null);
    const reachable = pending.filter((invite) => invite.email);

    const resend = new Resend(apiKey);
    let sent = 0;
    const failed: string[] = [];

    for (const invite of reachable) {
      try {
        const { error } = await resend.emails.send({
          from,
          to: invite.email!,
          subject: `Reminder: Please RSVP by ${couple.rsvpDeadlineDisplay} — ${couple.groomName} & ${couple.brideName}'s Wedding`,
          html: `
            <div style="font-family: Georgia, serif; max-width: 480px; margin: 0 auto; color: #1c2841;">
              <p>Dear ${escapeHtml(invite.label)},</p>
              <p>We haven't heard back from you yet! Please let us know if you'll be joining us on ${couple.weddingDateDisplay} by ${couple.rsvpDeadlineDisplay}.</p>
              <p style="text-align: center; margin: 32px 0;">
                <a href="${SITE_URL}/rsvp/${encodeURIComponent(invite.inviteCode)}" style="background: #1c2841; color: #ffffff; padding: 12px 28px; border-radius: 999px; text-decoration: none; font-size: 14px;">RSVP Now</a>
              </p>
              <p style="margin-top: 32px;">With love,<br />${couple.groomName} &amp; ${couple.brideName}</p>
            </div>
          `,
        });
        if (error) throw error;
        sent++;
      } catch (error) {
        console.error(`Reminder email failed for ${invite.inviteCode}:`, error);
        failed.push(invite.label || invite.inviteCode);
      }
    }

    return Response.json({
      ok: true,
      sent,
      failed,
      skippedNoEmail: pending.length - reachable.length,
    });
  } catch (error) {
    console.error("Bulk reminder failed:", error);
    return Response.json({ error: "Couldn't send reminders right now." }, { status: 502 });
  }
}
