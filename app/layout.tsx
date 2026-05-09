import type { Metadata, Viewport } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { nlNL } from "@clerk/localizations";
import { InstallPrompt } from "@/components/InstallPrompt";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Doggyscan.nl - Slimme zorg voor je hond",
  description: "AI-gestuurde gezondheidscheck voor honden",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent", // Geeft een meer 'native' app gevoel
    title: "Doggyscan",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      // iOS gebruikt bij voorkeur 180x180. Als je deze niet hebt,
      // zorg dan dat de 192x192 GEEN transparante achtergrond heeft.
      { url: "/icons/icon-192x192.png", sizes: "180x180", type: "image/png" },
    ],
    // Dit dwingt Safari om het icoon te herkennen
    other: [
      {
        rel: "apple-touch-icon",
        url: "/icons/icon-192x192.png",
      },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#4FC3F7",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider localization={nlNL}>
      <html lang="nl" className="scroll-smooth">
        <body
          className={`${jakarta.variable} ${geistMono.variable} font-jakarta antialiased`}>
          <TooltipProvider delayDuration={0}>
            <Navbar />
            <main>{children}</main>
            <InstallPrompt />
          </TooltipProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
