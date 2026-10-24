import { NextResponse } from "next/server";

/** The RFI form posts here; this forwards it as email via Resend.
 *
 *  Resend rather than a form-to-email widget because the API key is a real
 *  secret that stays on the server. (Web3Forms was the first choice, but its
 *  free plan refuses server-side calls — it expects the key in the browser,
 *  where anyone can lift it — and IP-safelisting a rotating serverless pool
 *  isn't workable.)
 *
 *  No domain verification needed: on Resend's free tier an unverified sender
 *  may still deliver to the account owner's own address, which is the only
 *  recipient this form ever has. */

const ENDPOINT = "https://api.resend.com/emails";
const TO = "anasmallick846@gmail.com";
const FROM = "Portfolio RFI <onboarding@resend.dev>";

type Payload = {
  name?: unknown; email?: unknown; company?: unknown;
  message?: unknown; botcheck?: unknown;
};

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const esc = (v: string) =>
  v.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function POST(req: Request) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.error("RESEND_API_KEY is not set — contact form cannot deliver");
    return NextResponse.json({ ok: false, error: "Contact form is not configured." }, { status: 503 });
  }

  let body: Payload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Malformed request." }, { status: 400 });
  }

  /* honeypot: invisible to people, so anything in it is a bot. Answer 200 —
     a rejection would only tell the bot to try again differently. */
  if (str(body.botcheck)) return NextResponse.json({ ok: true });

  const name = str(body.name);
  const email = str(body.email);
  const company = str(body.company);
  const message = str(body.message);

  const errors: Record<string, string> = {};
  if (name.length < 2) errors.name = "ENTER YOUR NAME";
  else if (name.length > 120) errors.name = "TOO LONG";
  if (!EMAIL.test(email)) errors.email = "ENTER A VALID EMAIL";
  if (message.length < 10) errors.message = "AT LEAST 10 CHARACTERS";
  else if (message.length > 5000) errors.message = "TOO LONG";
  if (Object.keys(errors).length) {
    return NextResponse.json({ ok: false, errors }, { status: 400 });
  }

  const text = [
    `Name:    ${name}`,
    `Email:   ${email}`,
    `Company: ${company || "—"}`,
    "",
    message,
    "",
    "— sent from the RFI form on sheet 06",
  ].join("\n");

  const html = `<div style="font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:14px;line-height:1.6;color:#14161A">
    <p style="margin:0 0 16px;font-size:11px;letter-spacing:.14em;color:#787F8C">PORTFOLIO · REQUEST FOR INFORMATION</p>
    <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:18px">
      <tr><td style="padding:4px 18px 4px 0;color:#787F8C">NAME</td><td style="padding:4px 0"><strong>${esc(name)}</strong></td></tr>
      <tr><td style="padding:4px 18px 4px 0;color:#787F8C">EMAIL</td><td style="padding:4px 0"><a href="mailto:${esc(email)}">${esc(email)}</a></td></tr>
      <tr><td style="padding:4px 18px 4px 0;color:#787F8C">COMPANY</td><td style="padding:4px 0">${esc(company) || "—"}</td></tr>
    </table>
    <div style="border-left:2px solid #C8C2B4;padding-left:14px;white-space:pre-wrap">${esc(message)}</div>
  </div>`;

  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: FROM,
        to: [TO],
        // REST uses snake_case; the Node SDK uses replyTo. Verify on the first
        // live send that replying in Gmail actually addresses the sender.
        reply_to: email,
        subject: `Portfolio RFI — ${name}${company ? ` (${company})` : ""}`,
        text,
        html,
      }),
      signal: AbortSignal.timeout(10_000),
    });

    if (!res.ok) {
      console.error("Resend rejected the send", res.status, await res.text().catch(() => ""));
      return NextResponse.json({ ok: false, error: "Delivery failed." }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Resend request failed", err);
    return NextResponse.json({ ok: false, error: "Delivery failed." }, { status: 502 });
  }
}
