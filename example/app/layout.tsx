import type { Metadata } from "next";
import { IBM_Plex_Sans_Arabic, IBM_Plex_Sans } from "next/font/google";

import "./globals.css";

const arabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-arabic"
});

const latin = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-latin"
});

export const metadata: Metadata = {
  title: "لوحة اختبار تفقيط",
  description: "واجهة تجربة سريعة لـ package tafqit مع أمثلة جاهزة وإعدادات واضحة"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${arabic.variable} ${latin.variable}`}>{children}</body>
    </html>
  );
}
