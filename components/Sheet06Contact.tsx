"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import { track } from "@vercel/analytics";
import { PROFILE as P } from "@/data/profile";
import { readSent, writeSent, subscribeSent, serverSent } from "@/lib/rfiStore";

type Errors = Partial<Record<"name" | "email" | "message", string>>;

export default function Sheet06Contact() {
  const sent = useSyncExternalStore(subscribeSent, readSent, serverSent);
  const [errs, setErrs] = useState<Errors>({});
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const sentRef = useRef<HTMLDivElement>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const d = Object.fromEntries(fd.entries()) as Record<string, string>;

    const next: Errors = {};
    if (d.name.trim().length < 2) next.name = "ENTER YOUR NAME";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email.trim())) next.email = "ENTER A VALID EMAIL";
    if (!d.message.trim()) next.message = "ENTER A MESSAGE";
    setErrs(next);
    if (Object.keys(next).length) {
      formRef.current?.querySelector<HTMLElement>(".fld.err input, .fld.err textarea")?.focus();
      return;
    }

    setBusy(true);
    setFailed(false);

    /* Only claim the message was received if it actually was. A silent failure here
       would tell someone "I'll come back to you" about a message that never arrived. */
    let delivered = false;
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(d),
      });
      const out = (await res.json().catch(() => null)) as
        { ok?: boolean; errors?: Errors } | null;
      if (res.status === 400 && out?.errors) { setErrs(out.errors); setBusy(false); return; }
      delivered = res.ok && (out?.ok ?? false);
    } catch { delivered = false; }

    setBusy(false);
    if (!delivered) { track("rfi_failed"); setFailed(true); return; }

    track("rfi_submitted", { company: d.company?.trim() || "none" });

    writeSent({ name: d.name.trim(), at: Date.now() });
    requestAnimationFrame(() => sentRef.current?.scrollIntoView({ block: "center", behavior: "smooth" }));
  };

  const fld = (n: keyof Errors) => `fld${errs[n] ? " err" : ""}`;

  return (
    <section id="s06" className="sheet">
      <div className="shd rv">
        <span className="no">SHEET 06</span>
        <span className="ti">CONTACT · REQUEST FOR INFORMATION</span>
        <span className="sc">OPEN FOR MARKUP</span>
      </div>
      <h2 className="rv">Send me an RFI.</h2>
      <p className="prose rv" style={{ marginTop: 16 }}>
        Open to conversations about platform engineering, agent infrastructure, and making large
        product surfaces feel fast. Fill this in and it lands in my inbox.
      </p>

      {!sent && (
        <form ref={formRef} className="form rv" onSubmit={onSubmit} noValidate>
          <div className="fh">
            <span>REQUEST FOR INFORMATION</span>
            <span>ALL FIELDS EXCEPT COMPANY REQUIRED</span>
          </div>
          <div className="fb">
            {/* honeypot: hidden from people and from assistive tech, so anything
                that fills it in is a bot. Rejected server-side. */}
            <input type="text" name="botcheck" tabIndex={-1} autoComplete="off"
              aria-hidden="true" className="botcheck" />
            <div className={fld("name")}>
              <label htmlFor="f-name">YOUR NAME</label>
              <input id="f-name" name="name" type="text" autoComplete="name" placeholder="Jane Doe" required />
              <div className="msg">{errs.name}</div>
            </div>
            <div className={fld("email")}>
              <label htmlFor="f-email">EMAIL</label>
              <input id="f-email" name="email" type="email" autoComplete="email" placeholder="jane@company.com" required />
              <div className="msg">{errs.email}</div>
            </div>
            <div className="fld full">
              <label htmlFor="f-co">COMPANY <span style={{ opacity: 0.6 }}>· OPTIONAL</span></label>
              <input id="f-co" name="company" type="text" autoComplete="organization" placeholder="Where you work" />
              <div className="msg" />
            </div>
            <div className={`${fld("message")} full`}>
              <label htmlFor="f-msg">MESSAGE</label>
              <textarea id="f-msg" name="message" placeholder="What would you like to talk about?" required />
              <div className="msg">{errs.message}</div>
            </div>
          </div>
          <div className="ff">
            <span className="note">
              {failed ? (
                <span className="failed">
                  Couldn&rsquo;t send — mail me directly at{" "}
                  <a href={`mailto:${P.email}`}>{P.email}</a>
                </span>
              ) : (
                <>Goes straight to {P.email}</>
              )}
            </span>
            <button className="send" type="submit" disabled={busy}>
              {busy ? <>SENDING <i>···</i></> : <>SEND RFI <i>→</i></>}
            </button>
          </div>
        </form>
      )}

      {sent && (
        <div className="sent on" ref={sentRef}>
          <div className="rs">RECEIVED</div>
          <h3>Logged{sent.name ? `, ${sent.name.split(" ")[0]}` : ""}. I&rsquo;ll come back to you.</h3>
          <p>
            Your message is in my inbox. I read everything and reply to anything with a real question
            in it, usually within a couple of days.
          </p>
          <div className="meta">
            <span>
              SENT {new Date(sent.at)
                .toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })
                .toUpperCase()}
            </span>
            <span>REPLY GOES TO YOUR INBOX</span>
          </div>
        </div>
      )}
    </section>
  );
}
