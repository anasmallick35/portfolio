"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AWARDS, QUARTERS } from "@/data/awards";
import { svgEl as E } from "@/lib/useReveal";
import RecordViewer, { type Record } from "./RecordViewer";

const CTA_IDLE = "CLICK TO READ";
const CTA_OPEN = "OPEN BELOW \u2193";

export default function Sheet05Recognition() {
  const svgRef = useRef<SVGSVGElement>(null);
  const recsRef = useRef<HTMLDivElement>(null);
  /* the first award is open on arrival. Set directly rather than through
     selectAndReveal, which would scroll the page on load. */
  const [sel, setSel] = useState<number | null>(0);

  /* selecting from the plot has to bring the record it opened into view —
     otherwise the citation expands somewhere off-screen and nothing appears
     to happen. Selecting the record itself is already in view, so it stays put. */
  const selectAndReveal = useCallback((i: number) => {
    setSel(i);
    requestAnimationFrame(() =>
      recsRef.current?.children[i]?.scrollIntoView({ block: "center", behavior: "smooth" }));
  }, []);
  const [rec, setRec] = useState<Record | null>(null);

  useEffect(() => {
    const sv = svgRef.current;
    if (!sv || sv.childElementCount) return;

    const BASE = 196, TOP = 26, L = 58, R = 820;
    const colW = (R - L) / QUARTERS.length, UW = 118;

    /* Scale the axis to the data and make one award exactly one axis unit, so a
       block's height means what the gridlines say it does. Headroom of one keeps
       the plot from looking maxed out. */
    const perQuarter = QUARTERS.map((_, qi) => AWARDS.filter((a) => a.q === qi).length);
    const MAX = Math.max(2, Math.max(...perQuarter) + 1);
    const UH = (BASE - TOP) / MAX;

    for (let k = 0; k <= MAX; k++) {
      const y = BASE - UH * k;
      sv.appendChild(E("line", { class: "gr", x1: L, y1: y, x2: R, y2: y }));
      const t = E("text", { class: "yl", x: L - 8, y: y + 3 }); t.textContent = String(k);
      sv.appendChild(t);
    }
    sv.appendChild(E("line", { class: "ax", x1: L, y1: TOP, x2: L, y2: BASE }));
    sv.appendChild(E("line", { class: "ax", x1: L, y1: BASE, x2: R, y2: BASE }));
    const yt = E("text", { class: "yl", x: L - 8, y: TOP - 9, "text-anchor": "end" });
    yt.textContent = "AWARDS"; sv.appendChild(yt);

    QUARTERS.forEach((q, qi) => {
      const cx = L + colW * qi + colW / 2;
      const inQ = AWARDS.map((a, i) => ({ a, i })).filter((o) => o.a.q === qi);
      inQ.forEach((o, k) => {
        const y = BASE - (k + 1) * UH;
        const g = E("g", { class: "unit", tabindex: "0", role: "button", "aria-label": `${o.a.name}, ${q}` });
        g.appendChild(E("rect", { x: cx - UW / 2, y: y + 1, width: UW, height: UH - 2 }));
        const t1 = E("text", { x: cx, y: y + UH / 2 - 6 }); t1.textContent = o.a.short; g.appendChild(t1);
        const t2 = E("text", { class: "sub", x: cx, y: y + UH / 2 + 8, "font-size": "6.5", opacity: ".55" });
        t2.textContent = CTA_IDLE; g.appendChild(t2);
        sv.appendChild(g);
        g.dataset.i = String(o.i);
        const pick = () => selectAndReveal(o.i);
        g.addEventListener("click", pick);
        g.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pick(); }
        });
      });
      if (!inQ.length) {
        const g = E("g", { class: "open" });
        g.appendChild(E("rect", { x: cx - UW / 2, y: BASE - UH, width: UW, height: UH }));
        const t = E("text", { x: cx, y: BASE - UH / 2 + 3 }); t.textContent = "IN PROGRESS"; g.appendChild(t);
        sv.appendChild(g);
      }
      const ql = E("text", { class: "ql", x: cx, y: BASE + 18 }); ql.textContent = q; sv.appendChild(ql);
      sv.appendChild(E("line", { class: "gr", x1: L + colW * (qi + 1), y1: TOP, x2: L + colW * (qi + 1), y2: BASE + 6 }));
    });
  }, [selectAndReveal]);

  useEffect(() => {
    svgRef.current?.querySelectorAll<SVGGElement>(".unit").forEach((u) => {
      const on = Number(u.dataset.i) === sel;
      u.classList.toggle("sel", on);
      /* the open block has already been clicked — point at where its citation went */
      const sub = u.querySelector("text.sub");
      if (sub) sub.textContent = on ? CTA_OPEN : CTA_IDLE;
    });
  }, [sel]);

  return (
    <section id="s05" className="sheet">
      <div className="shd rv">
        <span className="no">SHEET 05</span>
        <span className="ti">RECOGNITION · QUARTERLY RECORD</span>
        <span className="sc">{AWARDS.length} AWARDS · EVERY QUARTER</span>
      </div>
      <h2 className="rv">Recognised every quarter since I joined.</h2>
      <p className="prose rv" style={{ marginTop: 16 }}>
        Named in every recognition cycle since I started.{" "}
        <strong>Click</strong> a block on the plot, or a record, to read the citation and open the original.
      </p>
      <div className="inst rv">
        <div className="bar">
          <span>AWARDS PER QUARTER</span>
          <span><b>{sel === null ? "SELECT A BLOCK" : AWARDS[sel].name}</b></span>
        </div>
        <div className="bd">
          <svg ref={svgRef} id="hist" viewBox="0 0 860 250" role="img" aria-label="Recognitions per quarter" />
        </div>
      </div>
      <div className="recs rv" ref={recsRef}>
        {AWARDS.map((a, i) => (
          <div key={a.name} className={`rec${sel === i ? " sel" : ""}`} role="button" tabIndex={0}
            onClick={(e) => { if (!(e.target as HTMLElement).closest(".view")) setSel(i); }}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setSel(i); } }}>
            <div className="rh"><span>{a.name}</span><b>{QUARTERS[a.q]}</b></div>
            <div className="rb">
              <h3>{a.t}</h3>
              <p className="sum">{a.sum}</p>
              <q>{a.cite}</q>
              <button className="view" type="button"
                onClick={() => setRec({ src: a.img, name: a.name, when: QUARTERS[a.q] })}>
                VIEW ORIGINAL RECORD ↗
              </button>
            </div>
          </div>
        ))}
      </div>
      <RecordViewer rec={rec} onClose={() => setRec(null)} />
    </section>
  );
}
