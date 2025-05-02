"use client";

import { Button, Input } from "@nextui-org/react";
import Link from "next/link";
import React from "react";

import { Breadcrumbs, Crumb, CrumbLink } from "../breadcrumb/breadcrumb.styled";
import { DotsIcon } from "../icons/accounts/dots-icon";
import { ExportIcon } from "../icons/accounts/export-icon";
import { InfoIcon } from "../icons/accounts/info-icon";
import { TrashIcon } from "../icons/accounts/trash-icon";
import { HouseIcon } from "../icons/breadcrumb/house-icon";
import { UsersIcon } from "../icons/breadcrumb/users-icon";
import { SettingsIcon } from "../icons/sidebar/settings-icon";
import { Flex } from "../styles/flex";
import { TableWrapper } from "../table/table";

import { AddUser } from "./add-user";

export const Accounts = () => (
  <Flex
    direction="column"
    justify="center"
    className="mb-7 mt-2 px-2 text-gray-900 dark:text-gray-100 sm:mt-4 sm:px-4"
  >
    {/* Breadcrumbs */}
    <Breadcrumbs>
      <Crumb>
        <HouseIcon />
        <Link href="/" passHref legacyBehavior>
          <CrumbLink className="dark:text-gray-200">Home</CrumbLink>
        </Link>
        <span>/</span>
      </Crumb>

      <Crumb>
        <UsersIcon />
        <CrumbLink className="dark:text-gray-200">Users</CrumbLink>
        <span>/</span>
      </Crumb>

      <Crumb>
        <CrumbLink className="dark:text-gray-200">List</CrumbLink>
      </Crumb>
    </Breadcrumbs>

    <h3 className="mt-4 text-2xl font-semibold dark:text-white">
      All Accounts
    </h3>

    {/* Controls and Filters */}
    <Flex
      align="center"
      justify="between"
      wrap="wrap"
      className="mb-7 mt-4 gap-2"
    >
      <Flex align="center" className="flex-wrap gap-3 sm:flex-nowrap">
        <Input
          variant="bordered"
          placeholder="Search users"
          size="md"
          className="w-full max-w-[410px]"
          classNames={{
            inputWrapper:
              "bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-md px-3 py-2",
            input: "text-gray-900 dark:text-gray-100 placeholder:text-gray-400",
          }}
        />

        <SettingsIcon />
        <TrashIcon />
        <InfoIcon />
        <DotsIcon />
      </Flex>

      <Flex direction="row" wrap="wrap" className="gap-3">
        <AddUser />
        <Button
          color="primary"
          endContent={<ExportIcon />}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow transition-all hover:bg-blue-700"
        >
          Export to CSV
        </Button>
      </Flex>
    </Flex>

    {/* Table */}
    <TableWrapper />
  </Flex>
);
