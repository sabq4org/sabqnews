"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  FolderOpen,
  Users,
  Settings,
  ChevronRight,
} from "lucide-react";

interface AdminSidebarProps {
  open: boolean;
  onClose: () => void;
}

const menuItems = [
  {
    href: "/admin",
    label: "لوحة القيادة",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    href: "/admin/articles",
    label: "المقالات",
    icon: FileText,
    exact: false,
  },
  {
    href: "/admin/articles/new",
    label: "مقال جديد",
    icon: PlusCircle,
    exact: true,
  },
  {
    href: "/admin/categories",
    label: "التصنيفات",
    icon: FolderOpen,
    exact: false,
  },
  {
    href: "/admin/users",
    label: "المستخدمون",
    icon: Users,
    exact: false,
  },
  {
    href: "/admin/settings",
    label: "الإعدادات",
    icon: Settings,
    exact: false,
  },
];

export default function AdminSidebar({ open, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string, exact: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-30"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed right-0 top-16 h-[calc(100vh-64px)] w-64 bg-white border-l border-[#f0f0ef] shadow-lg z-40 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <nav className="p-4 space-y-2 overflow-y-auto h-full">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href, item.exact);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition group ${
                  active
                    ? "bg-blue-50 text-blue-600 font-semibold"
                    : "text-gray-700 hover:bg-[#f8f8f7]"
                }`}
              >
                <Icon size={20} />
                <span className="flex-1">{item.label}</span>
                {active && (
                  <ChevronRight
                    size={16}
                    className="opacity-0 group-hover:opacity-100 transition"
                  />
                )}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}

