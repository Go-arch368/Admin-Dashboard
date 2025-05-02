import { useTheme } from "next-themes"; // Importing useTheme from next-themes
import React from "react";

import { Svg } from "../styles/svg";

interface AcmeLogoProps {
  className?: string;
}

export const AcmeLogo: React.FC<AcmeLogoProps> = ({ className }) => {
  const { theme } = useTheme();
  return (
    <Svg
      className={`h-6 w-6 ${className || ""}`} // Base size, overridden by IconWrapper
      fill="none"
      height="42"
      viewBox="0 0 32 32"
      width="42"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        height="100%"
        rx="8" // Slightly smaller radius for larger size
        width="100%"
        fill="black" // Inner black background
        stroke={theme === "dark" ? "#4B5563" : "#000000"}
        strokeWidth="2" // Visible border
      />
      <path
        clipRule="evenodd"
        d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
        fill="currentColor" // White from IconWrapper
        fillRule="evenodd"
      />
    </Svg>
  );
};
