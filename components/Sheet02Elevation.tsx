"use client";

import { useEffect, useRef, useState } from "react";
import { UPPER, LOWER, type Block } from "@/data/platform";
import { svgEl as E } from "@/lib/useReveal";

const ALL: Block[] = [...UPPER, ...LOWER];

export default function Sheet02Elevation() {
  const svgRef = useRef<SVGSVGElement>(null);
  /* the first block is open on arrival so the detail panel is never empty */
  const [sel, setSel] = useState<number | null>(0);

  useEffect(() => {
    const sv = svgRef.current;
    if (!sv || sv.childElementCount) return;

    const defs = E("defs");
    const mk = E("marker", {
      id: "ar", viewBox: "0 0 10 8", refX: "9", refY: "4",
      markerWidth: "8", markerHeight: "7", orient: "auto",
    });
    mk.appendChild(E("path", { d: "M0 0L10 4L0 8Z", fill: "#14161A" }));
    defs.appendChild(mk);
    const hx = E("pattern", {
      id: "hx", width: "7", height: "7",
      patternUnits: "userSpaceOnUse", patternTransform: "rotate(45)",
    });
    hx.appendChild(E("line", {
      x1: "0", y1: "0", x2: "0", y2: "7",
      stroke: "#1B4BA6", "stroke-width": "1.1", "stroke-opacity": ".45",
    }));
    defs.appendChild(hx);
    sv.appendChild(defs);

    const SPAN = 900, X0 = (980 - SPAN) / 2;
    const N = UPPER.length, G = 16, W = (SPAN - (N - 1) * G) / N, Y = 52, H = 58;
    const groups: SVGGElement[] = [];

    const wire = (g: SVGGElement, i: number) => {
      const open = () => setSel(i);
      g.addEventListener("click", open);
      g.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); }
      });
    };

    UPPER.forEach((s, i) => {
      const x = X0 + i * (W + G);
      const g = E("g", { class: "stage", tabindex: "0", role: "button", "aria-label": "Detail for " + s.k });
      g.appendChild(E("rect", { class: "hatch", x: x + 1, y: Y + 1, width: W - 2, height: H - 2 }));
      g.appendChild(E("rect", { class: "st-box", x, y: Y, width: W, height: H }));
      const a = E("text", { class: "st-l", x: x + W / 2, y: Y + 26 }); a.textContent = s.k; g.appendChild(a);
      const b = E("text", { class: "st-n", x: x + W / 2, y: Y + 44 }); b.textContent = s.g[0]; g.appendChild(b);
      g.appendChild(E("circle", { class: "bal", cx: x + W / 2, cy: 22, r: 11 }));
      const n = E("text", { class: "balt", x: x + W / 2, y: 22.5 }); n.textContent = String(i + 1); g.appendChild(n);
      g.appendChild(E("line", { class: "dimln", x1: x + W / 2, y1: 33, x2: x + W / 2, y2: Y, stroke: "#C8C2B4" }));
      const L = E("path", { class: "lead", d: `M${x + W / 2} ${Y + H} V${Y + H + 16}` });
      g.appendChild(L);
      L.style.setProperty("--L", String(L.getTotalLength()));
      g.appendChild(E("circle", { class: "lead-dot", cx: x + W / 2, cy: Y + H + 16, r: 2.6 }));
      sv.appendChild(g); groups.push(g); wire(g, i);
      if (i < N - 1) sv.appendChild(E("line", { class: "flow", x1: x + W, y1: Y + H / 2, x2: x + W + G - 3, y2: Y + H / 2 }));
    });

    /* grade line between the feature tier and the platform it stands on */
    const GY = Y + H + 24;
    sv.appendChild(E("line", { class: "ax", x1: X0 - 14, y1: GY, x2: X0 + SPAN + 14, y2: GY, stroke: "#14161A", "stroke-width": "1.4" }));
    for (let k = 0; k < 26; k++)
      sv.appendChild(E("line", { x1: X0 - 14 + k * 36, y1: GY, x2: X0 - 22 + k * 36, y2: GY + 8, stroke: "#C8C2B4", "stroke-width": ".9" }));
    const M = LOWER.length, LG = 16, LW = (SPAN - (M - 1) * LG) / M, LY = GY + 50, LH = 40;
    LOWER.forEach((s, j) => {
      const i = N + j, x = X0 + j * (LW + LG);
      const g = E("g", { class: "stage", tabindex: "0", role: "button", "aria-label": "Detail for " + s.k });
      g.appendChild(E("rect", { class: "hatch", x: x + 1, y: LY + 1, width: LW - 2, height: LH - 2 }));
      g.appendChild(E("rect", { class: "st-box", x, y: LY, width: LW, height: LH }));
      const a = E("text", { class: "st-l", x: x + LW / 2, y: LY + 16 }); a.textContent = s.k.split(" · ")[0]; g.appendChild(a);
      const b = E("text", { class: "st-n", x: x + LW / 2, y: LY + 30 }); b.textContent = s.g[0]; g.appendChild(b);
      g.appendChild(E("circle", { class: "bal", cx: x + LW / 2, cy: LY - 26, r: 11 }));
      const n = E("text", { class: "balt", x: x + LW / 2, y: LY - 25.5 }); n.textContent = String(i + 1); g.appendChild(n);
      g.appendChild(E("line", { class: "dimln", x1: x + LW / 2, y1: LY - 15, x2: x + LW / 2, y2: LY, stroke: "#C8C2B4" }));
      sv.appendChild(g); groups.push(g); wire(g, i);
    });

    const dy = LY + LH + 30, x1 = X0, x2 = X0 + SPAN;
    sv.appendChild(E("line", { class: "dimln", x1, y1: dy - 12, x2: x1, y2: dy + 6 }));
    sv.appendChild(E("line", { class: "dimln", x1: x2, y1: dy - 12, x2: x2, y2: dy + 6 }));
    sv.appendChild(E("line", { class: "dimln", x1, y1: dy, x2: x2, y2: dy }));
    sv.appendChild(E("path", { d: `M${x1} ${dy}l9 -3.4v6.8Z`, fill: "#BE3A2A" }));
    sv.appendChild(E("path", { d: `M${x2} ${dy}l-9 -3.4v6.8Z`, fill: "#BE3A2A" }));
    const dt = E("text", { class: "dimt", x: (x1 + x2) / 2, y: dy - 6 });
    dt.textContent = "21 FEATURE DOMAINS  ·  220k LOC  ·  MIGRATED v7 → v8";
    sv.appendChild(dt);

  }, []);

  useEffect(() => {
    const sv = svgRef.current;
    if (!sv) return;
    sv.querySelectorAll(".stage").forEach((g, k) => g.classList.toggle("on", k === sel));
  }, [sel]);

  const s = sel === null ? null : ALL[sel];
  const upper = sel !== null && sel < UPPER.length;

  return (
    <section id="s02" className="sheet">
      <div className="shd rv">
        <span className="no">SHEET 02</span>
        <span className="ti">RECRUITMENT PLATFORM · SECTIONAL ELEVATION</span>
        <span className="sc">{UPPER.length + LOWER.length} BLOCKS · REV 05</span>
      </div>
      <h2 className="rv">The platform I build on, in section.</h2>
      <p className="prose rv" style={{ marginTop: 16 }}>
        Talview&rsquo;s recruitment platform — a 220k-line module I migrated from a legacy v7 app to a new
        v8 architecture across 21 feature domains. Feature surfaces above the line, the platform layers
        they stand on below it. <strong>Click</strong> any block for its detail note.
      </p>
      <div className="inst rv">
        <div className="bar">
          <span>SECTION A–A · 220k LOC · REACT 18 + TS + TURBOREPO · v7 → v8</span>
          <span><b>{s ? s.k : "—"}</b></span>
        </div>
        <div className="bd">
          <svg ref={svgRef} id="elev" viewBox="0 0 980 288" role="img"
            aria-label="Sectional elevation of the recruitment platform" />
        </div>
        <div className="noteout">
          <div className="nh">
            <span>{s ? `DETAIL ${String.fromCharCode(65 + sel!)}  ·  ${s.k}` : "DETAIL —"}</span>
            <span>
              {s ? (upper ? `FEATURE DOMAIN ${sel! + 1} OF ${UPPER.length}`
                          : `PLATFORM LAYER ${sel! - UPPER.length + 1} OF ${LOWER.length}`) : "SCALE 2:1"}
            </span>
          </div>
          {s ? (
            <div>
              <h3>{s.t}</h3>
              <p>{s.d}</p>
              <div className="tags">{s.g.map((t) => <span key={t}>{t}</span>)}</div>
            </div>
          ) : (
            <p className="idle">&rsaquo; click a block above to open its detail note</p>
          )}
        </div>
      </div>
    </section>
  );
}
