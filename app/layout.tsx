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
  title: "Magic Man - Mystical Conversational AI",
  description: "Chat with the Magic Man, a mystical dickhead",
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