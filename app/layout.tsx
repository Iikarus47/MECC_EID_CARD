import type { Metadata } from "next";
import "./globals.css";
import { Cairo, Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap"
});

const cairo = Cairo({
  subsets: ["latin"],
  variable: "--font-cairo",
  display: "swap"
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap"
});

export const metadata: Metadata = {
  title: "Eid Mubarak – Celestial Celebration",
  description:
    "A cinematic, interactive Eid Mubarak experience with 3D moon, lanterns, and immersive festive ambiance."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${cairo.variable} ${plusJakarta.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased bg-night-900 text-slate-100">
        {children}
      </body>
    </html>
  );
}

