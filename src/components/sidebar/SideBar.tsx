"use client";
import { LayoutDashboard, TableOfContents, TriangleRight } from "lucide-react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import React from "react";

import { useSidebarContext } from "../layout/layout-context";
import { SidebarItem } from "./sidebar-item";

export const SidebarWrapper = () => {
  const pathname = usePathname();
  const { collapsed, setCollapsed } = useSidebarContext();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const iconShiftClass = "pt-1 pl-1";

  return (
    <>
      {!collapsed && (
        <div
          className="fixed inset-0 z-10 bg-black/30 dark:bg-black/50 md:hidden"
          onClick={() => setCollapsed(true)}
        />
      )}
      <aside
        className={`fixed top-16 left-0 z-20 h-[calc(100vh-4rem)] transition-all duration-300 ease-in-out ${
          collapsed ? "w-0 -translate-x-full md:w-20 md:translate-x-0" : "w-64 translate-x-0"
        } ${
          isDark
            ? "border-gray-700 bg-black text-white"
            : "border-gray-200 bg-white text-gray-900"
        } border-r overflow-hidden md:overflow-visible md:border-r`}
      >
        <div className="flex h-full flex-col">
          <div className="flex-1 space-y-6 overflow-y-auto p-4">
            <SidebarItem
              title={collapsed ? "" : "Dashboard"}
              icon={<LayoutDashboard className={iconShiftClass} />}
              isActive={pathname === "/dashboard"}
              href="/dashboard"
            />
            <SidebarItem
              title={collapsed ? "" : "Content"}
              icon={<TableOfContents className={iconShiftClass} />}
              isActive={pathname === "/content"}
              href="/content"
            />
            <SidebarItem
              title={collapsed ? "" : "Crud"}
              icon={<TriangleRight className={iconShiftClass} />}
              isActive={pathname === "/crud"}
              href="/crud"
            />
          </div>
        </div>
      </aside>
    </>
  );
}