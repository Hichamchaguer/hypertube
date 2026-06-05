import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hypertube - Stream Thousands of Movies Instantly",
  description: "Hypertube brings the power of BitTorrent streaming to your browser. Watch your favorite movies in HD with no ads.",
};

import { PageTransition } from "@/components/layout/PageTransition";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} h-full antialiased`}>
      <body suppressHydrationWarning className="min-h-full flex flex-col bg-background text-white font-sans shrink-0">
        <PageTransition>
          {children}
        </PageTransition>
      </body>
    </html>
  );
}
