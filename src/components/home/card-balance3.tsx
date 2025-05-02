"use client";

import { Card, CardBody } from "@nextui-org/react";
import React from "react";

import { Community } from "../icons/community";
export const CardBalance3 = () => (
  <Card className="h-full w-full rounded-xl bg-green-600 shadow-lg">
    <CardBody className="flex h-full flex-col gap-4 p-4 sm:gap-3 sm:p-5">
      <div className="flex items-start gap-3">
        <Community className="h-6 w-6 text-gray-900" />
        <div className="flex flex-col">
          <span className="text-base font-semibold text-gray-900">
            Balance Insurance
          </span>
          <span className="text-sm text-gray-900">1311 Cars</span>
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
        <span className="text-lg font-semibold text-gray-900">$3,910</span>
        <span className="text-sm font-medium text-gray-900">+ 4.5%</span>
      </div>

      <div className="grid flex-1 grid-cols-3 gap-2 sm:flex sm:justify-between">
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1">
            <span className="text-sm font-semibold text-gray-900">↓</span>
            <span className="text-base font-semibold text-gray-900">
              100,930
            </span>
          </div>
          <span className="text-xs text-gray-900">USD</span>
        </div>

        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1">
            <span className="text-sm font-semibold text-gray-900">↑</span>
            <span className="text-base font-semibold text-gray-900">
              54,120
            </span>
          </div>
          <span className="text-xs text-gray-900">USD</span>
        </div>

        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1">
            <span className="text-sm font-semibold text-yellow-300">⭐</span>
            <span className="text-base font-semibold text-gray-900">125</span>
          </div>
          <span className="text-xs text-gray-900">VIP</span>
        </div>
      </div>
    </CardBody>
  </Card>
);
