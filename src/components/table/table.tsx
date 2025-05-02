"use client";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
} from "@nextui-org/react";
import React, { useState } from "react";

import { columns, users } from "./data";
import { RenderCell } from "./render-cell";

const ITEMS_PER_PAGE = 5; // Reduced from 8

const CustomPagination = ({
  total,
  currentPage,
  onChange,
}: {
  total: number;
  currentPage: number;
  onChange: (page: number) => void;
}) => {
  const pages = Array.from({ length: Math.min(total, 5) }, (_, i) => i + 1); // Limit to 5 pages

  return (
    <ul className="mx-auto mt-4 flex max-w-fit gap-1 rounded-medium">
      <li>
        <Button
          isDisabled={currentPage === 1}
          onPress={() => onChange(currentPage - 1)}
          className="h-8 w-8 bg-default-100"
        >
          &lt;
        </Button>
      </li>
      {pages.map((p) => (
        <li key={p}>
          <Button
            onPress={() => onChange(p)}
            className={`h-8 w-8 ${
              p === currentPage ? "bg-blue-50 text-blue-600" : "bg-default-100"
            }`}
          >
            {p}
          </Button>
        </li>
      ))}
      <li>
        <Button
          isDisabled={currentPage === total}
          onPress={() => onChange(currentPage + 1)}
          className="h-8 w-8 bg-default-100"
        >
          &gt;
        </Button>
      </li>
    </ul>
  );
};

export const TableWrapper = () => {
  const [page, setPage] = useState(1);
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());

  const pages = Math.ceil(users.length / ITEMS_PER_PAGE);
  const start = (page - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  const paginatedUsers = users.slice(start, end);

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[600px]">
        <Table
          aria-label="Table"
          isHeaderSticky
          removeWrapper
          classNames={{
            table: "w-full text-sm",
            th: "px-4 py-3",
            td: "px-4 py-2",
          }}
          selectionMode="multiple"
          selectedKeys={selectedKeys}
          onSelectionChange={(keys) =>
            setSelectedKeys(new Set(keys as Set<string>))
          }
          bottomContent={
            pages > 1 && (
              <CustomPagination
                total={pages}
                currentPage={page}
                onChange={(p) => setPage(p)}
              />
            )
          }
        >
          <TableHeader>
            {columns.map((column) => (
              <TableColumn key={column.uid} align="start">
                {column.name}
              </TableColumn>
            ))}
          </TableHeader>
          <TableBody items={paginatedUsers}>
            {(item) => (
              <TableRow key={item.id}>
                {(columnKey) => (
                  <TableCell>{RenderCell({ user: item, columnKey })}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TableWrapper;
