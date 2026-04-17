import type { Metadata, Viewport } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Plus_Jakarta_Sans, Geist_Mono } from "next/font/google"; // Vervang Geist door Jakarta
import "./globals.css";
import Navbar from "@/components/Navbar";
import { TooltipProvider } from "@/components/ui/tooltip";

// 1. Laad Plus Jakarta Sans voor de serieuze 'PetCheck' vibe
const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"], // Genoeg variatie voor dikke koppen
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PetCheck.ai - Slimme zorg voor je hond",
  description: "AI-gestuurde gezondheidscheck voor honden",
  manifest: "/manifest.json",
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
    <ClerkProvider>
      <html lang="nl">
        <body
          /* 2. Voeg de nieuwe font-variable toe en zet font-jakarta als standaard */
          className={`${jakarta.variable} ${geistMono.variable} font-jakarta antialiased`}>
          <TooltipProvider delayDuration={0}>
            <Navbar />
            {children}
          </TooltipProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
