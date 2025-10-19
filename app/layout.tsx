import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import Provider from "./_trpc/Provider";

const cairo = Cairo({
  subsets: ["arabic"],
  weight: ["400", "600", "700"],
  variable: "--font-cairo",
});

export const metadata: Metadata = {
  title: "بوابة سبق الذكية - صحيفة سبق الإلكترونية",
  description: "بوابة إعلامية ذكية تقدم أحدث الأخبار والتحليلات مع دعم الذكاء الاصطناعي",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${cairo.variable} font-sans antialiased`}>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
