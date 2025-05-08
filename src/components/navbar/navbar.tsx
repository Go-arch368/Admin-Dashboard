"use client";
import { Navbar, NavbarContent } from "@nextui-org/react";
import { Menu, X } from "lucide-react";
import { useTheme } from "next-themes";
import React from "react";

import { useSidebarContext } from "../layout/layout-context";
import { Box } from "../styles/box";
import { DarkModeSwitch } from "./darkmodeswitch";
import FullScreenToggle from "./FullScreenToggle";
import { UserDropdown } from "./user-dropdown";

interface Props {
  children: React.ReactNode;
}

export const NavbarWrapper = ({ children }: Props) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { collapsed, setCollapsed } = useSidebarContext();

  const baseBtnClass =
    "inline-flex h-9 w-10 items-center justify-center rounded-md transition-colors hover:bg-gray-100 dark:hover:bg-gray-800";

  const toggleSidebar = () => {
    setCollapsed();
  };

  return (
    <Box
      className={`relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden ${
        isDark ? "bg-black" : "bg-white"
      }`}
    >
      <Navbar
        isBordered
        className={`relative w-full py-2 shadow-lg h-14 ${
          isDark
            ? "border-b border-gray-700 bg-black text-white"
            : "border-b border-gray-300 bg-white text-black"
        }`}
      >
        <NavbarContent justify="start">
          <li>
            <button
              className={baseBtnClass}
              onClick={toggleSidebar}
              aria-label="Toggle Sidebar"
            >
              {collapsed ? <Menu /> : <X />}
            </button>
          </li>
          <li>
            <span className="font-bold text-primary">Admin Dashboard</span>
          </li>
        </NavbarContent>

        <NavbarContent justify="end" className="block xl:hidden">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className={baseBtnClass}>
              <DarkModeSwitch />
            </div>
            <div className={baseBtnClass}>
              <FullScreenToggle />
            </div>
            <UserDropdown />
          </div>
        </NavbarContent>

        <div className="absolute right-4 top-1/2 z-50 hidden -translate-y-1/2 items-center gap-3 xl:flex">
          <div className={baseBtnClass}>
            <DarkModeSwitch />
          </div>
          <div className={baseBtnClass}>
            <FullScreenToggle />
          </div>
          <UserDropdown />
        </div>
      </Navbar>
      <div className="flex-1 overflow-y-auto pt-14 md:pt-0 px-4">{children}</div>
    </Box>
  );
};