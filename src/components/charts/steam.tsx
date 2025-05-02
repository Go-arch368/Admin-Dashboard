"use client";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import React from "react";

const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export const Steam = React.memo(() => {
  Steam.displayName = "Steam";
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const series = [
    { name: "Series1", data: [31, 40, 28, 51, 42, 109, 100] },
    { name: "Series2", data: [11, 32, 45, 32, 34, 52, 41] },
  ];

  const options: ApexOptions = {
    chart: {
      type: "area",
      animations: { enabled: false },
      fontFamily: "Inter, sans-serif",
      foreColor: isDark ? "#d4d4d8" : "#64748b",
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    xaxis: {
      categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997],
      labels: {
        style: {
          colors: isDark ? "#9ca3af" : "#64748b",
          fontFamily: "Inter, sans-serif",
        },
        rotate: 0,
        trim: true,
        hideOverlappingLabels: true,
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: {
          colors: isDark ? "#9ca3af" : "#64748b",
          fontFamily: "Inter, sans-serif",
        },
        formatter: (val) => Math.round(val).toString(),
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    grid: { show: false },
    stroke: {
      curve: "smooth",
      width: 2,
      colors: ["#3b82f6", "#10b981"],
    },
    fill: { type: "solid", opacity: 0.2 },
    markers: { size: 0 },
    tooltip: { enabled: false },
    legend: { show: false },
    dataLabels: { enabled: false },
  };

  return (
    <div className="w-full">
      <div className={`w-full ${isDark ? "bg-gray-900" : "bg-white"}`}>
        <Chart
          options={options}
          series={series}
          type="area"
          height={300}
          width="100%"
        />
      </div>
    </div>
  );
});