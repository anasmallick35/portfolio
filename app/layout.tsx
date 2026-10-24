import type { Metadata, Viewport } from "next";
import "./globals.css";

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
    <html lang="en">
      <head>
        <link rel="preload" href="/fonts/archivo.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/jbm.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  );
}
