"use client";
import { Navbar, NavbarContent } from "@nextui-org/react";
import React from "react";
import { Box } from "../styles/box";
import { UserDropdown } from "./user-dropdown";
import { useTheme } from "next-themes";
import { DarkModeSwitch } from "./darkmodeswitch";
import FullScreenToggle from "./FullScreenToggle";
import { useSidebarContext } from "../layout/layout-context";
import { Menu } from "lucide-react";
import LocationModal from "./LocationModal";

interface Props {
  children: React.ReactNode;
}

export const NavbarWrapper = ({ children }: Props) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { collapsed, setCollapsed } = useSidebarContext();

  const baseBtnClass =
    "inline-flex h-9 w-10 items-center justify-center rounded-md transition-colors hover:bg-gray-100 dark:hover:bg-gray-800";

  return (
    <Box
      className={`relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden ${
        isDark ? "bg-black" : "bg-white"
      }`}
    >
      <Navbar
        isBordered
        className={`relative w-full py-2 shadow-lg ${
          isDark
            ? "border-b border-gray-700 bg-black text-white"
            : "border-b border-gray-300 bg-white text-black"
        }`}
        isMenuOpen={false}
      >
        <NavbarContent justify="start">
          <li>
            <button
              className={baseBtnClass}
              onClick={setCollapsed}
              aria-label="Toggle Sidebar"
            >
              {collapsed ? <Menu /> : <Menu />}
            </button>
          </li>
          <li>
            <span className="font-bold text-primary">Admin Dashboard</span>
          </li>
          <li>
           <LocationModal/>
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
      {children}
    </Box>
  );
};
