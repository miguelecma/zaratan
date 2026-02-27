import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { Navbar } from "./_components/Navbar";
import { QuoteProvider } from "@/app/_contexts/QuoteContext/Provider";
import RrwebCapture from "@/app/_components/RrwebCapture";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Classic Cocktails",
  description: "Generating Experiences",
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
        <Script
          src="https://cdn.jsdelivr.net/npm/rrweb@latest/dist/rrweb.min.js"
          strategy="afterInteractive"
        />
        <QuoteProvider>
          <div className="relative min-h-20">
            <Navbar />
          </div>
          <RrwebCapture bufferSize={200} />
          {children}
        </QuoteProvider>
      </body>
    </html>
  );
}
