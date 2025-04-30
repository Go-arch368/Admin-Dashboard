"use client";
import React from "react";
import { useLockedBody } from "../hooks/useBodyLock";
import { NavbarWrapper } from "../navbar/navbar";
import { SidebarWrapper } from "../sidebar/SideBar";
import { SidebarContext } from "./layout-context";
import { Footer } from "../Footer";

interface Props {
  children: React.ReactNode;
}

export const Layout = ({ children }: Props) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [, setLocked] = useLockedBody(false);
  const [mounted, setMounted] = React.useState(false);

  const handleToggleSidebar = () => {
    setSidebarOpen((prev) => {
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
        collapsed: !sidebarOpen,
        setCollapsed: handleToggleSidebar,
      }}
    >
      <div className="flex min-h-screen w-full flex-col">
        {/* Fixed Navbar */}
        <div className="fixed left-0 top-0 z-50 w-full">
          <NavbarWrapper>
            <div></div>
          </NavbarWrapper>
        </div>

        {/* Main content and sidebar */}
        <div className="flex flex-1">
          <div
            className={`fixed left-0 z-40 transition-all duration-300 ease-in-out ${
              sidebarOpen ? "w-50" : "w-20"
            }`}
          >
            <SidebarWrapper />
          </div>

          <main
            className={` transition-all duration-300 ease-in-out ${
              sidebarOpen ? "ml-44" : "ml-20"
            } flex-1 overflow-auto`}
          >
            {children}
          </main>
        </div>

        {/* Footer */}
        <div className="relative z-50">
          <Footer />
        </div>
      </div>
    </SidebarContext.Provider>
  );
};
