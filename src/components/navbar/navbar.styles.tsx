import { cn } from "@nextui-org/react"; // or use clsx/classnames
import React from "react";

// SidebarWrapper component
export const SidebarWrapper = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={cn("flex h-screen overflow-hidden", className)}>
    {children}
  </div>
);

// StyledBurgerButton component
export const StyledBurgerButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { open?: boolean }
>(({ open = false, className, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "absolute flex flex-col justify-around",
      "h-[22px] w-[22px] border-none bg-transparent",
      "z-[202] cursor-pointer p-0 focus:outline-none",
      className,
    )}
    {...props}
  >
    <div
      className={cn(
        "relative h-px w-[22px] origin-left rounded-full bg-foreground/70 transition-all duration-300 ease-in-out",
        open ? "translate-y-[1px] rotate-45" : "-translate-y-1",
      )}
    />
    <div
      className={cn(
        "relative h-px w-[22px] origin-left rounded-full bg-foreground/70 transition-all duration-300 ease-in-out",
        open ? "translate-y-0 -rotate-45" : "translate-y-1",
      )}
    />
  </button>
));

StyledBurgerButton.displayName = "StyledBurgerButton";
