import { render, screen, fireEvent } from "@testing-library/react";
import { useTheme } from "next-themes";
import React from "react";

import { NotificationsDropdown } from "./notifications-dropdown";


// Mock dependencies
jest.mock("../icons/navbar/notification-icon", () => ({
  NotificationIcon: () => <svg data-testid="notification-icon" />,
}));

jest.mock("next-themes", () => ({
  useTheme: jest.fn(),
}));

describe("NotificationsDropdown", () => {
  const mockUseTheme = useTheme as jest.Mock;

  beforeEach(() => {
    mockUseTheme.mockReturnValue({
      theme: "light",
      setTheme: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly in light mode", () => {
    const { container } = render(<NotificationsDropdown />);

    // Verify trigger button
    const button = screen.getByRole("button", { name: "Notifications" });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("bg-transparent");
    expect(button).toHaveAttribute("type", "button"); // Added for accessibility

    // Verify icon
    expect(screen.getByTestId("notification-icon")).toBeInTheDocument();

    expect(container).toMatchSnapshot();
  });

  it("renders correctly in dark mode", () => {
    mockUseTheme.mockReturnValue({
      theme: "dark",
      setTheme: jest.fn(),
    });

    render(<NotificationsDropdown />);

    const button = screen.getByRole("button", { name: "Notifications" });
    expect(button).toBeInTheDocument();

    // Verify dark mode classes
    expect(screen.getByTestId("notification-icon")).toHaveClass(
      "text-gray-300",
    );
  });

  it("opens dropdown when clicked", async () => {
    render(<NotificationsDropdown />);

    const button = screen.getByRole("button", { name: "Notifications" });
    fireEvent.click(button);

    // Verify dropdown content
    expect(screen.getByText("Notifications")).toBeInTheDocument();
    expect(screen.getByText("Edit your information")).toBeInTheDocument();
    expect(screen.getByText(/Sint occaecat cupidatat/)).toBeInTheDocument();
  });

  it("applies correct classes based on theme", () => {
    // Test light mode classes
    const { rerender } = render(<NotificationsDropdown />);
    fireEvent.click(screen.getByRole("button", { name: "Notifications" }));

    expect(screen.getByRole("menu")).toHaveClass("bg-white");
    expect(screen.getByText("Notifications")).toHaveClass("text-gray-800");

    // Test dark mode classes
    mockUseTheme.mockReturnValue({
      theme: "dark",
      setTheme: jest.fn(),
    });

    rerender(<NotificationsDropdown />);
    fireEvent.click(screen.getByRole("button", { name: "Notifications" }));

    expect(screen.getByRole("menu")).toHaveClass("bg-gray-900");
    expect(screen.getByText("Notifications")).toHaveClass("text-gray-300");
  });

  it("has proper accessibility attributes", () => {
    render(<NotificationsDropdown />);

    const button = screen.getByRole("button", { name: "Notifications" });
    expect(button).toHaveAttribute("aria-label", "Notifications");
    expect(button).toHaveAttribute("type", "button");

    fireEvent.click(button);
    expect(screen.getByRole("menu")).toHaveAttribute(
      "aria-label",
      "Notifications",
    );
  });
});
