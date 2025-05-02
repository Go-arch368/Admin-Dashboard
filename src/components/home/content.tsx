"use client";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import React from "react";

import { Box } from "../styles/box";
import { Flex } from "../styles/flex";

// Dynamic imports with SSR enabled
const Chart = dynamic(() => import("../charts/steam").then(mod => mod.Steam), { ssr: true });
const CardBalance1 = dynamic(() => import("./card-balance1").then(mod => mod.CardBalance1), { ssr: true });
const CardBalance2 = dynamic(() => import("./card-balance2").then(mod => mod.CardBalance2), { ssr: true });
const CardBalance3 = dynamic(() => import("./card-balance3").then(mod => mod.CardBalance3), { ssr: true });

export const Content = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const bgColor = isDark ? "bg-black" : "bg-white";
  const textColor = isDark ? "text-white" : "text-black";
  const cardBg = isDark ? "bg-gray-900" : "bg-default-100";

  return (
    <Box className={`min-h-screen w-full px-4 py-6 lg:px-12 ${bgColor}`}>
      <Box className="mb-10">
        <h3 className={`mb-6 text-center text-2xl font-semibold lg:text-left ${textColor}`}>
          Available Balance
        </h3>
        <Flex className="flex-col gap-4 lg:flex-row lg:justify-between">
          <CardBalance1 />
          <CardBalance2 />
          <CardBalance3 />
        </Flex>
      </Box>
      <Box>
        <h3 className={`mb-6 text-center text-2xl font-semibold lg:text-left ${textColor}`}>
          Statistics
        </h3>
        <Box className={`w-full rounded-2xl px-4 py-6 shadow-lg sm:px-6 sm:py-8 ${cardBg}`}>
          <Chart />
        </Box>
      </Box>
    </Box>
  );
};