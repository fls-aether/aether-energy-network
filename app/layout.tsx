import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GlobalNavigation } from "@/components/GlobalNavigation";
import { Providers } from "@/components/Providers";

import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aether Energy Network",
  description: "Tactical Astrological and Metaphysical OS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <div className="absolute top-0 right-0 w-full h-[500px] bg-gradient-to-b from-neon-gold/5 to-transparent pointer-events-none" />
          <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-neon-purple/5 to-transparent pointer-events-none" />

          {children}
          <GlobalNavigation />
        </Providers>
      </body>
    </html>
  );
}
