import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "next-themes"; // Ensure ThemeProvider is used

import { CardBalance2 } from "@/components/home/card-balance2"; // Adjust the import path as necessary
import "@testing-library/jest-dom";

describe("CardBalance2", () => {
  const renderWithTheme = (theme: "light" | "dark") => {
    render(
      <ThemeProvider attribute="class" defaultTheme={theme}>
        <CardBalance2 />
      </ThemeProvider>,
    );
  };

  it("should render the component in light mode", () => {
    renderWithTheme("light");

    // Check for light theme elements (e.g., text color)
    expect(screen.getByText("Health Insurance")).toHaveClass("text-gray-800");
    expect(screen.getByText("$12,000")).toHaveClass("text-black");
    expect(screen.getByText("+ 2.1%")).toHaveClass("text-green-600");
  });

  it("should render the component in dark mode", () => {
    renderWithTheme("dark");

    // Check for dark theme elements (e.g., text color)
    expect(screen.getByText("Health Insurance")).toHaveClass("text-white");
    expect(screen.getByText("$12,000")).toHaveClass("text-white");
    expect(screen.getByText("+ 2.1%")).toHaveClass("text-green-600");
  });

  it("should display the correct balance and stats", () => {
    renderWithTheme("light");

    // Test balance and stats
    expect(screen.getByText("$12,000")).toBeInTheDocument();
    expect(screen.getByText("USD")).toBeInTheDocument();
    expect(screen.getByText("67,230")).toBeInTheDocument();
    expect(screen.getByText("89,100")).toBeInTheDocument();
  });

  it("should render icons correctly", () => {
    renderWithTheme("light");

    // Assuming the Community icon is rendered
    const icon = screen.getByTestId("community-icon"); // Add data-testid in the Community component if not already
    expect(icon).toBeInTheDocument();
  });
});
