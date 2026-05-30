import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vision Plate",
  description: "AI Calorie Tracker",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0D0D0D",
};

import { DiaryProvider } from "@/context/DiaryContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col md:flex-row bg-background text-foreground">
        <DiaryProvider>
          {/* Mobile: Top content, Bottom Nav | Desktop: Left Sidebar, Right content */}
          <Navigation className="hidden md:flex md:w-20 lg:w-56" />
          <main className="flex-1 pb-20 md:pb-0 h-[100dvh] overflow-y-auto w-full max-w-full">
            {children}
          </main>
          <Navigation className="md:hidden fixed bottom-0 left-0 right-0 z-50" isMobile />
        </DiaryProvider>
      </body>
    </html>
  );
}
