import { NextResponse } from "next/server";

/** The form posts here, not straight to Web3Forms.
 *
 *  A Web3Forms access key placed in the client ships to every visitor in the
 *  page source, where anyone can lift it and send mail through it. Proxying the
 *  submission keeps the key server-side, lets the payload be validated before it
 *  leaves, and sidesteps browser CORS entirely. */

const ENDPOINT = "https://api.web3forms.com/submit";

type Payload = {
  name?: unknown;
  email?: unknown;
  company?: unknown;
  message?: unknown;
  botcheck?: unknown;
};

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(req: Request) {
  const key = process.env.WEB3FORMS_KEY;
  if (!key) {
    console.error("WEB3FORMS_KEY is not set — contact form cannot deliver");
    return NextResponse.json(
      { ok: false, error: "Contact form is not configured." },
      { status: 503 },
    );
  }

  let body: Payload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Malformed request." }, { status: 400 });
  }

  /* honeypot: a real person never sees this field, so anything in it is a bot.
     Answer 200 so the bot has no signal that it was rejected. */
  if (str(body.botcheck)) return NextResponse.json({ ok: true });

  const name = str(body.name);
  const email = str(body.email);
  const company = str(body.company);
  const message = str(body.message);

  const errors: Record<string, string> = {};
  if (name.length < 2) errors.name = "ENTER YOUR NAME";
  if (!EMAIL.test(email)) errors.email = "ENTER A VALID EMAIL";
  if (message.length < 10) errors.message = "AT LEAST 10 CHARACTERS";
  if (name.length > 120) errors.name = "TOO LONG";
  if (message.length > 5000) errors.message = "TOO LONG";
  if (Object.keys(errors).length) {
    return NextResponse.json({ ok: false, errors }, { status: 400 });
  }

  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        access_key: key,
        subject: `Portfolio RFI — ${name}`,
        from_name: "Portfolio RFI",
        replyto: email,
        name,
        email,
        company: company || "—",
        message,
      }),
      signal: AbortSignal.timeout(10_000),
    });

    const data = (await res.json().catch(() => null)) as { success?: boolean } | null;
    if (!res.ok || !data?.success) {
      console.error("Web3Forms rejected the submission", res.status, data);
      return NextResponse.json({ ok: false, error: "Delivery failed." }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Web3Forms request failed", err);
    return NextResponse.json({ ok: false, error: "Delivery failed." }, { status: 502 });
  }
}
