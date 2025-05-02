// components/client-layout-wrapper.tsx
"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Layout } from "./layout";

export default function ClientLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showLayout, setShowLayout] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("login") === "true";

    const shouldShowLayout = isLoggedIn;

    setShowLayout(shouldShowLayout);
  }, [pathname]);

  return showLayout ? <Layout>{children}</Layout> : children;
}
