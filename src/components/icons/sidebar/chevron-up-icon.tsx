import React from "react";

import { Svg } from "../../styles/svg";

interface Props extends React.SVGAttributes<SVGElement> {
  className?: string;
}

export const ChevronUpIcon = ({ className, ...props }: Props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width="10" // Adjust width and height here to make it smaller
    height="5"
    viewBox="0 0 24 24"
    {...props}
    className={className}
  >
    <Svg.Path
      d="m6.293 13.293 1.414 1.414L12 10.414l4.293 4.293 1.414-1.414L12 7.586z"
      fill="#A1A1AA"
    />
  </Svg>
);
