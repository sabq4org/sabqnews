"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  FolderOpen,
  Users,
  Settings,
  LogOut,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import { useRouter } from "next/navigation";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: user, isLoading: isUserLoading } = trpc.auth.me.useQuery();

  useEffect(() => {
    if (!isUserLoading && (!user || user.role !== "admin")) {
      router.push("/login");
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f8f7]">
        <div className="text-xl font-sans">جاري التحقق من الصلاحيات...</div>
      </div>
    );
  }

  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      router.push("/login");
    },
    onError: (error) => {
      alert("خطأ في تسجيل الخروج: " + error.message);
    },
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-[#f8f8f7] font-sans flex lg:flex-row flex-col">
      {/* Sidebar */}
      <aside className={`fixed right-0 top-0 h-full w-64 bg-white border-l border-[#f0f0ef] shadow-sm z-10 flex flex-col transform ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out`}>
        <div className="p-6 flex-grow">
          <h1 className="text-2xl font-bold text-gray-800 mb-8">بوابة سبق الذكية</h1>

          <nav className="space-y-2">
            <Link
              href="/admin"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${pathname === "/admin" ? "bg-blue-50 text-blue-600 font-semibold" : "text-gray-700 hover:bg-gray-50"}`}
            >
              <LayoutDashboard size={20} />
              <span>لوحة القيادة</span>
            </Link>

            <Link
              href="/admin/articles"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${pathname.startsWith("/admin/articles") ? "bg-blue-50 text-blue-600 font-semibold" : "text-gray-700 hover:bg-gray-50"}`}
            >
              <FileText size={20} />
              <span>المقالات</span>
            </Link>

            <Link
              href="/admin/articles/new"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${pathname === "/admin/articles/new" ? "bg-blue-50 text-blue-600 font-semibold" : "text-gray-700 hover:bg-gray-50"}`}
            >
              <PlusCircle size={20} />
              <span>مقال جديد</span>
            </Link>

            <Link
              href="/admin/categories"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${pathname.startsWith("/admin/categories") ? "bg-blue-50 text-blue-600 font-semibold" : "text-gray-700 hover:bg-gray-50"}`}
            >
              <FolderOpen size={20} />
              <span>التصنيفات</span>
            </Link>

            <Link
              href="/admin/users"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${pathname.startsWith("/admin/users") ? "bg-blue-50 text-blue-600 font-semibold" : "text-gray-700 hover:bg-gray-50"}`}
            >
              <Users size={20} />
              <span>المستخدمون</span>
            </Link>

            <Link
              href="/admin/settings"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${pathname.startsWith("/admin/settings") ? "bg-blue-50 text-blue-600 font-semibold" : "text-gray-700 hover:bg-gray-50"}`}
            >
              <Settings size={20} />
              <span>الإعدادات</span>
            </Link>
          </nav>
        </div>

        <div className="p-6 border-t border-[#f0f0ef]">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition w-full"
          >
            <LogOut size={20} />
            <span>تسجيل الخروج</span>
          </button>
          <Link
            href="/"
            className="block text-center text-sm text-gray-600 hover:text-blue-600 transition mt-4"
          >
            العودة للموقع ←
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-8 lg:mr-64">
        <button
          className="lg:hidden fixed top-4 left-4 z-20 p-2 bg-blue-600 text-white rounded-md"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? '✖' : '☰'}
        </button>
        {children}
      </main>
    </div>
  );
}

