"use client";

import { useEffect, useRef, useState } from "react";
import { INNER, OUTER, type Part } from "@/data/toolchain";
import { svgEl as E, clamp } from "@/lib/useReveal";

type Node = Part & { x: number; y: number; no: string; ring: string };

const CX = 270, CY = 220, R1 = 104, R2 = 190;

export default function Sheet03Toolchain() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [sel, setSel] = useState<Node | null>(null);

  useEffect(() => {
    const sv = svgRef.current;
    if (!sv || sv.childElementCount) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

    sv.append(
      E("circle", { class: "ring", cx: CX, cy: CY, r: R1 }),
      E("circle", { class: "ring", cx: CX, cy: CY, r: R2 }),
    );
    const gE = E("g"), gN = E("g"), gP = E("g");
    sv.append(gE, gN, gP);

    const built: { node: Node; g: SVGGElement; ed: SVGLineElement }[] = [];
    let num = 0;
    let busy = false;

    const show = (rec: { node: Node; g: SVGGElement; ed: SVGLineElement }) => {
      if (busy) return;
      busy = true;
      built.forEach((b) => { b.g.classList.remove("act"); b.ed.classList.remove("lit"); });
      rec.g.classList.add("act");
      rec.ed.classList.add("lit");
      if (!reduced) {
        const p = E("circle", { class: "pkt", cx: CX, cy: CY, r: 3 });
        gP.appendChild(p);
        const t0 = performance.now();
        const go = (t: number) => {
          const k = clamp((t - t0) / 320, 0, 1), e = k * k * (3 - 2 * k);
          p.setAttribute("cx", String(CX + (rec.node.x - CX) * e));
          p.setAttribute("cy", String(CY + (rec.node.y - CY) * e));
          if (k < 1) requestAnimationFrame(go); else p.remove();
        };
        requestAnimationFrame(go);
      }
      setTimeout(() => {
        setSel(rec.node);
        built.forEach((b) => { if (b !== rec) b.g.classList.remove("done"); });
        rec.g.classList.add("done");
        rec.g.classList.remove("act");
        rec.ed.classList.remove("lit");
        busy = false;
      }, 330);
    };

    const mkNode = (d: Part, x: number, y: number, ring: string) => {
      num++;
      const no = String(num).padStart(2, "0");
      const w = Math.max(50, d.n.length * 5.4 + 16), h = 20;
      const ed = E("line", { class: "edge", x1: CX, y1: CY, x2: x, y2: y });
      gE.appendChild(ed);
      const g = E("g", { class: "nd", tabindex: "0", role: "button", "aria-label": "Spec for " + d.n });
      g.appendChild(E("rect", { x: x - w / 2, y: y - h / 2, width: w, height: h }));
      const t = E("text", { x, y: y + 0.5 }); t.textContent = d.n; g.appendChild(t);
      const bn = E("text", { class: "bnum", x: x + (x > CX ? w / 2 + 11 : -w / 2 - 11), y: y + 0.5 });
      bn.textContent = no; g.appendChild(bn);
      gN.appendChild(g);
      const rec = { node: { ...d, x, y, no, ring }, g, ed };
      built.push(rec);
      g.addEventListener("click", () => show(rec));
      g.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); show(rec); }
      });
    };

    INNER.forEach((d, i) => {
      const a = (i / INNER.length) * 6.2832 - 1.5708 + 0.30;
      mkNode(d, CX + Math.cos(a) * R1, CY + Math.sin(a) * R1, "PRODUCT & DATA");
    });
    OUTER.forEach((d, i) => {
      const a = (i / OUTER.length) * 6.2832 - 1.5708 + 0.14;
      mkNode(d, CX + Math.cos(a) * R2, CY + Math.sin(a) * R2, "DELIVERY & AGENTS");
    });

    const hg = E("g", { class: "nd host" });
    hg.appendChild(E("rect", { x: CX - 56, y: CY - 17, width: 112, height: 34 }));
    const ht = E("text", { x: CX, y: CY + 0.5 }); ht.textContent = "MD ANAS"; hg.appendChild(ht);
    gN.appendChild(hg);
  }, []);

  return (
    <section id="s03" className="sheet">
      <div className="shd rv">
        <span className="no">SHEET 03</span>
        <span className="ti">TOOLCHAIN · PARTS LIST</span>
        <span className="sc">{INNER.length + OUTER.length} PARTS · CLICK FOR SPEC</span>
      </div>
      <h2 className="rv">Every skill is a callable.</h2>
      <p className="prose rv" style={{ marginTop: 16 }}>
        Product and data on the inner ring, delivery and agents on the outer one.{" "}
        <strong>Click</strong> a part — the panel shows what I actually did with it and links its
        official documentation.
      </p>
      <div className="gw">
        <div className="rv">
          <svg ref={svgRef} id="graph" viewBox="14 4 512 432" role="img"
            aria-label="Radial parts diagram of skills as callable tools" />
        </div>
        <div className="rv">
          <div id="spec">
            <div className="sh">
              <span>COMPONENT SPECIFICATION</span>
              <span>{sel ? `ITEM ${sel.no}` : "—"}</span>
            </div>
            <div className="sb">
              {sel ? (
                <>
                  <div className="pn">ITEM {sel.no} · {sel.c}</div>
                  <h3>{sel.n}</h3>
                  <span className="cls">{sel.ring}</span>
                  <p className="xp">{sel.xp}</p>
                  {sel.list && (
                    <>
                      <div className="ulh">AGENTS IN ROTATION</div>
                      <div className="ul">
                        {sel.list.map(([a, b]) => (
                          <div className="li" key={a}><b>{a}</b><span>{b}</span></div>
                        ))}
                      </div>
                    </>
                  )}
                  <a className="doc" href={sel.u} target="_blank" rel="noopener noreferrer">
                    OPEN OFFICIAL DOCS <i>↗</i>
                  </a>
                </>
              ) : (
                <div className="idle">
                  &rsaquo; click a part on the diagram<br />
                  &rsaquo; its spec and official docs open here
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
