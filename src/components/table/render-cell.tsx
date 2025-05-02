"use client";
import React from "react";

import { DeleteIcon } from "../icons/table/delete-icon";
import { EditIcon } from "../icons/table/edit-icon";
import { EyeIcon } from "../icons/table/eye-icon";

import { users } from "./data";
import { IconButton, StyledBadge } from "./table.styled";

interface Props {
  user: (typeof users)[number];
  columnKey: string | React.Key;
}

export const RenderCell = ({ user, columnKey }: Props) => {
  const cellValue = user[columnKey as keyof typeof user];

  switch (columnKey) {
    case "name":
      return (
        <div className="flex items-center gap-2">
          <img
            src={user.avatar}
            alt={user.name}
            className="h-8 w-8 rounded-md"
          />
          <span className="text-sm font-medium">{user.name}</span>
        </div>
      );

    case "role":
      return (
        <span className="text-sm font-semibold capitalize">{user.role}</span>
      );

    case "status":
      return (
        <StyledBadge type={user.status as "active" | "paused" | "vacation"}>
          {user.status}
        </StyledBadge>
      );

    case "actions":
      return (
        <div className="flex gap-2">
          <IconButton
            onClick={() => console.log("View user", user.id)}
            aria-label="View"
          >
            <EyeIcon size={20} fill="#979797" />
          </IconButton>
          <IconButton
            onClick={() => console.log("Edit user", user.id)}
            aria-label="Edit"
          >
            <EditIcon size={20} fill="#979797" />
          </IconButton>
          <IconButton
            onClick={() => console.log("Delete user", user.id)}
            aria-label="Delete"
          >
            <DeleteIcon size={20} fill="#FF0080" />
          </IconButton>
        </div>
      );

    default:
      return <span>{String(cellValue)}</span>;
  }
};
