"use client";

import { useEffect } from "react";
import Image, { type StaticImageData } from "next/image";

export type Record = { src: StaticImageData; name: string; when: string };

/** The original award, shown on a mounted drafting frame so it reads as a
 *  detail view of the sheet rather than a photo dropped onto it. */
export default function RecordViewer({ rec, onClose }: { rec: Record | null; onClose: () => void }) {
  useEffect(() => {
    if (!rec) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [rec, onClose]);

  if (!rec) return null;
  return (
    <div id="mount" className="on" role="dialog" aria-modal="true" aria-label={`${rec.name}, ${rec.when}`}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="frame">
        <div className="mh">
          <span><b>{rec.name}</b> &nbsp;·&nbsp; {rec.when}</span>
          <button className="x" type="button" onClick={onClose} autoFocus>CLOSE ✕</button>
        </div>
        <div className="mb">
          {/* no explicit width/height — the static import carries the real ones,
              and the four records are all different shapes */}
          <Image src={rec.src} alt={`${rec.name}, ${rec.when}`} sizes="(max-width: 880px) 92vw, 880px"
            style={{ width: "100%", height: "auto" }} priority />
        </div>
        <div className="mf">ORIGINAL RECORD · TALVIEW</div>
      </div>
    </div>
  );
}
