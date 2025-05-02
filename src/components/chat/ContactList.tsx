import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react";
import classNames from "classnames";
import { CircleUser } from "lucide-react";
import { useState } from "react";

import Contact from "../../types/Contact";

type Props = {
  contacts: Contact[];
  selectedContact: Contact | null;
  onSelect: (contact: Contact) => void;
};

const statusOptions = [
  { label: "Online", color: "bg-green-500" },
  { label: "Busy", color: "bg-red-500" },
  { label: "Offline", color: "bg-gray-400" },
];

export default function ContactList({ contacts, selectedContact, onSelect }: Props) {
  const [selectedStatus, setSelectedStatus] = useState(statusOptions[0]);
  const isDark = false; // Replace with theme state if needed

  return (
    <div className="w-1/3 border-r border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-900 flex flex-col h-full">
      {/* Header with user info and status dropdown */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-300 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="relative">
            <CircleUser className="h-9 w-9 text-gray-600 dark:text-gray-300" />
            <span
              className={classNames(
                "absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white dark:border-black",
                selectedStatus.color
              )}
            />
          </div>
          <div>
            <div className="text-sm font-medium text-black dark:text-white">Zoey</div>
            <div className="text-xs text-gray-500 dark:text-white">{selectedStatus.label}</div>
          </div>
        </div>

        {/* Dropdown */}
        <Dropdown>
          <DropdownTrigger>
            <button title="round" className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 12h.01M12 12h.01M18 12h.01" />
              </svg>
            </button>
          </DropdownTrigger>

          <DropdownMenu
            aria-label="Change Status"
            className={`w-40 rounded-lg p-2 shadow-xl ${isDark ? "bg-zinc-900 text-white" : "bg-white text-black"}`}
          >
            {statusOptions.map((status) => (
              <DropdownItem
                key={status.label}
                onClick={() => setSelectedStatus(status)}
                className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-800"
              >
                <span className={`h-2.5 w-2.5 rounded-full ${status.color}`} />
                {status.label}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
      </div>

      {/* Contact list */}
      <h2 className="px-6 pt-4 text-xl font-normal text-blue-500">Chats</h2>
      <div className="overflow-y-auto scrollbar-hide">
        {contacts.map((contact) => (
          <div
            key={contact.id}
            onClick={() => onSelect(contact)}
            className={classNames(
              "flex cursor-pointer items-center gap-3 p-3 hover:bg-gray-200 dark:hover:bg-zinc-700",
              selectedContact?.id === contact.id ? "bg-gray-200 shadow dark:bg-zinc-700" : "",
              "border-b border-gray-300 dark:border-zinc-800"
            )}
          >
            <div className="relative">
              <CircleUser className="h-10 w-10 text-gray-600 dark:text-gray-300" />
              <span
                className={classNames(
                  "absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white dark:border-black",
                  statusColor[contact.status]
                )}
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-medium">{contact.name}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">{contact.time}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="w-[140px] truncate text-sm text-gray-600 dark:text-white">
                  {contact.recentMsg}
                </span>
                {contact.unread > 0 && (
                  <span className="ml-2 rounded-full bg-green-500 px-2 text-xs text-white">{contact.unread}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const statusColor: Record<string, string> = {
  online: "bg-green-500",
  offline: "bg-gray-400",
  busy: "bg-red-500",
};
