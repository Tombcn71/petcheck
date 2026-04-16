import type { Metadata, Viewport } from "next";
import {
  ClerkProvider,
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
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
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <div className="navbar-wrapper">
            <nav className="navbar">
              <Link href="/" className="nav-logo">
                <div className="nav-logo-icon">🐾</div>
                <span className="nav-logo-text">PetCheck.ai</span>
              </Link>
              <div className="nav-links">
                <a href="#features" className="hidden-mobile">
                  Mogelijkheden
                </a>
                <Show when="signed-out">
                  <SignInButton mode="modal">
                    <button className="btn-nav-outline">Inloggen</button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button className="btn-nav">Start nu</button>
                  </SignUpButton>
                </Show>
                <Show when="signed-in">
                  <Link href="/dashboard" className="btn-nav">
                    Dashboard
                  </Link>
                  <UserButton
                    appearance={{
                      elements: { userButtonAvatarBox: "w-9 h-9" },
                    }}
                  />
                </Show>
              </div>
            </nav>
          </div>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
