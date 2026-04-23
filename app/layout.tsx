import "./globals.css";
import type { Metadata } from "next";
import { ReactNode } from "react";
import { FullscreenLoader } from "@/components/fullscreen-loader";

export const metadata: Metadata = {
  title: "SofraQR",
  description: "QR based restaurant menu SaaS with WhatsApp ordering and Paddle subscriptions."
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-0 h-72 bg-[radial-gradient(circle,_rgba(179,75,30,0.22),_transparent_65%)]" />
        <div className="relative z-10">{children}</div>
        <FullscreenLoader />
      </body>
    </html>
  );
}
