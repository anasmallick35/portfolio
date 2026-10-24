/** The RFI success state lives in localStorage so it survives a refresh.
 *  Exposed as an external store rather than read into state inside an effect —
 *  that keeps it SSR-safe (the server snapshot is simply null) and avoids the
 *  cascading render a setState-in-effect would cause. */

export const LS_KEY = "anas.rfi.v1";

export type Sent = { name: string; at: number };

const listeners = new Set<() => void>();
/** `undefined` means "not yet read / invalidated". A genuinely absent key reads
 *  back as `null`, so null cannot double as the invalidation sentinel. */
let cachedRaw: string | null | undefined;
let cachedVal: Sent | null = null;

export function readSent(): Sent | null {
  let raw: string | null = null;
  try { raw = localStorage.getItem(LS_KEY); } catch { raw = null; }
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    try {
      const parsed = raw ? (JSON.parse(raw) as Sent) : null;
      cachedVal = parsed?.at ? parsed : null;
    } catch { cachedVal = null; }
  }
  return cachedVal;
}

export function writeSent(v: Sent) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(v));
  } catch { /* storage unavailable — the in-memory snapshot still updates */ }
  cachedRaw = undefined;
  listeners.forEach((l) => l());
}

export function subscribeSent(cb: () => void) {
  listeners.add(cb);
  addEventListener("storage", cb);
  return () => { listeners.delete(cb); removeEventListener("storage", cb); };
}

/** Server render has no storage; start from the form. */
export const serverSent = () => null;
