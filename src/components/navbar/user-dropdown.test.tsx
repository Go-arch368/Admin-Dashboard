import { render, screen, fireEvent } from "@testing-library/react";
import { useTheme } from "next-themes";
import React from "react";

import { UserDropdown } from "./user-dropdown";


// Mock dependencies with proper ARIA roles
jest.mock("next-themes", () => ({
  useTheme: jest.fn(),
}));

jest.mock("@nextui-org/react", () => ({
  Avatar: () => <div data-testid="avatar" />,
  User: () => <div data-testid="user-profile" />,
  Dropdown: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DropdownTrigger: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DropdownMenu: ({ children }: { children: React.ReactNode }) => (
    <ul role="menu" aria-label="User menu actions">
      {children}
    </ul>
  ),
  DropdownSection: ({ children }: { children: React.ReactNode }) => (
    <li role="group">
      <ul>{children}</ul>
    </li>
  ),
}));

describe("UserDropdown", () => {
  const mockUseTheme = useTheme as jest.Mock;

  beforeEach(() => {
    mockUseTheme.mockReturnValue({
      theme: "light",
      setTheme: jest.fn(),
    });
  });

  it("has correct ARIA role hierarchy", () => {
    render(<UserDropdown />);

    fireEvent.click(screen.getByRole("button", { name: "User menu" }));

    // Verify the complete ARIA hierarchy
    const menu = screen.getByRole("menu");
    expect(menu).toBeInTheDocument();

    const groups = screen.getAllByRole("group");
    expect(groups.length).toBeGreaterThan(0);

    const menuItems = screen.getAllByRole("menuitem");
    expect(menuItems.length).toBeGreaterThan(0);

    // Verify the first menu item is the profile
    expect(menuItems[0]).toContainElement(screen.getByTestId("user-profile"));
  });
});
