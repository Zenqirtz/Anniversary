import type { Metadata, Viewport } from "next";
import { Orbitron, Rajdhani, Share_Tech_Mono, Dancing_Script } from "next/font/google";
import "./globals.css";

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  display: "swap",
});

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-rajdhani",
  display: "swap",
});

const shareTechMono = Share_Tech_Mono({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-share-tech-mono",
  display: "swap",
});

const dancing = Dancing_Script({
  subsets: ["latin"],
  variable: "--font-dancing",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Brankas Rahasia | Secret Love Archive",
  description: "Arsip digital cinta rahasia — sebuah surat cinta digital yang tersimpan dalam brankas.",
  openGraph: {
    title: "Brankas Rahasia",
    description: "Arsip digital cinta rahasia",
    type: "website",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#dbeafe",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth">
      <body
        className={`${orbitron.variable} ${rajdhani.variable} ${shareTechMono.variable} ${dancing.variable} font-rajdhani antialiased text-slate-800 min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
