
"use client";
import { Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";

export default function ModeToggle() {
  const [mode, setMode] = useState<"light" | "dark">("light");

  useEffect(() => {
    const savedMode = localStorage.getItem("theme") as "light" | "dark" | null;
    if (savedMode) {
      setMode(savedMode);
      document.documentElement.classList.toggle("dark", savedMode === "dark");
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const initialMode = prefersDark ? "dark" : "light";
      setMode(initialMode);
      localStorage.setItem("theme", initialMode);
      document.documentElement.classList.toggle("dark", initialMode === "dark");
    }
  }, [mode]);

  const toggleMode = () => {
    const newMode = mode === "light" ? "dark" : "light";
    setMode(newMode);
    localStorage.setItem("theme", newMode);
    document.documentElement.classList.toggle("dark", newMode === "dark");
  };

  const handleKeyDown = () => {
    toggleMode();
  };

  return (
    <button
      onClick={toggleMode}
      onKeyDown={handleKeyDown}
      className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 focus:ring-2 focus:ring-gray-500"
      aria-label={`Switch to ${mode === "light" ? "dark" : "light"} mode`}
    >
      {mode === "light" ? (
        <Moon className="h-5 w-5 text-gray-800" />
      ) : (
        <Sun className="h-5 w-5 text-yellow-500" />
      )}
    </button>
  );
}
