"use client";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownSection,
} from "@nextui-org/react";
import { useTheme } from "next-themes";
import React, { useState } from "react";

import { AcmeIcon } from "../icons/acme-icon";
import { AcmeLogo } from "../icons/acme-logo";
import { BottomIcon } from "../icons/sidebar/bottom-icon";
import { Box } from "../styles/box";
import { Flex } from "../styles/flex";

interface Company {
  name: string;
  location: string;
  logo: React.ReactNode;
}

const IconWrapper = ({
  icon,
  className,
}: {
  icon: React.ReactElement<{ className?: string }>;
  className?: string;
}) =>
  React.cloneElement(icon, {
    className: `${icon.props.className || ""} ${className || ""}`.trim(),
  });

export const CompaniesDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [company, setCompany] = useState<Company>({
    name: "Acme Co.",
    location: "Palo Alto, CA",
    logo: <IconWrapper icon={<AcmeIcon />} className="h-6 w-6 text-white" />,
  });

  return (
    <Dropdown
      placement="bottom-end"
      className="font-medium"
      isOpen={isOpen}
      onOpenChange={setIsOpen}
    >
      <DropdownTrigger>
        <Box
          as="button" // Make it a button element
          type="button"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          className="cursor-pointer focus:outline-none aria-expanded:scale-[0.97] aria-expanded:opacity-70"
        >
          <Flex align="center" className="gap-4">
            {company.logo}
            <Box className="ml-1 text-left">
              <h3
                className={`-mb-1 text-xl font-medium leading-5 ${isDark ? "text-zinc-200" : "text-zinc-700"}`}
              >
                {company.name}
              </h3>
              <span
                className={`text-xs font-medium ${isDark ? "text-zinc-400" : "text-zinc-500"}`}
              >
                {company.location}
              </span>
            </Box>
            <IconWrapper
              icon={<BottomIcon />}
              className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              } ${isDark ? "text-gray-500" : "text-black"}`}
            />
          </Flex>
        </Box>
      </DropdownTrigger>

      <DropdownMenu
        aria-labelledby="company-dropdown-label"
        onAction={(key) => {
          const companies = {
            "1": {
              name: "Facebook",
              location: "San Francisco, CA",
              logo: (
                <IconWrapper
                  icon={<AcmeIcon />}
                  className={`h-8 w-8 ${isDark ? "text-white" : "text-white"}`}
                />
              ),
            },
            "2": {
              name: "Instagram",
              location: "Austin, TX",
              logo: (
                <IconWrapper
                  icon={<AcmeLogo />}
                  className={`h-8 w-8 ${isDark ? "text-white" : "text-white"}`}
                />
              ),
            },
            "3": {
              name: "Twitter",
              location: "Brooklyn, NY",
              logo: (
                <IconWrapper
                  icon={<AcmeIcon />}
                  className={`h-8 w-8 ${isDark ? "text-white" : "text-white"}`}
                />
              ),
            },
            "4": {
              name: "Acme Co.",
              location: "Palo Alto, CA",
              logo: (
                <IconWrapper
                  icon={<AcmeIcon />}
                  className={`h-8 w-8 ${isDark ? "text-white" : "text-white"}`}
                />
              ),
            },
          };

          setCompany({
            ...companies[key as keyof typeof companies],
            logo: companies[key as keyof typeof companies].logo, // Use directly without extra div
          });
        }}
        className={`w-[200px] rounded-lg border py-1 shadow-sm ${
          isDark
            ? "border-gray-700 bg-gray-900 text-white"
            : "border-gray-200 bg-white text-black"
        } [&_.nextui-dropdown-item-content]:w-full [&_.nextui-dropdown-item-content]:font-semibold`}
      >
        <DropdownSection
          title="Companies"
          className={`px-1 [&>h2]:px-2 [&>h2]:py-1 [&>h2]:text-xs [&>h2]:font-medium ${
            isDark ? "text-gray-400" : "text-gray-500"
          }`}
          showDivider
          dividerProps={{
            className: isDark ? "bg-gray-700" : "bg-gray-200",
          }}
        >
          {[
            {
              key: "1",
              name: "Facebook",
              location: "San Francisco, CA",
              icon: (
                <IconWrapper
                  icon={<AcmeIcon />}
                  className={`h-6 w-6 ${isDark ? "text-white" : "text-white"}`}
                />
              ),
            },
            {
              key: "2",
              name: "Instagram",
              location: "Austin, TX",
              icon: (
                <IconWrapper
                  icon={<AcmeLogo />}
                  className={`h-6 w-6 ${isDark ? "text-white" : "text-white"}`}
                />
              ),
            },
            {
              key: "3",
              name: "Twitter",
              location: "Brooklyn, NY",
              icon: (
                <IconWrapper
                  icon={<AcmeIcon />}
                  className={`h-6 w-6 ${isDark ? "text-white" : "text-white"}`}
                />
              ),
            },
            {
              key: "4",
              name: "Acme Co.",
              location: "Palo Alto, CA",
              icon: (
                <IconWrapper
                  icon={<AcmeIcon />}
                  className={`h-6 w-6 ${isDark ? "text-white" : "text-white"}`}
                />
              ),
            },
          ].map((item) => (
            <DropdownItem
              key={item.key}
              description={item.location}
              startContent={
                <div className="mr-2">{item.icon}</div> // Minimal wrapper without border
              }
              className={`px-2 py-1.5 text-sm ${
                isDark
                  ? "text-white hover:bg-gray-800 [&_.nextui-dropdown-item-description]:text-gray-400"
                  : "text-black hover:bg-gray-50 [&_.nextui-dropdown-item-description]:text-gray-500"
              }`}
            >
              {item.name}
            </DropdownItem>
          ))}
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  );
};
