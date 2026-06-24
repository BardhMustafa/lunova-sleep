import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import { getLocale } from "@/lib/i18n/server";
import "./globals.css";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Lunova Sleep — Beds made simple, beautiful, within reach",
    template: "%s · Lunova Sleep",
  },
  description:
    "Lunova Sleep designs simple, good-looking beds for real life — quietly beautiful, budget-friendly, and built for the kind of rest you feel the next morning.",
  metadataBase: new URL("https://lunovasleep.com"),
  openGraph: {
    title: "Lunova Sleep",
    description: "Beds made simple, beautiful, and within reach.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = getLocale();
  return (
    <html lang={locale} className={`${display.variable} ${body.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
