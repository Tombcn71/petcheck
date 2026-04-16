import type { Metadata, Viewport } from "next"; // Viewport toegevoegd
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

// PWA Instellingen in de Metadata
export const metadata: Metadata = {
  title: "PetCheck.ai - Slimme zorg voor je hond",
  description: "AI-gestuurde gezondheidscheck voor honden",
  manifest: "/manifest.json", // Koppel je manifest.json uit de public map
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "PetCheck.ai",
  },
};

// Viewport instellingen (vervangt oude theme-color meta tags)
export const viewport: Viewport = {
  themeColor: "#4FC3F7",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="nl">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ClerkProvider>
          {/* DE GESTYLEDE NAVBAR */}
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

          {/* NAVBAR CSS SPECIFIEK VOOR DE LAYOUT */}
          <style>{`
            .navbar-wrapper {
              width: 100%;
              position: sticky;
              top: 0;
              background: rgba(255, 255, 255, 0.85);
              backdrop-filter: blur(12px);
              border-bottom: 1px solid #F3F4F6;
              z-index: 100;
            }
            .navbar {
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 12px 20px;
              max-width: 1200px;
              margin: 0 auto;
            }
            .nav-logo { display: flex; align-items: center; gap: 8px; text-decoration: none; }
            .nav-logo-icon { 
              font-size: 18px; 
              background: #4FC3F7; 
              width: 32px; 
              height: 32px; 
              display: flex; 
              align-items: center; 
              justify-content: center; 
              border-radius: 8px; 
            }
            .nav-logo-text { 
              font-family: 'Syne', sans-serif; 
              font-size: 18px; 
              font-weight: 800; 
              color: #1A1A2E; 
              letter-spacing: -0.5px; 
            }
            .nav-links { display: flex; gap: 16px; align-items: center; }
            .nav-links a { 
              text-decoration: none; 
              color: #6B6B8A; 
              font-size: 14px; 
              font-weight: 500; 
            }
            .btn-nav { 
              background: #1A1A2E; 
              color: #FFFFFF !important; 
              padding: 8px 16px; 
              border-radius: 8px; 
              font-weight: 600; 
              font-size: 13px; 
              border: none; 
              cursor: pointer;
            }
            .btn-nav-outline {
              background: transparent;
              color: #1A1A2E;
              font-weight: 600;
              font-size: 13px;
              border: none;
              cursor: pointer;
            }
            @media (max-width: 640px) {
              .hidden-mobile { display: none; }
            }
          `}</style>
        </ClerkProvider>
      </body>
    </html>
  );
}
