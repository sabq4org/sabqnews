import type { Metadata } from "next";
import { IBM_Plex_Sans_Arabic } from "next/font/google";
import "./globals.css";
import Provider from "./_trpc/Provider";
import { ThemeProvider } from "@/components/ThemeProvider";
import ClientLayoutWrapper from "@/components/ClientLayoutWrapper";



const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-ibm-plex-arabic",
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
      <body className={`${ibmPlexArabic.variable} font-sans antialiased`}>
        <ThemeProvider>
          <Provider>
            
            <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
            
          </Provider>
        </ThemeProvider>
      </body>
    </html>
  );
}
