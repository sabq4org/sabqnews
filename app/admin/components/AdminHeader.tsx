"use client";

import { Menu, X, LogOut, Settings } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useRouter } from "next/navigation";

interface AdminHeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  title: string;
}

export default function AdminHeader({
  sidebarOpen,
  setSidebarOpen,
  title,
}: AdminHeaderProps) {
  const router = useRouter();
  const { data: user } = trpc.auth.me.useQuery();
  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      router.push("/login");
    },
  });

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-[#f0f0ef] shadow-sm z-40">
      <div className="h-full px-4 md:px-8 flex items-center justify-between">
        {/* Left Side - Menu Button & Title */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-2 hover:bg-[#f8f8f7] rounded-lg transition"
            aria-label="Toggle menu"
          >
            {sidebarOpen ? (
              <X size={24} className="text-gray-700" />
            ) : (
              <Menu size={24} className="text-gray-700" />
            )}
          </button>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">
            {title}
          </h1>
        </div>

        {/* Right Side - User Menu */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-[#f8f8f7] rounded-lg">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
              {user?.name?.charAt(0) || "A"}
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.role}</p>
            </div>
          </div>

          <button
            onClick={() => logoutMutation.mutate()}
            className="p-2 hover:bg-[#f8f8f7] rounded-lg transition text-gray-700"
            title="تسجيل الخروج"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}

