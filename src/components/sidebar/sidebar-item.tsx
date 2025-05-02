import { Link } from "@nextui-org/react";
import clsx from "clsx";
import NextLink from "next/link";
import React from "react";

import { useSidebarContext } from "../layout/layout-context";

interface SidebarItemProps {
  title: string;
  icon: React.ReactNode;
  href?: string;
  isActive?: boolean;
  onClick?: () => void;
}

export const SidebarItem = ({
  title,
  icon,
  href,
  isActive,
  onClick,
}: SidebarItemProps) => {
  const { collapsed } = useSidebarContext();

  const classNames = clsx(
    "flex items-center rounded-md p-2 text-sm font-medium transition-all duration-300 ease-in-out",
    {
      "bg-primary-500/10 dark:bg-white/30": isActive, // Light blue background in light mode, subtle white in dark
      "hover:bg-gray-100 dark:hover:bg-gray-700": !isActive,
    },
  );

  const iconWrapper = (
    <span
      className={clsx(
        "flex h-6 w-6 min-w-[24px] items-center justify-center transition-colors duration-300",
        {
          "text-primary-600 dark:text-white": isActive,
          "text-gray-600 dark:text-gray-400": !isActive,
        },
      )}
    >
      {icon}
    </span>
  );

  const textClassNames = clsx(
    "transition-all duration-300 ease-in-out origin-left",
    {
      "opacity-0 scale-95 w-0 overflow-hidden": collapsed,
      "opacity-100 scale-100 ml-3 w-auto": !collapsed,
      "font-bold text-primary-600 dark:text-white": isActive, // Blue in light, white in dark
      "text-gray-700 dark:text-gray-300": !isActive,
    },
  );

  const content = (
    <>
      {iconWrapper}
      <span className={textClassNames} aria-hidden="true">
        {title}
      </span>
    </>
  );

  if (href) {
    return (
      <Link
        as={NextLink}
        href={href}
        className={classNames}
        aria-label={href}
        title={title}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      className={classNames}
      aria-label={title}
      title={title}
    >
      {content}
    </button>
  );
};
