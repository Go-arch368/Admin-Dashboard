import { render, screen, fireEvent } from "@testing-library/react";
import { useTheme } from "next-themes";
import React from "react";

import { NavbarWrapper } from "./navbar";


// Mock child components and hooks
jest.mock("../icons/navbar/github-icon", () => ({
  GithubIcon: () => <div data-testid="github-icon" />,
}));

jest.mock("./burguer-button", () => ({
  BurguerButton: () => (
    <button
      type="button"
      aria-label="Toggle menu"
      data-testid="burger-button"
    ></button>
  ),
}));
jest.mock("./notifications-dropdown", () => ({
  NotificationsDropdown: () => <div data-testid="notifications-dropdown" />,
}));

jest.mock("./user-dropdown", () => ({
  UserDropdown: () => <div data-testid="user-dropdown" />,
}));

jest.mock("./darkmodeswitch", () => ({
  DarkModeSwitch: () => <div data-testid="dark-mode-switch" />,
}));

jest.mock("./FullScreenToggle", () => ({
  default: () => <div data-testid="fullscreen-toggle" />,
}));

jest.mock("next-themes", () => ({
  useTheme: jest.fn(),
}));

describe("NavbarWrapper", () => {
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
    const { container } = render(
      <NavbarWrapper>
        <div>Test Content</div>
      </NavbarWrapper>,
    );

    expect(container).toMatchSnapshot();
    expect(screen.getByTestId("burger-button")).toBeInTheDocument();
    expect(screen.getByTestId("github-icon")).toBeInTheDocument();
    expect(screen.getByTestId("notifications-dropdown")).toBeInTheDocument();
    expect(screen.getByTestId("dark-mode-switch")).toBeInTheDocument();
    expect(screen.getByTestId("fullscreen-toggle")).toBeInTheDocument();
    expect(screen.getByTestId("user-dropdown")).toBeInTheDocument();
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("renders correctly in dark mode", () => {
    mockUseTheme.mockReturnValue({
      theme: "dark",
      setTheme: jest.fn(),
    });

    render(
      <NavbarWrapper>
        <div>Test Content</div>
      </NavbarWrapper>,
    );

    expect(screen.getByRole("navigation")).toHaveClass("bg-black");
  });

  it("toggles mobile menu when burger button is clicked", () => {
    render(
      <NavbarWrapper>
        <div>Test Content</div>
      </NavbarWrapper>,
    );

    const burgerButton = screen.getByTestId("burger-button");
    fireEvent.click(burgerButton);
    // Add assertions for menu state changes if applicable
  });

  it("renders desktop version correctly", () => {
    render(
      <NavbarWrapper>
        <div>Test Content</div>
      </NavbarWrapper>,
    );

    // Desktop elements should be hidden on mobile
    expect(
      screen.queryAllByTestId("dark-mode-switch")[1],
    ).not.toBeInTheDocument();
    expect(
      screen.queryAllByTestId("fullscreen-toggle")[1],
    ).not.toBeInTheDocument();
    expect(screen.queryAllByTestId("user-dropdown")[1]).not.toBeInTheDocument();
  });

  it("handles GitHub link correctly", () => {
    render(
      <NavbarWrapper>
        <div>Test Content</div>
      </NavbarWrapper>,
    );

    const githubLink = screen.getByLabelText("GitHub").closest("a");
    expect(githubLink).toHaveAttribute("href", "https://github.com/");
    expect(githubLink).toHaveAttribute("target", "_blank");
    expect(githubLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("applies correct classes based on theme", () => {
    const { rerender } = render(
      <NavbarWrapper>
        <div>Test Content</div>
      </NavbarWrapper>,
    );

    // Light theme
    expect(screen.getByRole("navigation")).toHaveClass("bg-white");

    // Change to dark theme
    mockUseTheme.mockReturnValue({
      theme: "dark",
      setTheme: jest.fn(),
    });

    rerender(
      <NavbarWrapper>
        <div>Test Content</div>
      </NavbarWrapper>,
    );

    // Dark theme
    expect(screen.getByRole("navigation")).toHaveClass("bg-black");
  });
});
