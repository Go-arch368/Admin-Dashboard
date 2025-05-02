import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "next-themes";

import { CardBalance1 } from "@/components/home/card-balance1"; // Adjust the import path as necessary

// Mocking the `useTheme` hook from `next-themes`
jest.mock("next-themes", () => ({
  useTheme: jest.fn(),
}));

describe("CardBalance1", () => {
  it("renders correctly in dark theme", () => {
    // Mock the theme to 'dark'
    require("next-themes").useTheme.mockReturnValue({ theme: "dark" });

    render(
      <ThemeProvider>
        <CardBalance1 />
      </ThemeProvider>,
    );

    // Check for dark theme specific styles
    const card = screen.getByRole("card");
    expect(card).toHaveClass("bg-blue-700"); // Check if the card has the dark background
    expect(screen.getByText("Auto Insurance")).toBeInTheDocument(); // Check text content
    expect(screen.getByText("$45,910")).toBeInTheDocument(); // Check balance
  });

  it("renders correctly in light theme", () => {
    // Mock the theme to 'light'
    require("next-themes").useTheme.mockReturnValue({ theme: "light" });

    render(
      <ThemeProvider>
        <CardBalance1 />
      </ThemeProvider>,
    );

    // Check for light theme specific styles
    const card = screen.getByRole("card");
    expect(card).toHaveClass("bg-blue-600"); // Check if the card has the light background
    expect(screen.getByText("Auto Insurance")).toBeInTheDocument(); // Check text content
    expect(screen.getByText("$45,910")).toBeInTheDocument(); // Check balance
  });

  it("displays the correct metrics", () => {
    require("next-themes").useTheme.mockReturnValue({ theme: "dark" });

    render(
      <ThemeProvider>
        <CardBalance1 />
      </ThemeProvider>,
    );

    // Check for all metric values
    expect(screen.getByText("100,930")).toBeInTheDocument(); // First metric (USD)
    expect(screen.getByText("54,120")).toBeInTheDocument(); // Second metric (USD)
    expect(screen.getByText("125")).toBeInTheDocument(); // VIP count
  });

  it("renders the icon", () => {
    require("next-themes").useTheme.mockReturnValue({ theme: "dark" });

    render(
      <ThemeProvider>
        <CardBalance1 />
      </ThemeProvider>,
    );

    // Check if the icon is rendered
    expect(screen.getByRole("img")).toBeInTheDocument(); // Assuming the icon is rendered as an <img> tag
  });
});
