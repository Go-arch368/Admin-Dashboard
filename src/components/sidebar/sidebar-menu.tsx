"use client";

import React from "react";

import { Flex } from "../styles/flex";

interface Props {
  title: string;
  children?: React.ReactNode;
}

export const SidebarMenu = ({ title, children }: Props) => (
  <Flex direction="column" className="gap-4">
    <span className="text-xs font-normal uppercase leading-4 tracking-wide text-zinc-500 dark:text-zinc-400">
      {title}
    </span>
    {children}
  </Flex>
);
