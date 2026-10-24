"use client";

import { useState } from "react";
import { track } from "@vercel/analytics";
import { COMPONENTS, type Component } from "@/data/projects";

function ExplodedView({ stack }: { stack: string[] }) {
  return (
    <svg viewBox={`0 0 290 ${18 + stack.length * 26 + 18}`} aria-hidden="true">
      {stack.map((s, k) => {
        const y = 18 + k * 26, x = 14 + k * 16;
        return (
          <g key={s}>
            <path d={`M${x} ${y}h92l18 -11h-92Z`} fill="#E6EBF7" stroke="#14161A" strokeWidth="1" />
            <path d={`M${x} ${y}h92v15h-92Z`} fill="#F3F0E8" stroke="#14161A" strokeWidth="1" />
            <path d={`M${x + 92} ${y}l18 -11v15l-18 11Z`} fill="#DCE2F0" stroke="#14161A" strokeWidth="1" />
            <line x1={x + 118} y1={y - 3} x2={x + 146} y2={y - 3} stroke="#1B4BA6" strokeWidth=".8" />
            <text x={x + 150} y={y - 0.5} dominantBaseline="middle">{s}</text>
          </g>
        );
      })}
    </svg>
  );
}

function Row({ c, open, onToggle }: { c: Component; open: boolean; onToggle: () => void }) {
  return (
    <div
      className="cmp"
      role="button"
      tabIndex={0}
      aria-expanded={open}
      onClick={(e) => { if (!(e.target as HTMLElement).closest("a")) onToggle(); }}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onToggle(); } }}
    >
      <div className="top">
        <span className="pn">{c.pn}</span>
        <span className="ttl">{c.t}<small>{c.s}</small></span>
        <span className="qty"><i /></span>
      </div>
      <div className="exp">
        <div>
          <div className="inner">
            <div>
              <p>{c.d}</p>
              <div className="parts">{c.parts.map((p) => <span key={p}>{p}</span>)}</div>
              <div className="links">
                <a className="rd" href={c.repo} target="_blank" rel="noopener noreferrer">OPEN README ↗</a>
                {c.site && (
                  <a className="rd" href={c.site} target="_blank" rel="noopener noreferrer">VISIT SITE ↗</a>
                )}
              </div>
            </div>
            <ExplodedView stack={c.stack} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Sheet04Assembly() {
  /* the first component is open on arrival so the sheet never reads as a bare list */
  const [open, setOpen] = useState<string | null>(COMPONENTS[0]?.pn ?? null);
  return (
    <section id="s04" className="sheet">
      <div className="shd rv">
        <span className="no">SHEET 04</span>
        <span className="ti">PROJECTS · EXPLODED ASSEMBLY</span>
        <span className="sc">{COMPONENTS.length} COMPONENTS</span>
      </div>
      <h2 className="rv">What came off the bench.</h2>
      <p className="prose rv" style={{ marginTop: 16 }}>
        <strong>Click</strong> a component to explode it. Each one links straight to its README.
      </p>
      <div className="asm rv">
        {COMPONENTS.map((c) => (
          <Row key={c.pn} c={c} open={open === c.pn}
            onToggle={() => {
              const next = open === c.pn ? null : c.pn;
              if (next) track("project_expanded", { project: c.t });
              setOpen(next);
            }} />
        ))}
      </div>
    </section>
  );
}
