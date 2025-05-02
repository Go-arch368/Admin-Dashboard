"use client";
import { HeroUIProvider } from "@heroui/react"; // ✅ Import HeroUI
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useEffect, useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <NextUIProvider>
      <NextThemesProvider attribute="class" defaultTheme="light">
        <HeroUIProvider>
          <main className="bg-background text-foreground">{children}</main>
        </HeroUIProvider>
      </NextThemesProvider>
    </NextUIProvider>
  );
}
