import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

/* Self-hosted through next/font: one request per face, correctly preloaded,
   no CDN. Hand-rolling @font-face plus a <link rel="preload"> fetched each
   face twice because the preload never matched the stylesheet's request. */
const archivo = localFont({
  src: "../public/fonts/archivo.woff2",
  variable: "--font-archivo",
  weight: "100 900",
  display: "block",
});

const jbm = localFont({
  src: "../public/fonts/jbm.woff2",
  variable: "--font-jbm",
  weight: "300 700",
  display: "block",
});

const DESC =
  "Md Anas — software engineer at Talview. I build large product interfaces that stay fast " +
  "under real traffic, and the AI coding-agent infrastructure that makes shipping them faster.";

export const metadata: Metadata = {
  metadataBase: new URL("https://mdanas.dev"),
  title: "Md Anas — Software Engineer",
  description: DESC,
  authors: [{ name: "Md Anas", url: "https://github.com/anasmallick35" }],
  keywords: [
    "Md Anas", "software engineer", "frontend engineer", "React", "TypeScript",
    "RxDB", "Talview", "AI coding agents", "MCP", "Bengaluru",
  ],
  openGraph: {
    type: "profile",
    title: "Md Anas — Software Engineer",
    description: DESC,
    siteName: "Md Anas",
  },
  twitter: { card: "summary_large_image", title: "Md Anas — Software Engineer", description: DESC },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#EAE6DB",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${archivo.variable} ${jbm.variable}`}>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
