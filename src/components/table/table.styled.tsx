import React from "react";

import { cn } from "@/lib/utils";

interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  children: React.ReactNode;
}

export const IconButton = ({
  className,
  children,
  ...props
}: IconButtonProps) => (
  <button
    className={cn(
      "flex cursor-pointer items-center justify-center border-none bg-transparent outline-none transition-opacity hover:opacity-80 active:opacity-60 dark:text-gray-200",
      className,
    )}
    {...props}
  >
    {children}
  </button>
);

interface StyledBadgeProps {
  type: "active" | "paused" | "vacation";
  children: React.ReactNode;
}

const badgeVariants = {
  active: "bg-green-200 dark:bg-green-800 text-green-700 dark:text-green-200",
  paused: "bg-red-200 dark:bg-red-800 text-red-700 dark:text-red-200",
  vacation:
    "bg-yellow-200 dark:bg-yellow-800 text-yellow-700 dark:text-yellow-200",
};

export const StyledBadge = ({ type, children }: StyledBadgeProps) => (
  <span
    className={cn(
      "mx-1 inline-block rounded-[14px] px-3 py-1 text-center text-[10px] font-bold uppercase leading-none tracking-wider shadow-sm",
      badgeVariants[type],
    )}
  >
    {children}
  </span>
);
