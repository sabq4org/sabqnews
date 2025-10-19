"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";

export default function ClientLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // إخفاء Header و Footer من صفحات Admin و Login
  const shouldRenderHeaderFooter = !pathname.startsWith("/admin") && pathname !== "/login";

  return (
    <>
      {shouldRenderHeaderFooter && <Header />}
      {children}
      {shouldRenderHeaderFooter && <Footer />}
    </>
  );
}

