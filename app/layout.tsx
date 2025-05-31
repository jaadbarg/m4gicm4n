import type { Metadata } from "next";
import { Inter, Orbitron, Cinzel } from "next/font/google";
import "./globals.css";

// Modern, clean font for body text
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// Futuristic font for tech elements
const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  display: "swap",
});

// Elegant, mystical font for the title
const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Meet the Magic Man",
  description: "Experience mystical conversations with the Magic Man - an enchanting AI companion powered by ElevenLabs. Speak with the keeper of ancient wisdom and whimsical wonders.",
  keywords: ["AI", "conversational AI", "Magic Man", "ElevenLabs", "voice chat", "mystical", "wizard"],
  authors: [{ name: "JBar Ventures" }],
  creator: "JBar Ventures",
  publisher: "JBar Ventures",
  
  // Open Graph / Social Media
  openGraph: {
    title: "Meet the Magic Man",
    description: "Experience mystical conversations with the Magic Man - an enchanting AI companion. Speak with the keeper of ancient wisdom and whimsical wonders.",
    url: "https://m4gicm4n.com",
    siteName: "Magic Man AI",
    images: [
      {
        url: "/magic-man-og.png",
        width: 1200,
        height: 630,
        alt: "The Magic Man - Mystical AI Companion",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  
  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "Meet the Magic Man",
    description: "Experience mystical conversations with the Magic Man - an enchanting AI companion powered by ElevenLabs.",
    images: ["/magic-man-og.png"],
    creator: "@jbarventures",
  },
  
  
  // App-specific
  applicationName: "Magic Man AI",
  category: "entertainment",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${orbitron.variable} ${cinzel.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}