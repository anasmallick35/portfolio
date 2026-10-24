"use client";

import { useEffect } from "react";

/** Adds `.in` to every `.rv` as it enters the viewport, once. */
export function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }),
      { threshold: 0.1, rootMargin: "0px 0px -6% 0px" },
    );
    document.querySelectorAll(".rv").forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);
}

export const NS = "http://www.w3.org/2000/svg";

export function svgEl<K extends keyof SVGElementTagNameMap>(
  n: K, a: Record<string, string | number> = {},
): SVGElementTagNameMap[K] {
  const e = document.createElementNS(NS, n);
  for (const k in a) e.setAttribute(k, String(a[k]));
  return e;
}

export const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);
