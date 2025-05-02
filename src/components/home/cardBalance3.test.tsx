import { render, screen } from "@testing-library/react";

import { CardBalance3 } from "@/components/home/card-balance3"; // Adjust the import path as necessary
import "@testing-library/jest-dom";

describe("CardBalance3", () => {
  it("should render the component with correct content", () => {
    render(<CardBalance3 />);

    // Check for the presence of elements in the component
    expect(screen.getByText("Balance Insurance")).toBeInTheDocument();
    expect(screen.getByText("1311 Cars")).toBeInTheDocument();
    expect(screen.getByText("$3,910")).toBeInTheDocument();
    expect(screen.getByText("+ 4.5%")).toBeInTheDocument();
    expect(screen.getByText("100,930")).toBeInTheDocument();
    expect(screen.getByText("54,120")).toBeInTheDocument();
    expect(screen.getByText("125")).toBeInTheDocument();
    expect(screen.getByText("VIP")).toBeInTheDocument();
  });

  it("should render the Community icon", () => {
    render(<CardBalance3 />);

    const icon = screen.getByTestId("community-icon"); // You need to add data-testid="community-icon" in the Community component
    expect(icon).toBeInTheDocument();
  });

  it("should render with correct text colors", () => {
    render(<CardBalance3 />);

    // Check the text colors
    expect(screen.getByText("Balance Insurance")).toHaveClass("text-gray-900");
    expect(screen.getByText("1311 Cars")).toHaveClass("text-gray-900");
    expect(screen.getByText("$3,910")).toHaveClass("text-gray-900");
    expect(screen.getByText("+ 4.5%")).toHaveClass("text-gray-900");
    expect(screen.getByText("100,930")).toHaveClass("text-gray-900");
    expect(screen.getByText("54,120")).toHaveClass("text-gray-900");
    expect(screen.getByText("125")).toHaveClass("text-gray-900");
    expect(screen.getByText("VIP")).toHaveClass("text-gray-900");
  });
});
