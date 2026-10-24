"use client";

import { useEffect, useRef } from "react";

const NS = "http://www.w3.org/2000/svg";
const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);

type Item = { el: SVGElement; text: boolean; len: number; dur: number; t0: number };

/** The sheet behind the content: four drawings of the real systems — the platform's
 *  feature domains, a rack elevation, the DevPod array and the MCP fan-out — plotted
 *  line by line by a travelling head, then periodically revised. */
export default function SheetPlot() {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = host.current;
    if (!mount) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

    const E = <K extends keyof SVGElementTagNameMap>(
      n: K, a: Record<string, string | number> = {},
    ): SVGElementTagNameMap[K] => {
      const e = document.createElementNS(NS, n);
      for (const k in a) e.setAttribute(k, String(a[k]));
      return e;
    };

    const svg = E("svg", { viewBox: "0 0 2600 1700", "aria-hidden": "true" });
    const gRoot = E("g");
    svg.appendChild(gRoot);
    mount.appendChild(svg);

    const seq: SVGElement[] = [];
    const add = (el: SVGElement) => { gRoot.appendChild(el); seq.push(el); return el; };
    const path = (d: string, cls = "dw") => add(E("path", { class: cls, d })) as SVGPathElement;
    const rect = (x: number, y: number, w: number, h: number, cls = "dw") =>
      path(`M${x} ${y}H${x + w}V${y + h}H${x}Z`, cls);
    const line = (x1: number, y1: number, x2: number, y2: number, cls = "dw") =>
      path(`M${x1} ${y1}L${x2} ${y2}`, cls);
    const txt = (x: number, y: number, s: string, cls = "dwt", extra: Record<string, string> = {}) => {
      const t = E("text", { class: cls, x, y, ...extra });
      t.textContent = s;
      gRoot.appendChild(t);
      t.style.opacity = "0";
      seq.push(t);
      return t;
    };
    const dim = (x1: number, y: number, x2: number, label: string) => {
      line(x1, y - 14, x1, y + 6, "dw thin");
      line(x2, y - 14, x2, y + 6, "dw thin");
      line(x1, y, x2, y, "dw red");
      path(`M${x1} ${y}l9 -3.4v6.8Z`, "dw red fill");
      path(`M${x2} ${y}l-9 -3.4v6.8Z`, "dw red fill");
      txt((x1 + x2) / 2, y - 6, label, "dwt", { "text-anchor": "middle", fill: "var(--red)" });
    };
    const bubble = (x: number, y: number, r: number, label: string) => {
      path(`M${x + r} ${y}A${r} ${r} 0 1 1 ${x - r} ${y}A${r} ${r} 0 1 1 ${x + r} ${y}`, "dw hid");
      txt(x, y - r - 5, label, "dwt sm", { "text-anchor": "middle" });
    };

    /* DRG. 01 — feature domains, routed orthogonally */
    txt(150, 150, "DRG. 01  —  RECRUITMENT PLATFORM / FEATURE DOMAINS  —  PLAN");
    line(150, 165, 980, 165);
    const PIPE = ["REQ", "PIPE", "BULK", "AUTO", "EVAL", "SCHED"];
    PIPE.forEach((n, i) => {
      const x = 150 + i * 138, y = 230;
      rect(x, y, 104, 58);
      txt(x + 52, y + 34, n, "dwt", { "text-anchor": "middle" });
      if (i < PIPE.length - 1) {
        line(x + 104, y + 29, x + 126, y + 29);
        path(`M${x + 138} ${y + 29}l-11 -4v8Z`, "dw fill");
      }
      line(x + 52, y + 58, x + 52, y + 96, "dw thin");
      bubble(x + 52, y + 110, 13, String(i + 1));
    });
    dim(150, 350, 980, "21 DOMAINS · 220k LOC · v7 → v8");
    path("M832 230 V196 H202 V230", "dw hid");
    txt(430, 190, "REJECT / RE-ROUTE", "dwt sm");

    /* DRG. 02 — rack elevation */
    txt(1180, 150, "DRG. 02  —  COMPUTE / RACK ELEVATION  —  FRONT");
    line(1180, 165, 1560, 165);
    rect(1210, 210, 250, 520);
    for (let u = 0; u < 13; u++) {
      line(1210, 230 + u * 38, 1460, 230 + u * 38, "dw thin");
      if (u % 3 === 0) rect(1420, 236 + u * 38, 26, 26, "dw fill");
    }
    line(1225, 210, 1225, 730, "dw ctr");
    dim(1210, 770, 1460, "42U");
    txt(1210, 196, "DEVPOD HOST", "dwt sm");

    /* DRG. 03 — DevPod array */
    txt(150, 470, "DRG. 03  —  DEVPOD ARRAY  —  12 CONCURRENT");
    line(150, 485, 760, 485);
    for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) {
      const x = 150 + c * 152, y = 520 + r * 86;
      rect(x, y, 124, 62);
      const running = (r * 4 + c) % 3 !== 2;
      if (running) for (let k = 0; k < 9; k++) line(x + 6 + k * 14, y + 58, x + 6 + k * 14 + 18, y + 4, "dw thin");
      txt(x + 62, y + 34, `POD-${r * 4 + c + 1} ${running ? "RUN" : "IDLE"}`, "dwt sm", { "text-anchor": "middle" });
    }
    dim(150, 810, 730, "12 × ISOLATED BRANCH");

    /* DRG. 04 — MCP fan-out */
    txt(1180, 870, "DRG. 04  —  MCP HOST / AGENT FAN-OUT  —  SCHEMATIC");
    line(1180, 885, 1700, 885);
    rect(1370, 930, 150, 46);
    txt(1445, 956, "MCP HOST", "dwt", { "text-anchor": "middle" });
    ["skills", "subagents", "hooks", "workflows", "evals", "review"].forEach((n, i) => {
      const x = 1200 + i * 98, y = 1080;
      line(1445, 976, 1445, 1030);
      line(x + 40, 1030, 1445, 1030);
      line(x + 40, 1030, x + 40, y);
      rect(x, y, 80, 34, "dw thin");
      txt(x + 40, y + 20, n, "dwt sm", { "text-anchor": "middle" });
    });
    dim(1200, 1160, 1668, "6 TYPED ROLES");

    /* section marker, detail bubble, revision cloud, general notes */
    line(140, 900, 140, 1240, "dw ctr");
    txt(118, 890, "A");
    path("M140 1240l-7 -12h14Z", "dw red fill");
    path("M960 1000 A130 130 0 1 1 959 1000", "dw hid");
    txt(900, 860, "DETAIL A  ·  SCALE 2:1", "dwt sm");
    {
      let d = "M1760 1330";
      const pts = 14, R = 86;
      for (let i = 0; i <= pts; i++) {
        const a = (i / pts) * 6.2832;
        d += ` A26 26 0 0 1 ${(1760 + Math.cos(a) * R * 1.5).toFixed(1)} ${(1330 + Math.sin(a) * R * 0.55).toFixed(1)}`;
      }
      path(d, "dw red");
    }
    txt(1700, 1250, "REV 05  ·  RxDB DATA LAYER  ·  2026");
    txt(150, 1400, "NOTE 1 — ALL TIMINGS MEASURED ON PRODUCTION TRAFFIC.");
    txt(150, 1424, "NOTE 2 — AGENT OUTPUT GATED BY REVIEW BEFORE MERGE.");
    txt(150, 1448, "NOTE 3 — DRAWING REFLECTS STATE AT REV 05. SUBJECT TO MARKUP.");

    /* plotter head */
    const plot = E("g", { id: "plot" });
    plot.append(E("path", { d: "M-13 0H13M0 -13V13" }), E("circle", { r: "5.5", fill: "none" }));
    svg.appendChild(plot);
    plot.style.opacity = "0";

    const items: Item[] = [];
    let acc = 0;
    for (const el of seq) {
      const isText = el.tagName === "text";
      const len = isText ? 0 : (el as SVGPathElement).getTotalLength() || 1;
      if (!isText) {
        el.style.strokeDasharray = String(len);
        el.style.strokeDashoffset = String(len);
      }
      const dur = isText ? 140 : clamp(len * 1.5, 90, 620);
      items.push({ el, text: isText, len, dur, t0: acc });
      acc += dur + 24;
    }
    const TOTAL = acc;

    const plotAt = (ms: number) => {
      let head: { x: number; y: number } | null = null;
      for (const it of items) {
        const p = clamp((ms - it.t0) / it.dur, 0, 1);
        if (it.text) { it.el.style.opacity = p > 0.5 ? "" : "0"; }
        else {
          it.el.style.strokeDashoffset = String(it.len * (1 - p));
          if (p > 0 && p < 1) head = (it.el as SVGPathElement).getPointAtLength(it.len * p);
        }
      }
      if (head) {
        plot.style.opacity = ".85";
        plot.setAttribute("transform", `translate(${head.x} ${head.y})`);
      } else plot.style.opacity = ms < TOTAL ? ".35" : "0";
    };

    let raf = 0;
    if (reduced) plotAt(TOTAL + 1);
    else {
      const S = performance.now() + 420;
      let revT = TOTAL + 9000, revIdx = -1, revS = 0;
      const run = (n: number) => {
        raf = requestAnimationFrame(run);
        const ms = n - S;
        if (ms < TOTAL + 200) { plotAt(ms); return; }
        /* once the sheet is drawn, periodically erase one element and re-plot it */
        if (ms > revT) {
          if (revIdx < 0) {
            revIdx = (Math.random() * items.length) | 0;
            revS = ms;
            const it = items[revIdx];
            if (it.text) it.el.style.opacity = "0";
            else it.el.style.strokeDashoffset = String(it.len);
          }
          const it = items[revIdx];
          const p = clamp((ms - revS) / (it.dur * 2.2), 0, 1);
          if (it.text) { it.el.style.opacity = p > 0.5 ? "" : "0"; plot.style.opacity = p < 1 ? ".7" : "0"; }
          else {
            it.el.style.strokeDashoffset = String(it.len * (1 - p));
            if (p < 1) {
              const pt = (it.el as SVGPathElement).getPointAtLength(it.len * p);
              plot.style.opacity = ".85";
              plot.setAttribute("transform", `translate(${pt.x} ${pt.y})`);
            } else plot.style.opacity = "0";
          }
          if (p >= 1) { revIdx = -1; revT = ms + 9000 + Math.random() * 9000; }
        }
      };
      raf = requestAnimationFrame(run);
    }

    /* parallax — composited CSS transform on the <svg> layer, never an SVG attribute
       on <g>, which would re-rasterize every vector in the sheet each frame */
    let py = 0, tpy = 0, last = "", praf = 0;
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - innerHeight;
      tpy = clamp(scrollY / Math.max(h, 1), 0, 1);
    };
    addEventListener("scroll", onScroll, { passive: true });
    const par = () => {
      praf = requestAnimationFrame(par);
      py += (tpy - py) * 0.06;
      const w = window as Window & { __mx?: number; __my?: number };
      const mx = (w.__mx || 0) * 14, my = (w.__my || 0) * 9;
      const t =
        `translate(-50%,-50%) translate3d(${(-py * 230 - mx).toFixed(1)}px,${(-py * 300 + my).toFixed(1)}px,0)` +
        ` rotate(${((py - 0.5) * 0.5).toFixed(3)}deg)`;
      if (t !== last) { svg.style.transform = t; last = t; }
    };
    praf = requestAnimationFrame(par);

    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(praf);
      removeEventListener("scroll", onScroll);
      svg.remove();
    };
  }, []);

  return <div id="sheet" ref={host} aria-hidden="true" />;
}
