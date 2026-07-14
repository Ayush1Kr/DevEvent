import type { Metadata } from "next";
import { Schibsted_Grotesk, Martian_Mono } from "next/font/google";
import "./globals.css";
import LightRays from '@/component/LightRays'
import Navbar from '@/component/Navbar'


// 1. Next.js Font Optimization:
// We use 'next/font/google' to automatically self-host Google Fonts.
// This prevents layout shifts and improves performance since fonts are bundled at build time.
const schibstedGrotesk = Schibsted_Grotesk({
  variable: "--font-schibsted-grotesk", // CSS variable name to use in Tailwind or custom CSS
  subsets: ["latin"],
});

const martianMono = Martian_Mono({
  variable: "--font-martian-mono",
  subsets: ["latin"],
});

// 2. Next.js Metadata API:
// This object configures the HTML <head> metadata (title, description, etc.) for better SEO.
// It applies to all pages unless overridden by a nested layout or page.
export const metadata: Metadata = {
  title: "DevEvent",
  description: "The Hub for Every Dev Event You Mustn't Miss.",
};

// 3. Root Layout Component:
// In the Next.js App Router, the RootLayout is the top-most component that wraps every page.
// It must define the <html> and <body> tags.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${schibstedGrotesk.variable} ${martianMono.variable} min-h-screen antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Navbar />
        <div className="fixed inset-0 z-[-1]">
          <LightRays
            raysOrigin="top-center"
            raysColor="#5dfeca"
            raysSpeed={0.5}
            lightSpread={0.9}
            rayLength={1.4}
            followMouse={true}
            mouseInfluence={0.05}
            noiseAmount={0}
            distortion={0}
            className="custom-rays w-full h-full"
            pulsating={false}
            fadeDistance={1}
            saturation={1}
          />
        </div>
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
