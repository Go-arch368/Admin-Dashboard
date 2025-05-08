"use client";
import React from "react";
import { Footer } from "../Footer";
import { useLockedBody } from "../hooks/useBodyLock";
import { NavbarWrapper } from "../navbar/navbar";
import { SidebarWrapper } from "../sidebar/SideBar";
import { SidebarContext } from "./layout-context";

interface Props {
  children: React.ReactNode;
}

export const Layout = ({ children }: Props) => {
  const [mounted, setMounted] = React.useState(false);
  const [collapsed, setCollapsed] = React.useState(true);
  const [, setLocked] = useLockedBody(false);

  const handleToggleSidebar = () => {
    setCollapsed((prev) => {
      const next = !prev;

      if (window.innerWidth < 768) {
        setLocked(next);
      } else {
        setLocked(false);
      }

      return next;
    });
  };

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <SidebarContext.Provider
      value={{
        collapsed,
        setCollapsed: handleToggleSidebar,
      }}
    >
      <div className="flex min-h-screen w-full flex-col">
        <div className="fixed left-0 top-0 z-50 w-full">
          <NavbarWrapper>
            <div></div>
          </NavbarWrapper>
        </div>
        <div className="flex flex-1">
          <div>
            <SidebarWrapper />
          </div>
          <main
            className={`transition-all duration-300 ease-in-out ${
              collapsed ? "md:ml-16 ml-0" : "md:ml-64 ml-0"
            } flex-1 overflow-auto pt-14`}
          >
            {children}
          </main>
        </div>
        {/* <div className="relative z-50">
          <Footer />
        </div> */}
      </div>
    </SidebarContext.Provider>
  );
};