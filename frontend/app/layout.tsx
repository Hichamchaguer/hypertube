import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hypertube - Stream Thousands of Movies Instantly",
  description: "Hypertube brings the power of BitTorrent streaming to your browser. Watch your favorite movies in HD with no ads.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Hypertube",
  },
};

export const viewport = {
  themeColor: "#ef4444",
};

import { PageTransition } from "@/components/layout/PageTransition";
import { PWARegister } from "@/components/PWARegister";

import { LazyMotion, domAnimation } from "framer-motion";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} h-full antialiased`}>
      <head>
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://image.tmdb.org" />
      </head>
      <body suppressHydrationWarning className="min-h-full flex flex-col bg-background text-white font-sans shrink-0">
        <PWARegister />
        <LazyMotion features={domAnimation}>
          <PageTransition>
            {children}
          </PageTransition>
        </LazyMotion>
      </body>
    </html>
  );
}
