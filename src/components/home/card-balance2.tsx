"use client";

import { Card, CardBody } from "@nextui-org/react";
import { useTheme } from "next-themes";
import React from "react";

import { Community } from "../icons/community";


export const CardBalance2 = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <Card
      className={`h-full w-full rounded-xl shadow-lg ${
        isDark ? "bg-zinc-900" : "bg-gray-100"
      }`}
    >
      <CardBody className="flex h-full flex-col gap-4 p-4 sm:gap-3 sm:p-5">
        {/* Header Section */}
        <div className="flex items-start gap-3">
          <Community
            className={`h-6 w-6 ${isDark ? "text-gray-300" : "text-gray-700"}`}
          />
          <div className="flex flex-col">
            <span
              className={`text-base font-semibold ${
                isDark ? "text-white" : "text-gray-800"
              }`}
            >
              Health Insurance
            </span>
            <span
              className={`text-sm ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              +2400 People
            </span>
          </div>
        </div>

        {/* Balance Section */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
          <span
            className={`text-lg font-semibold ${
              isDark ? "text-white" : "text-black"
            }`}
          >
            $12,000
          </span>
          <span className="text-sm font-medium text-green-600">+ 2.1%</span>
        </div>

        {/* Stats Section */}
        <div className="grid flex-1 grid-cols-3 gap-2 sm:flex sm:justify-between">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1">
              <span className="text-sm font-semibold text-red-400">↓</span>
              <span
                className={`text-base font-semibold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                89,100
              </span>
            </div>
            <span
              className={`text-xs ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              USD
            </span>
          </div>

          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1">
              <span className="text-sm font-semibold text-green-400">↑</span>
              <span
                className={`text-base font-semibold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                67,230
              </span>
            </div>
            <span
              className={`text-xs ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              USD
            </span>
          </div>

          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1">
              <span className="text-sm font-semibold text-yellow-300">⭐</span>
              <span
                className={`text-base font-semibold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                312
              </span>
            </div>
            <span
              className={`text-xs ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Premium
            </span>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
