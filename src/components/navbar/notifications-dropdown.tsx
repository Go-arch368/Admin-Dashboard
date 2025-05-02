"use client";

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownSection,
} from "@nextui-org/react";
import { useTheme } from "next-themes";
import React from "react";

import { NotificationIcon } from "../icons/navbar/notification-icon";

export const NotificationsDropdown = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <button
          className="cursor-pointer bg-transparent p-0"
          aria-label="Notifications"
        >
          <NotificationIcon
            className={isDark ? "text-gray-300" : "text-gray-600"}
          />
        </button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Notifications"
        classNames={{
          base: `w-[340px] shadow-xl rounded-lg p-2 ${isDark ? "bg-gray-900 text-white" : "bg-white text-black"}`,
          list: "py-0",
        }}
      >
        <DropdownSection
          title="Notifications"
          classNames={{
            heading: `text-sm font-semibold px-4 py-2 ${isDark ? "text-gray-300" : "text-gray-800"}`,
            group: "p-0",
            divider: `mt-0 ${isDark ? "bg-gray-700" : "bg-gray-200"}`,
          }}
        >
          {/* Directly use DropdownItem without wrapping in <li> */}
          <DropdownItem
            key="1"
            classNames={{
              base: `py-4 gap-3 ${isDark ? "hover:bg-gray-800" : "hover:bg-gray-50"}`,
              title: `font-semibold ${isDark ? "text-white" : "text-black"} whitespace-normal break-words`,
              description: `text-sm font-normal ${isDark ? "text-gray-400" : "text-gray-600"} whitespace-normal break-words`,
            }}
            description="Sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim."
            startContent={<span className="text-lg">📣</span>}
          >
            Edit your information
          </DropdownItem>
          {/* Add more DropdownItems as needed */}
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  );
};
