"use client";

import PaperCanvas from "@/components/PaperCanvas";
import SheetPlot from "@/components/SheetPlot";
import Sheet01Title from "@/components/Sheet01Title";
import Sheet02Elevation from "@/components/Sheet02Elevation";
import Sheet03Toolchain from "@/components/Sheet03Toolchain";
import Sheet04Assembly from "@/components/Sheet04Assembly";
import Sheet05Recognition from "@/components/Sheet05Recognition";
import Sheet06Contact from "@/components/Sheet06Contact";
import { useReveal } from "@/lib/useReveal";

export default function Page() {
  useReveal();
  return (
    <>
      <PaperCanvas />
      <SheetPlot />
      <main>
        <Sheet01Title />
        <Sheet02Elevation />
        <Sheet03Toolchain />
        <Sheet04Assembly />
        <Sheet05Recognition />
        <Sheet06Contact />
      </main>
      <footer>
        <span>MD ANAS · DRAWING SET · REV 05</span>
        <span>DRAWN IN NEXT.JS · WEBGL2 · SVG</span>
      </footer>
    </>
  );
}
