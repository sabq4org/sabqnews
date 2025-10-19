"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { trpc } from "@/lib/trpc";
import AdminHeader from "./components/AdminHeader";
import AdminSidebar from "./components/AdminSidebar";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: user, isLoading: isUserLoading } = trpc.auth.me.useQuery();

  // Get page title based on pathname
  const getPageTitle = () => {
    if (pathname === "/admin") return "لوحة القيادة";
    if (pathname.startsWith("/admin/articles/new")) return "مقال جديد";
    if (pathname.startsWith("/admin/articles")) return "المقالات";
    if (pathname.startsWith("/admin/categories")) return "التصنيفات";
    if (pathname.startsWith("/admin/users")) return "المستخدمون";
    if (pathname.startsWith("/admin/settings")) return "الإعدادات";
    return "بوابة سبق الذكية";
  };

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  // Check authorization
  useEffect(() => {
    if (!isUserLoading && (!user || user.role !== "admin")) {
      router.push("/login");
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f8f7]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-lg font-medium text-gray-700">
            جاري التحقق من الصلاحيات...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f8f7]">
      {/* Header */}
      <AdminHeader
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        title={getPageTitle()}
      />

      {/* Sidebar */}
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <main className="pt-16 md:pr-64 lg:pr-72 xl:pr-80 min-h-screen">
        <div className="p-4 md:p-6 lg:p-8 max-w-full lg:max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

